const { Op } = require("sequelize");
const moment = require("moment")
const momentTimezone = require("moment-timezone")
const cron = require("node-cron");
const { middlewareErrorHandling } = require("../../middleware");
const cloudinary = require("cloudinary");
const fs = require("fs");
const handlebars = require("handlebars");
const path = require("path");
const { helperTransporter } = require("../../helper/index.js");
const {
  Transaction_List,
  Transaction_Detail,
  Transaction_Status,
} = require("../../model/relation.js");
const { Cart } = require("../../model/cart.js");
const { Product_Detail, Product_List, Product_Unit, Product_History } = require("../../model/product");
const { User_Address, User_Account, User_Profile } = require("../../model/user");
const { REDIRECT_URL, GMAIL } = require("../../config/index.js")

async function cancelExpiredTransactions() {
  try {
    // const twentyFourHoursAgo = moment().subtract(24, "hours").format("YYYY-MM-DD HH:mm:ss");
    const currentTime = moment().format("YYYY-MM-DD HH:mm:ss");
    console.log("current time", currentTime);

    const transactionsToCancel = await Transaction_List.findAll({
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
      where: {
        statusId: 1,
        expired: {
          [Op.gte]: currentTime,
        },
      },
    });

    for (const transaction of transactionsToCancel) {
      await transaction.update({ 
        statusId: 7,
        canceledBy : "Sistem",
        message : "Melewati batas waktu pembayaran"
      })

      const name = transaction.dataValues?.user_account.userProfile.name;
      const email = transaction.dataValues?.user_account.email;

      const template = fs.readFileSync(path.join(process.cwd(), "templates", "cancel-transaction.html"), "utf8");
      const html = handlebars.compile(template)({ 
        name : (name),
        information : "Mohon maaf, transaksi kamu tidak dapat dilanjutkan oleh Team Apotech karena telah melewati batas waktu pembayaran",
        link : (REDIRECT_URL + `/products`) 
      })

      const mailOptions = {
          from: `Apotech Team Support <${GMAIL}>`,
          to: email,
          subject: `Pesanan Dibatalkan ${transaction.dataValues?.createdAt}`,
          html: html
        }

      helperTransporter.transporter.sendMail(mailOptions, (error, info) => {
        if (error) throw error;
        console.log("Email sent: " + info.response);
      })
    }
    
  } catch (error) {
    console.error("Error while canceling expired transactions:", error);
  }
}

const getTransactions = async (req, res, next) => {

  try {
    const { userId } = req.user;
    const { statusId } = req.params;
    const { page, sortDate, startFrom, endFrom, sortTotal, filterName } = req.query;

    const limit = 2;
        
    const options = {
      offset: page > 1 ? (page - 1) * limit : 0,
      limit,
    }

    let whereCondition = {};
    const sort = []
    const filtering = {}

    if (userId === 1) {
      whereCondition = { statusId };
    } else {
      whereCondition = { userId, statusId };
    }

    if(startFrom) {
      whereCondition.updatedAt = {
        [Op.gte]: moment(startFrom).add(1,"d").subtract(4,"h").format("YYYY-MM-DD hh:mm:ss"),
        [Op.lte]: moment(endFrom).add(2,"d").subtract(5,"h").format("YYYY-MM-DD hh:mm:ss"),
      }
    }

    if(filterName) filtering.name = {"name" : {[Op.like]: `%${filterName}%`}}
    
    if(sortDate) sort.push(['updatedAt',sortDate ? sortDate : "DESC"])
    if(sortTotal) sort.push(['total',sortTotal])

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
          attributes : ["email"]
        },
        {
          model: User_Profile,
          as: "userProfile",
          where:filtering.name,
        }
      ],
      where: whereCondition,
      order : sort,
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
      total: +totalPrice + +transport,
      transport: transport,
      subtotal: totalPrice,
      statusId: 1,
      addressId : addressId,
      expired : moment().add(1,"d").format("YYYY-MM-DD hh:mm:ss"),
      invoice : moment().format("YYYY-MM-DD hh:mm:ss").toString()
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
        type : "Update Stock",
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

