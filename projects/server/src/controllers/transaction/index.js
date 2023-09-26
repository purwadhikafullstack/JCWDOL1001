const { Op, QueryTypes } = require("sequelize");
const moment = require("moment")
const cloudinary = require("cloudinary");
const db = require("../../model/index")
const { middlewareErrorHandling } = require("../../middleware");
const {
  Transaction_List,
  Transaction_Detail,
  Transaction_Status,
} = require("../../model/transaction");
const { Cart } = require("../../model/cart.js");
const { Product_Detail, Product_List } = require("../../model/product");
const { User_Address, User_Profile } = require("../../model/user");

const getTransactions = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { statusId } = req.params;

    const {startFrom, endFrom, sortDate, sortTotal, } = req.query

    let whereCondition = {};
    const sort = []

    if (userId === 1) {
      whereCondition = { userId: { [Op.not]: 1 }, statusId };
    } else {
      whereCondition = { userId, statusId };
    }

    if(req.query.startFrom) {
      whereCondition.createdAt = {
        [Op.gte]: moment(startFrom).format("YYYY-MM-DD HH:mm:ss"),
        [Op.lte]: moment(endFrom).add(1,"days").format("YYYY-MM-DD HH:mm:ss"),
      }
    }

    if(sortDate) sort.push(['updatedAt',sortDate])
    if(sortTotal) sort.push(['total',sortTotal])

    const transaction = await Transaction_List?.findAll({
      include: [
        // {
        //   model: Transaction_Status,
        //   as: "transactionStatus",
        // },
        {
          model: Transaction_Detail,
          as: "transactionDetail",
          include: {
            model: Product_List,
            as: "listedTransaction",
          },
        },
        // {
        //   model: User_Address,
        // }
      ],
      where: whereCondition,
      order : sort
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

const transactionReport = async (req, res, next) => {
    try {
        const {startFrom, endFrom} = req.query
        const {statusId} = req.params

        const transaction =  await db.sequelize.query(
            `SELECT 
              SUM(total) as total, 
              DATE_Format(createdAt,'%Y-%m-%d') as tanggal
            FROM apotek.transaction_lists
            ${statusId ? `WHERE statusId LIKE '${statusId}'` : ""}
            GROUP BY tanggal
            ${startFrom ? `HAVING tanggal BETWEEN '${startFrom}' AND '${endFrom}'` : ""}
            ORDER BY tanggal ASC;`, 
            { type: QueryTypes.SELECT }
        )

        res.status(200).json({
            type: "success", 
            message: "Data berhasil dimuat", 
            report: transaction
        })

    } catch (error) {
        next(error)
    }
}

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

    await transaction.update({ paymentProof: req?.file?.filename });

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
  transactionReport,
  createTransactions,
  getCheckoutProducts,
  uploadPaymentProof,
  getTransactionStatus,
};
