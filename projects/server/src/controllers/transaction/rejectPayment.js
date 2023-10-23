const { Op } = require("sequelize");
const { middlewareErrorHandling } = require("../../middleware");
const fs = require("fs");
const handlebars = require("handlebars");
const path = require("path");
const { helperTransporter } = require("../../helper/index.js");
const { Transaction_List } = require("../../model/relation.js");
const {
  User_Account,
  User_Profile,
} = require("../../model/user");
const { REDIRECT_URL, GMAIL } = require("../../config/index.js");

// update ongoing status 2 to 1
const rejectPayment = async (req, res, next) => {
  try {
    const { transactionId } = req.params;
    const { message } = req.body;

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

    await transaction.update({
      statusId: 1,
      message,
      canceledBy: "Admin",
    });

    const reason = transaction.dataValues?.message;
    const information = `Mohon maaf, pembayaran kamu ditolak oleh Team Apotech karena ${reason}`;

    const name = transaction.dataValues?.user_account.userProfile.name;
    const email = transaction.dataValues?.user_account.email;

    const template = fs.readFileSync(
      path.join(
        process.cwd(),
        "projects/server/templates",
        "reject-payment.html"
      ),
      "utf8"
    );
    const html = handlebars.compile(template)({
      name: name,
      information: information,
      link: REDIRECT_URL + `/user/transaction`,
    });

    const mailOptions = {
      from: `Apotech Team Support <${GMAIL}>`,
      to: email,
      subject: `Pembayaran Ditolak ${transaction.dataValues?.invoice}`,
      html: html,
    };

    helperTransporter.transporter.sendMail(mailOptions, (error, info) => {
      if (error) throw error;
      console.log("Email sent: " + info.response);
    });

    res.status(200).json({
      type: "success",
      message: "Payment rejected!",
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  rejectPayment
}