const {
  Transaction_List,
  Transaction_Detail,
  Transaction_Status,
} = require("../../model/transaction");
const { Cart } = require("../../model/cart.js");
const { Op } = require("sequelize");
const { Product_Detail, Product_List, Product_Unit, Product_History } = require("../../model/product");
const { middlewareErrorHandling } = require("../../middleware");
const cloudinary = require("cloudinary");
const { User_Address, User_Account, User_Profile } = require("../../model/user");

const getTransactions = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { statusId } = req.params;

    let whereCondition = {};

    if (userId === 1) {
      whereCondition = { statusId };
    } else {
      whereCondition = { userId, statusId };
    }

    const transaction = await Transaction_List?.findAll({
      include: [
        {
          model: Transaction_Status,
          as: "transactionStatus",
        },
        {
          model: Transaction_Detail,
          as: "transactionDetail",
          include: {
            model: Product_List,
            as: "listedTransaction",
          },
        },
        {
          model: User_Address,
        },
        {
          model: User_Account,
          attributes : ["email"],
          include: {
            model: User_Profile,
            as: "userProfile"
          }
        },
      ],
      where: whereCondition,
      order:[["updatedAt" , "DESC"]]
    });

    if (!transaction) throw ({
      status: middlewareErrorHandling.NOT_FOUND_STATUS,
      message: middlewareErrorHandling.TRANSACTION_NOT_FOUND
    });

    if (statusId !== 7) {
      delete transaction?.dataValues?.canceledBy;
      delete transaction?.dataValues?.message;
    }

    res.status(200).json({
      type: "success",
      message: "Here are your order lists",
      userId,
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

const getOngoingTransactions = async (req, res, next) =>{
  try {
    const { userId } = req.user;

    let whereCondition = {};

    if (userId === 1) {
      whereCondition = { statusId : { [Op.not]: [6, 7] } };
    } else {
      whereCondition = { userId, statusId : { [Op.not]: [6, 7] } };
    }

    const transactions = await Transaction_List?.findAll({
      where: whereCondition,
    });

    const statuses = await Transaction_Status?.findAll()

    const data = {
      totalTransactions: transactions.length,
      transactions : []
    }
    
    statuses.forEach(status => {
      const statusId = status.statusId;
      const statusDesc = status.statusDesc

      if (statusId !== 7 && statusId !== 6) {
        const total = transactions.filter(
          (transaction) => transaction.statusId === statusId
        ).length;
        
        data.transactions.push({statusId, statusDesc, total});
      }
    })
    
    res.status(200).json({
      type: "success",
      message: "Here are your ongoing transactions",
      data
    });
  } catch (error) {
    next(error)
  }
}

const createTransactions = async (req, res, next) => {
  try {
    //const transaction = await db.sequelize.transaction(async()=>{
    const { userId } = req.user;
    const { transport, totalPrice, addressId } = req.body;

    const startTransaction = await Cart?.findAll({
      include: [
        {
          model: Product_Detail,
          as: "product_detail",
        },
        {
          model: Product_List,
          as: "cartList",
        },
      ],
      where: { [Op.and]: [{ userId }, { inCheckOut: 1 }] },
    });

    const newTransactionList = {
      userId: userId,
      total: totalPrice + transport,
      transport: transport,
      subtotal: totalPrice,
      statusId: 1,
      addressId : addressId
    };

    const newTransaction = await Transaction_List?.create(newTransactionList);

    for (let i = 0; i < startTransaction.length; i++) {
      const newTransactionDetail = {
        transactionId: newTransaction.transactionId,
        price: startTransaction[i].cartList.productPrice,
        quantity: startTransaction[i].quantity,
        totalPrice:
          startTransaction[i].cartList.productPrice *
          startTransaction[i].quantity,
        productId: startTransaction[i].productId,
      };
      await Transaction_Detail?.create(newTransactionDetail);

      const UpdateStock = await Product_Detail?.findOne(
        { include : {model : Product_Unit, as : "product_unit"},
          where : {[Op.and]: [{productId : startTransaction[i].productId},{isDefault : 1}]}});
      let newQuantity = UpdateStock.quantity - startTransaction[i].quantity;
      if(newQuantity < 0) throw ({status : middlewareErrorHandling.BAD_REQUEST_STATUS, message : middlewareErrorHandling.ITEM_NOT_ENOUGH});
      await Product_Detail?.update({quantity : newQuantity},{where : {[Op.and]: [{productId : startTransaction[i].productId},{isDefault : 1}]}});

      console.log(UpdateStock);

      const ProductHistory = {
        productId : startTransaction[i].productId,
        unit : UpdateStock.product_unit.name,
        initialStock : UpdateStock.quantity,
        type : "UpdateStock",
        status : "Pengurangan",
        quantity : startTransaction[i].quantity,
        results : newQuantity
      }
      await Product_History?.create(ProductHistory);
    }

    const finishTransaction = await Cart?.destroy({
      where: { [Op.and]: [{ userId: userId }, { inCheckOut: 1 }] },
    });
    //});

    //await transaction.commit();

    res.status(200).json({
      type: "success",
      message: "Transaction created!",
      data: finishTransaction,
    });
  } catch (error) {
    //await transaction.rollback();
    next(error);
  }
};

const getCheckoutProducts = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const startTransaction = await Cart?.findAll({
      include: [
        {
          model: Product_Detail,
          as: "product_detail",
        },
        {
          model: Product_List,
          as: "cartList",
        },
      ],
      where: { [Op.and]: [{ userId: userId }, { inCheckOut: 1 }] },
    });
    res.status(200).json({
      type: "success",
      message: "Done!",
      data: startTransaction,
    });
  } catch (error) {
    next(error);
  }
};

