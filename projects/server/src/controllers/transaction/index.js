const cloudinary = require("cloudinary");
const fs = require("fs");
const handlebars = require("handlebars");
const path = require("path");
const {helperToken, helperEncryption, helperOTP, helperTransporter} = require("../../helper/index.js");
const {
  Transaction_List,
  Transaction_Detail,
  Transaction_Status,
} = require("../../model/transaction");
const { Cart } = require("../../model/cart.js");
const { Op } = require("sequelize");
const { Product_Detail, Product_List } = require("../../model/product");
const { middlewareErrorHandling } = require("../../middleware");
const { User_Address, User_Account, User_Profile } = require("../../model/user");
const { REDIRECT_URL, GMAIL } = require("../../config/index.js")

const getTransactions = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { statusId } = req.params;
    const { page } = req.query;

    const limit = 2;
        
    const options = {
      offset: page > 1 ? (page - 1) * limit : 0,
      limit,
    }

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
      order:[["updatedAt" , "DESC"]],
      ...options
    });

    if (!transaction) throw ({
      status: middlewareErrorHandling.NOT_FOUND_STATUS,
      message: middlewareErrorHandling.TRANSACTION_NOT_FOUND
    });

    if (statusId !== 7) {
      delete transaction?.dataValues?.canceledBy;
      delete transaction?.dataValues?.message;
    }

    const totalTransactions = await Transaction_List.count({where: whereCondition})
    const totalPage = Math.ceil(totalTransactions / limit)

    res.status(200).json({
      type: "success",
      message: "Here are your order lists",
      totalPage,
      currentPage: +page,
      nextPage: +page === totalPage ? null : +page + 1,
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
    }

    const finishTransaction = await Cart?.destroy({
      where: { [Op.and]: [{ userId: userId }, { inCheckOut: 1 }] },
    });

    res.status(200).json({
      type: "success",
      message: "Transaction created!",
      data: finishTransaction,
    });
  } catch (error) {
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
      include:[
        {
          model: User_Account,
          attributes : ["email"],
          include: {
            model: User_Profile,
            as: "userProfile"
          }
        },
      ],
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

    const name = transaction.dataValues?.user_account.userProfile.name;
    const email = transaction.dataValues?.user_account.email;

    //@ send otp to email for verification
    const template = fs.readFileSync(path.join(process.cwd(), "templates", "upload-payment-proof.html"), "utf8");
    const html = handlebars.compile(template)({ name: (name), link :(REDIRECT_URL + `/products`) })

    const mailOptions = {
        from: `Apotech Team Support <${GMAIL}>`,
        to: email,
        subject: `Menunggu Konfirmasi ${transaction.dataValues?.createdAt}`,
        html: html
      }

      helperTransporter.transporter.sendMail(mailOptions, (error, info) => {
        if (error) throw error;
        console.log("Email sent: " + info.response);
      })

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