// update ongoing status 1 to 2
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
      where: { [Op.and]: [{ userId }, { statusId : 1 }, { transactionId }] },
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

    const template = fs.readFileSync(path.join(process.cwd(), "templates", "upload-payment-proof.html"), "utf8");
    const html = handlebars.compile(template)({ 
      name: (name), 
      link :(REDIRECT_URL + `/products`) 
    })

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

// update ongoing status 2 to 3
const confirmPayment = async (req, res, next) => {
  try {
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
      where: { [Op.and]: [ { statusId : 2 }, { transactionId }] },
    });

    if (!transaction) throw ({
      status: middlewareErrorHandling.NOT_FOUND_STATUS,
      message: middlewareErrorHandling.TRANSACTION_NOT_FOUND
    });

    await transaction.update({ statusId : 3 })

    delete transaction?.dataValues?.canceledBy;
    delete transaction?.dataValues?.message;

    const name = transaction.dataValues?.user_account.userProfile.name;
    const email = transaction.dataValues?.user_account.email;

    const template = fs.readFileSync(path.join(process.cwd(), "templates", "ongoing-2-5.html"), "utf8");
    const html = handlebars.compile(template)({
      name: (name), 
      title: ("Pembayaran Diterima"),
      ongoingStatus:("pembayaran kamu sudah diterima dan akan segera diproses"), 
      link :(REDIRECT_URL + `/products`) })

    const mailOptions = {
        from: `Apotech Team Support <${GMAIL}>`,
        to: email,
        subject: `Pembayaran Diterima ${transaction.dataValues?.createdAt}`,
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
        message: "Payment accepted!",
        data: transaction
      });
  } catch (error) {

    next(error);
  }
};

// update ongoing status 3 to 4
const processOrder = async (req, res, next) => {
  try {
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
      where: { [Op.and]: [{ statusId : 3 }, { transactionId }] },
    });

    if (!transaction) throw ({
      status: middlewareErrorHandling.NOT_FOUND_STATUS,
      message: middlewareErrorHandling.TRANSACTION_NOT_FOUND
    });

    await transaction.update({ statusId : 4 })

    delete transaction?.dataValues?.canceledBy;
    delete transaction?.dataValues?.message;

    const name = transaction.dataValues?.user_account.userProfile.name;
    const email = transaction.dataValues?.user_account.email;

    const template = fs.readFileSync(path.join(process.cwd(), "templates", "ongoing-2-5.html"), "utf8");
    const html = handlebars.compile(template)({
      name: (name), 
      title: ("Pesanan Diproses"),
      ongoingStatus:("pesanan kamu sedang diproses dan akan segera dikirimkan"), 
      link :(REDIRECT_URL + `/products`) })

    const mailOptions = {
        from: `Apotech Team Support <${GMAIL}>`,
        to: email,
        subject: `Pesanan Diproses ${transaction.dataValues?.createdAt}`,
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
        message: "Order processed!",
        data: transaction
      });
  } catch (error) {

    next(error);
  }
};

// update ongoing status 4 to 5
const sendOrder = async (req, res, next) => {
  try {
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
      where: { [Op.and]: [{ statusId : 4 }, { transactionId }] },
    });

    if (!transaction) throw ({
      status: middlewareErrorHandling.NOT_FOUND_STATUS,
      message: middlewareErrorHandling.TRANSACTION_NOT_FOUND
    });

    await transaction.update({ statusId : 5 })

    delete transaction?.dataValues?.canceledBy;
    delete transaction?.dataValues?.message;

    const name = transaction.dataValues?.user_account.userProfile.name;
    const email = transaction.dataValues?.user_account.email;

    const template = fs.readFileSync(path.join(process.cwd(), "templates", "ongoing-2-5.html"), "utf8");
    const html = handlebars.compile(template)({
      name: (name), 
      title: ("Pesanan Dikirim"),
      ongoingStatus:("pesanan kamu sedang dikirim"), 
      link :(REDIRECT_URL + `/products`) })

    const mailOptions = {
        from: `Apotech Team Support <${GMAIL}>`,
        to: email,
        subject: `Pesanan Dikirim ${transaction.dataValues?.createdAt}`,
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
        message: "Order sent!",
        data: transaction
      });
  } catch (error) {

    next(error);
  }
};

