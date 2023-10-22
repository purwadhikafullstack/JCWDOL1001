const { Op } = require("sequelize");
const moment = require("moment");
const { middlewareErrorHandling } = require("../../middleware");
const fs = require("fs");
const handlebars = require("handlebars");
const path = require("path");
const { helperTransporter } = require("../../helper/index.js");
const {
  Transaction_List,
  Transaction_Detail,
  Transaction_Status,
  Discount_Transaction,
  Discount,
  Discount_Product,
} = require("../../model/relation.js");
const { Cart } = require("../../model/cart.js");
const {
  Product_Detail,
  Product_List,
  Product_History,
  Product_Unit,
} = require("../../model/product");
const {
  User_Account,
  User_Profile,
} = require("../../model/user");
const { REDIRECT_URL, GMAIL } = require("../../config/index.js");

const { getTransactions, getOngoingTransactions } = require("./getTransactions.js");
const { uploadPaymentProof } = require("./uploadPaymentProof.js");
const { rejectPayment } = require("./rejectPayment.js");
const { cancelTransaction, cancelTransactionService } = require("./cancelTransactions.js");
const { confirmPayment, processOrder, sendOrder, receiveOrder } = require("./updateOngoingTransactions.js");

async function cancelExpiredTransactions() {
  try {
    const currentTime = moment().format("YYYY-MM-DD HH:mm:ss");

    const discountExpiredList = await Discount.findAll({
      where: { discountExpired: { [Op.lte]: currentTime } },
    });

    const expiredDiscountId = discountExpiredList.map((list) => {
      return list.discountId;
    });

    await Discount.update(
      { isDeleted: 1 },
      { where: { discountId: { [Op.in]: expiredDiscountId } } }
    );

    await Discount_Product.update(
      { isDeleted: 1 },
      { where: { discountId: { [Op.in]: expiredDiscountId } } }
    );

    const transactionsToCancel = await Transaction_List.findAll({
      include: [
        {
          model: User_Account,
          attributes: ["email"],
          include: {
            model: User_Profile,
            as: "userProfile",
          },
        },
      ],
      where: {
        statusId: 1,
        expired: {
          [Op.lte]: currentTime,
        },
      },
    });

    
    const transactionIds = transactionsToCancel.map(
      (transaction) => transaction.dataValues?.transactionId
    );
    
    const reverseList = await Transaction_Detail.findAll({
      where: {
        transactionId: { [Op.in]: transactionIds },
      },
    });

    await cancelTransactionService(reverseList);

    for (const transaction of transactionsToCancel) {
      await transaction.update({
        statusId: 7,
        canceledBy: "Sistem",
        message: "Melewati batas waktu pembayaran",
      });

      const name = transaction.dataValues?.user_account.userProfile.name;
      const email = transaction.dataValues?.user_account.email;

      const template = fs.readFileSync(
        path.join(
          process.cwd(),
          "projects/server/templates",
          "cancel-transaction.html"
        ),
        "utf8"
      );
      const html = handlebars.compile(template)({
        name: name,
        information:
          "Mohon maaf, transaksi kamu tidak dapat dilanjutkan oleh Team Apotech karena telah melewati batas waktu pembayaran",
        link: REDIRECT_URL + `/products`,
      });

      const mailOptions = {
        from: `Apotech Team Support <${GMAIL}>`,
        to: email,
        subject: `Pesanan Dibatalkan ${transaction.dataValues?.invoice}`,
        html: html,
      };

      helperTransporter.transporter.sendMail(mailOptions, (error, info) => {
        if (error) throw error;
        console.log("Email sent: " + info.response);
      });
    }
    // console.log(transactionsToCancel);

  } catch (error) {
    console.error("Error while canceling expired transactions:", error);
  }
}

