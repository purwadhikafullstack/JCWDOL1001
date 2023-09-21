const {
  Transaction_List,
  Transaction_Detail,
  Transaction_Status,
} = require("../../model/transaction");
const { Cart } = require("../../model/cart.js");
const { Op } = require("sequelize");
const { Product_Detail, Product_List } = require("../../model/product");
const { middlewareErrorHandling } = require("../../middleware");
const cloudinary = require("cloudinary");
const { User_Address } = require("../../model/user");

const getTransactions = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { statusId } = req.params;

    let whereCondition = {};

    if (userId === 1) {
      whereCondition = { userId: { [Op.not]: 1 }, statusId };
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
        }
      ],
      where: whereCondition,
    });


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

const createTransactions = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { transport, totalPrice } = req.body;

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
    const { userId } = req.params;
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

    if (!transaction) throw new Error(middlewareErrorHandling.TRANSACTION_NOT_FOUND);

    if (!req.file) {
      return next({
        type: "error",
        status: middlewareErrorHandling.BAD_REQUEST_STATUS,
        message: middlewareErrorHandling.IMAGE_NOT_FOUND,
      });
    }

    await transaction.update({ paymentProof: req?.file?.filename, statusId : 2 });

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

    const transaction = await Transaction_Detail?.findAll({
      where: { transactionId },
    });

    if (!transaction) throw new Error(middlewareErrorHandling.TRANSACTION_NOT_FOUND);

    // if (!req.file) {
    //   return next({
    //     type: "error",
    //     status: middlewareErrorHandling.BAD_REQUEST_STATUS,
    //     message: middlewareErrorHandling.IMAGE_NOT_FOUND,
    //   });
    // }

    res
      .status(200)
      .json({
        type: "success",
        message: "Transaction accepted!",
        data: transaction
      });
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
  createTransactions,
  getCheckoutProducts,
  uploadPaymentProof,
  confirmPayment,
  getTransactionStatus,
};