// update ongoing status 5 to 6
const receiveOrder = async (req, res, next) => {
  try {
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
      where: { [Op.and]: [{ statusId : 5 }, { transactionId }] },
    });

    if (!transaction) throw ({
      status: middlewareErrorHandling.NOT_FOUND_STATUS,
      message: middlewareErrorHandling.TRANSACTION_NOT_FOUND
    });

    await transaction.update({ statusId : 6 })

    delete transaction?.dataValues?.canceledBy;
    delete transaction?.dataValues?.message;

    const name = transaction.dataValues?.user_account.userProfile.name;
    const email = transaction.dataValues?.user_account.email;

    const template = fs.readFileSync(path.join(process.cwd(), "templates", "receive-order.html"), "utf8");
    const html = handlebars.compile(template)({ 
      name : (name), 
      link : (REDIRECT_URL + `/products`) 
    })

    const mailOptions = {
        from: `Apotech Team Support <${GMAIL}>`,
        to: email,
        subject: `Pesanan Diterima ${transaction.dataValues?.createdAt}`,
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
        message: "Order received!",
        data: transaction
      });
  } catch (error) {

    next(error);
  }
};

// update ongoing status to 7
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
      include:[
        {
          model: User_Account,
          attributes : ["email"],
          include: {
            model: User_Profile,
            as: "userProfile"
          }
        },
        {
          model: Transaction_Detail,
          as: "transactionDetail",
          // include: {
          //   model: Product_List,
          //   as: "listedTransaction",
          // },
        },
      ],
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

      let reason = "";
      let information = "";
      // email jika dibatalkan oleh user
      if (roleId === 2) {
        information = "Pesananmu berhasil dibatalkan!"
      }
      // email jika dibatalkan oleh admin
      if (roleId === 1) {
        reason = transaction.dataValues?.message;
        information = `Mohon maaf, transaksi kamu tidak dapat dilanjutkan oleh Team Apotech karena ${reason}`;
      }

      const name = transaction.dataValues?.user_account.userProfile.name;
      const email = transaction.dataValues?.user_account.email;

      const template = fs.readFileSync(path.join(process.cwd(), "templates", "cancel-transaction.html"), "utf8");
      const html = handlebars.compile(template)({ 
        name : (name),
        information : (information),
        link : (REDIRECT_URL + `/products`) 
      })

      const mailOptions = {
          from: `Apotech Team Support <${GMAIL}>`,
          to: email,
          subject: `Pesanan Dibatalkan ${transaction.dataValues?.createdAt}`,
          html: html
        }

      helperTransporter.transporter.sendMail(mailOptions, (error, info) => {
        if (error) throw error;
        console.log("Email sent: " + info.response);
      })

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

// update ongoing status 2 to 1
const rejectPayment = async (req, res, next) => {
  try {
    const { transactionId } = req.params;
    const { message } = req.body;

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
      where: { [Op.and]: [{ statusId : 2 }, { transactionId }] },
    });

    if (!transaction) throw ({
      status: middlewareErrorHandling.NOT_FOUND_STATUS,
      message: middlewareErrorHandling.TRANSACTION_NOT_FOUND
    });

      await transaction.update({
        statusId: 1,
        message,
        canceledBy: "Admin"
      });

      const reason = transaction.dataValues?.message;
      const information = `Mohon maaf, pembayaran kamu ditolak oleh Team Apotech karena ${reason}`;

      const name = transaction.dataValues?.user_account.userProfile.name;
      const email = transaction.dataValues?.user_account.email;

      const template = fs.readFileSync(path.join(process.cwd(), "templates", "reject-payment.html"), "utf8");
      const html = handlebars.compile(template)({ 
        name : (name),
        // bankName : (bankName),
        // bankAccount : (bankAccount),
        // accountHolder : (accountHolder),
        information : (information),
        link : (REDIRECT_URL + `/user/transaction`) 
      })

      const mailOptions = {
          from: `Apotech Team Support <${GMAIL}>`,
          to: email,
          subject: `Pembayaran Ditolak ${transaction.dataValues?.createdAt}`,
          html: html
        }

      helperTransporter.transporter.sendMail(mailOptions, (error, info) => {
        if (error) throw error;
        console.log("Email sent: " + info.response);
      })

      res.status(200).json({
        type: "success",
        message: "Payment rejected!",
        data: transaction,
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
}
