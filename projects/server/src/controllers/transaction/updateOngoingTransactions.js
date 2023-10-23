const { Op } = require("sequelize");
const { middlewareErrorHandling } = require("../../middleware");
const fs = require("fs");
const handlebars = require("handlebars");
const path = require("path");
const { helperTransporter } = require("../../helper/index.js");
const { Transaction_List } = require("../../model/relation.js");
const { User_Account, User_Profile } = require("../../model/user");
const { REDIRECT_URL, GMAIL } = require("../../config/index.js");

// update ongoing status 2 to 3
const confirmPayment = async (req, res, next) => {
  try {
    const { transactionId } = req.params;

    const transaction = await Transaction_List?.findOne({
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
      where: { [Op.and]: [{ statusId: 2 }, { transactionId }] },
    });

    if (!transaction)
      throw {
        status: middlewareErrorHandling.NOT_FOUND_STATUS,
        message: middlewareErrorHandling.TRANSACTION_NOT_FOUND,
      };

    await transaction.update({ statusId: 3 });

    delete transaction?.dataValues?.canceledBy;
    delete transaction?.dataValues?.message;

    const name = transaction.dataValues?.user_account.userProfile.name;
    const email = transaction.dataValues?.user_account.email;

    const template = fs.readFileSync(
      path.join(process.cwd(), "projects/server/templates", "ongoing-2-5.html"),
      "utf8"
    );
    const html = handlebars.compile(template)({
      name: name,
      title: "Pembayaran Diterima",
      ongoingStatus: "pembayaran kamu sudah diterima dan akan segera diproses",
      link: REDIRECT_URL + `/products`,
    });

    const mailOptions = {
      from: `Apotech Team Support <${GMAIL}>`,
      to: email,
      subject: `Pembayaran Diterima ${transaction.dataValues?.invoice}`,
      html: html,
    };

    helperTransporter.transporter.sendMail(mailOptions, (error, info) => {
      if (error) throw error;
      console.log("Email sent: " + info.response);
    });

    res.status(200).json({
      type: "success",
      message: "Payment accepted!",
      data: transaction,
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
      where: { [Op.and]: [{ statusId: 3 }, { transactionId }] },
    });

    if (!transaction)
      throw {
        status: middlewareErrorHandling.NOT_FOUND_STATUS,
        message: middlewareErrorHandling.TRANSACTION_NOT_FOUND,
      };

    await transaction.update({ statusId: 4 });

    delete transaction?.dataValues?.canceledBy;
    delete transaction?.dataValues?.message;

    const name = transaction.dataValues?.user_account.userProfile.name;
    const email = transaction.dataValues?.user_account.email;

    const template = fs.readFileSync(
      path.join(process.cwd(), "projects/server/templates", "ongoing-2-5.html"),
      "utf8"
    );
    const html = handlebars.compile(template)({
      name: name,
      title: "Pesanan Diproses",
      ongoingStatus: "pesanan kamu sedang diproses dan akan segera dikirimkan",
      link: REDIRECT_URL + `/products`,
    });

    const mailOptions = {
      from: `Apotech Team Support <${GMAIL}>`,
      to: email,
      subject: `Pesanan Diproses ${transaction.dataValues?.invoice}`,
      html: html,
    };

    helperTransporter.transporter.sendMail(mailOptions, (error, info) => {
      if (error) throw error;
      console.log("Email sent: " + info.response);
    });

    res.status(200).json({
      type: "success",
      message: "Order processed!",
      data: transaction,
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
      where: { [Op.and]: [{ statusId: 4 }, { transactionId }] },
    });

    if (!transaction)
      throw {
        status: middlewareErrorHandling.NOT_FOUND_STATUS,
        message: middlewareErrorHandling.TRANSACTION_NOT_FOUND,
      };

    await transaction.update({ statusId: 5 });

    delete transaction?.dataValues?.canceledBy;
    delete transaction?.dataValues?.message;

    const name = transaction.dataValues?.user_account.userProfile.name;
    const email = transaction.dataValues?.user_account.email;

    const template = fs.readFileSync(
      path.join(process.cwd(), "projects/server/templates", "ongoing-2-5.html"),
      "utf8"
    );
    const html = handlebars.compile(template)({
      name: name,
      title: "Pesanan Dikirim",
      ongoingStatus: "pesanan kamu sedang dikirim",
      link: REDIRECT_URL + `/products`,
    });

    const mailOptions = {
      from: `Apotech Team Support <${GMAIL}>`,
      to: email,
      subject: `Pesanan Dikirim ${transaction.dataValues?.invoice}`,
      html: html,
    };

    helperTransporter.transporter.sendMail(mailOptions, (error, info) => {
      if (error) throw error;
      console.log("Email sent: " + info.response);
    });

    res.status(200).json({
      type: "success",
      message: "Order sent!",
      data: transaction,
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
      where: { [Op.and]: [{ statusId: 5 }, { transactionId }] },
    });

    if (!transaction)
      throw {
        status: middlewareErrorHandling.NOT_FOUND_STATUS,
        message: middlewareErrorHandling.TRANSACTION_NOT_FOUND,
      };

    await transaction.update({ statusId: 6 });

    delete transaction?.dataValues?.canceledBy;
    delete transaction?.dataValues?.message;

    const name = transaction.dataValues?.user_account.userProfile.name;
    const email = transaction.dataValues?.user_account.email;

    const template = fs.readFileSync(
      path.join(
        process.cwd(),
        "projects/server/templates",
        "receive-order.html"
      ),
      "utf8"
    );
    const html = handlebars.compile(template)({
      name: name,
      link: REDIRECT_URL + `/products`,
    });

    const mailOptions = {
      from: `Apotech Team Support <${GMAIL}>`,
      to: email,
      subject: `Pesanan Diterima ${transaction.dataValues?.invoice}`,
      html: html,
    };

    helperTransporter.transporter.sendMail(mailOptions, (error, info) => {
      if (error) throw error;
      console.log("Email sent: " + info.response);
    });

    res.status(200).json({
      type: "success",
      message: "Order received!",
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  confirmPayment,
  processOrder,
  sendOrder,
  receiveOrder
}