const createTransactions = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { transport, totalPrice, addressId, discountId, discount } = req.body;

    const startTransaction = await Cart?.findAll({
      include: [
        {
          model: Product_Detail,
          as: "product_detail",
          include: {
            model: Discount_Product,
            as: "productDiscount",
            where: { isDeleted: 0 },
            required: false,
          },
        },
        {
          model: Product_List,
          as: "cartList",
          include: {
            model: Discount_Product,
            attributes: { exclude: ["discountProductId"] },
            as: "discountProducts",
            where: { isDeleted: 0 },
            include: {
              model: Discount,
              where: {
                isDeleted: 0,
                [Op.or]: [
                  { discountExpired: { [Op.gte]: moment() } },
                  { discountExpired: { [Op.is]: null } },
                ],
              },
              required: false,
            },
            required: false,
          },
        },
      ],
      where: { [Op.and]: [{ userId }, { inCheckOut: 1 }] },
    });

    const expiredTime = moment().add(24, "hours").format("YYYY-MM-DD HH:mm:ss");
    let date = new Date().getTime();

    let isDiscount = discount ? discount : 0;

    const newTransactionList = {
      userId: userId,
      total: +totalPrice + +transport + -isDiscount,
      transport: transport,
      subtotal: totalPrice,
      discount: isDiscount,
      statusId: 1,
      addressId: addressId,
      expired: expiredTime,
      invoice: `${userId + new Date().getTime()}`,
    };

    const newTransaction = await Transaction_List?.create(newTransactionList);
    if (discountId.length > 0) {
      const discountIdList = [];
      for (let i = 0; i < discountId.length; i++) {
        discountIdList.push({
          transactionId: newTransaction.transactionId,
          discountId: discountId[i],
        });
      }
      await Discount_Transaction.bulkCreate(discountIdList);
    }

    for (let i = 0; i < startTransaction.length; i++) {
      // console.log(startTransaction);
      let price = 0;
      let totalPrice = 0;
      if (startTransaction[i].product_detail.productDiscount[0]?.endingPrice) {
        price =
          startTransaction[i].product_detail.productDiscount[0]?.endingPrice;
        totalPrice =
          startTransaction[i].product_detail.productDiscount[0]?.endingPrice *
          startTransaction[i].quantity;
      } else {
        price = startTransaction[i].cartList.productPrice;
        totalPrice =
          startTransaction[i].cartList.productPrice *
          startTransaction[i].quantity;
      }
      const newTransactionDetail = {
        transactionId: newTransaction.transactionId,
        price: price,
        quantity: startTransaction[i].quantity,
        totalPrice: totalPrice,
        productId: startTransaction[i].productId,
        buyOneGetOne:
          startTransaction[i].cartList?.discountProducts?.length > 0 &&
          startTransaction[i]?.cartList?.discountProducts[0]?.discount
            ?.oneGetOne
            ? 1
            : 0,
      };
      await Transaction_Detail?.create(newTransactionDetail);

      const UpdateStock = await Product_Detail?.findOne({
        include: { model: Product_Unit, as: "product_unit" },
        where: {
          [Op.and]: [
            { productId: startTransaction[i].productId },
            { isDefault: 1 },
          ],
        },
      });
      let newQuantity =
        startTransaction[i].cartList?.discountProducts?.length > 0 &&
        startTransaction[i]?.cartList?.discountProducts[0]?.discount?.oneGetOne
          ? UpdateStock.quantity - startTransaction[i].quantity * 2
          : UpdateStock.quantity - startTransaction[i].quantity;
      if (newQuantity < 0)
        throw {
          status: middlewareErrorHandling.BAD_REQUEST_STATUS,
          message: middlewareErrorHandling.ITEM_NOT_ENOUGH,
        };
      await Product_Detail?.update(
        { quantity: newQuantity },
        {
          where: {
            [Op.and]: [
              { productId: startTransaction[i].productId },
              { isDefault: 1 },
            ],
          },
        }
      );

      const ProductHistory = {
        productId: startTransaction[i].productId,
        unit: UpdateStock.product_unit.name,
        initialStock: UpdateStock.quantity,
        type: "Pengurangan",
        status: startTransaction[i].cartList?.discountProducts[0]?.discount
          ?.oneGetOne
          ? "Penjualan Buy One Get One"
          : "Penjualan",
        quantity: startTransaction[i].cartList?.discountProducts[0]?.discount
          ?.oneGetOne
          ? startTransaction[i].quantity * 2
          : startTransaction[i].quantity,
        results: newQuantity,
      };
      await Product_History?.create(ProductHistory);
    }

    const finishTransaction = await Cart?.destroy({
      where: { [Op.and]: [{ userId: userId }, { inCheckOut: 1 }] },
    });

    const customer = await User_Account?.findOne({
      where: { userId: userId },
    });

    const template = fs.readFileSync(
      path.join(
        process.cwd(),
        "projects/server/templates",
        "transactionSuccessful.html"
      ),
      "utf8"
    );
    const html = handlebars.compile(template)({
      order: newTransaction.transactionId,
      invoice: newTransactionList.invoice,
    });

    const mailOptions = {
      from: `Apotech Team Support <${GMAIL}>`,
      to: customer?.dataValues?.email,
      subject: `Transaksi Berhasil untuk Invoice No. ${newTransactionList.invoice}`,
      html: html,
    };

    helperTransporter.transporter.sendMail(mailOptions, (error, info) => {
      if (error) throw error;
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
          include: {
            model: Discount_Product,
            as: "productDiscount",
            where: { isDeleted: 0 },
          },
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
  rejectPayment,
  cancelExpiredTransactions,
  getTransactionStatus,
};