const uploadPaymentProof = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { transactionId } = req.params;

    const transaction = await Transaction_List?.findOne({
      where: { [Op.and]: [{ userId }, { transactionId }] },
    });

    if (!transaction) throw ({
      status: middlewareErrorHandling.NOT_FOUND_STATUS,
      message: middlewareErrorHandling.TRANSACTION_NOT_FOUND
    });

    if (!req.file) {
      return next({
        type: "error",
        status: middlewareErrorHandling.BAD_REQUEST_STATUS,
        message: middlewareErrorHandling.IMAGE_NOT_FOUND,
      });
    }

    await transaction.update({ paymentProof: req?.file?.filename, statusId : 2 });
    await transaction.update({ statusId : 2 });

    delete transaction?.dataValues?.canceledBy;
    delete transaction?.dataValues?.message;

    res
      .status(200)
      .json({
        type: "success",
        message: "Payment proof uploaded!",
        imageURL: req?.file?.filename,
      });
  } catch (error) {
    cloudinary.v2.api.delete_resources([`${req?.file?.filename}`], {
      type: `upload`,
      resource_type: "image",
    });
    next(error);
  }
};

const confirmPayment = async (req, res, next) => {
  try {
    const { transactionId } = req.params;

    const transaction = await Transaction_List?.findOne({
      where: { transactionId },
    });

    if (!transaction) throw ({
      status: middlewareErrorHandling.NOT_FOUND_STATUS,
      message: middlewareErrorHandling.TRANSACTION_NOT_FOUND
    });

    await transaction.update({ statusId : 3 })

    delete transaction?.dataValues?.canceledBy;
    delete transaction?.dataValues?.message;

    res
      .status(200)
      .json({
        type: "success",
        message: "Payment accepted!",
        data: transaction
      });
  } catch (error) {

    next(error);
  }
};

const processOrder = async (req, res, next) => {
  try {
    const { transactionId } = req.params;

    const transaction = await Transaction_List?.findOne({
      where: { transactionId },
    });

    if (!transaction) throw ({
      status: middlewareErrorHandling.NOT_FOUND_STATUS,
      message: middlewareErrorHandling.TRANSACTION_NOT_FOUND
    });

    await transaction.update({ statusId : 4 })

    delete transaction?.dataValues?.canceledBy;
    delete transaction?.dataValues?.message;

    res
      .status(200)
      .json({
        type: "success",
        message: "Order processed!",
        data: transaction
      });
  } catch (error) {

    next(error);
  }
};

const sendOrder = async (req, res, next) => {
  try {
    const { transactionId } = req.params;

    const transaction = await Transaction_List?.findOne({
      where: { transactionId },
    });

    if (!transaction) throw ({
      status: middlewareErrorHandling.NOT_FOUND_STATUS,
      message: middlewareErrorHandling.TRANSACTION_NOT_FOUND
    });

    await transaction.update({ statusId : 5 })

    delete transaction?.dataValues?.canceledBy;
    delete transaction?.dataValues?.message;

    res
      .status(200)
      .json({
        type: "success",
        message: "Order sent!",
        data: transaction
      });
  } catch (error) {

    next(error);
  }
};

const receiveOrder = async (req, res, next) => {
  try {
    const { transactionId } = req.params;

    const transaction = await Transaction_List?.findOne({
      where: { transactionId },
    });

    if (!transaction) throw ({
      status: middlewareErrorHandling.NOT_FOUND_STATUS,
      message: middlewareErrorHandling.TRANSACTION_NOT_FOUND
    });

    await transaction.update({ statusId : 6 })

    delete transaction?.dataValues?.canceledBy;
    delete transaction?.dataValues?.message;

    res
      .status(200)
      .json({
        type: "success",
        message: "Order received!",
        data: transaction
      });
  } catch (error) {

    next(error);
  }
};

const cancelTransaction = async (req, res, next) => {
  try {
    const { transactionId } = req.params;
    const { roleId, userId } = req.user;
    const { message } = req.body;

    let whereCondition = {}

    if (roleId === 1) {
      whereCondition = { transactionId };
    } else {
      whereCondition = { userId, transactionId };
    }

    const transaction = await Transaction_List?.findOne({
      where: whereCondition,
    });

    if (!transaction) throw ({
      status: middlewareErrorHandling.NOT_FOUND_STATUS,
      message: middlewareErrorHandling.TRANSACTION_NOT_FOUND
    });

    if (roleId === 2 && transaction.dataValues.statusId !== 1) {
      throw ({
        status: middlewareErrorHandling.BAD_REQUEST_STATUS,
        message: "Transaction cannot be canceled."
      })
    }

    if (transaction.dataValues.statusId === 1 ||
        transaction.dataValues.statusId === 2 ) {
      await transaction.update({
        statusId: 7,
        message,
        canceledBy: roleId === 1 ? "Admin" : "User",
      });

      res.status(200).json({
        type: "success",
        message: "Transaction canceled!",
        data: transaction,
      });
    } else {
      throw new Error("Transaction cannot be canceled.");
    }

  } catch (error) {

    next(error);
  }
};

const getTransactionStatus = async (req, res, next) => {
  try {
    const status = await Transaction_Status.findAll();
    res.status(200).json({
      type: "success",
      message: "Status fetched",
      data: status,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTransactions,
  getOngoingTransactions,
  createTransactions,
  getCheckoutProducts,
  uploadPaymentProof,
  confirmPayment,
  processOrder,
  sendOrder,
  receiveOrder,
  cancelTransaction,
  getTransactionStatus,
};
