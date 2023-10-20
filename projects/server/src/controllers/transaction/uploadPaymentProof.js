const { Op } = require("sequelize");
const { middlewareErrorHandling } = require("../../middleware");
const cloudinary = require("cloudinary");
const fs = require("fs");
const handlebars = require("handlebars");
const path = require("path");
const { helperTransporter } = require("../../helper/index.js");
const {
  Transaction_List,
} = require("../../model/relation.js");
const {
  User_Account,
  User_Profile,
} = require("../../model/user");
const { REDIRECT_URL, GMAIL } = require("../../config/index.js");

// update ongoing status 1 to 2
const uploadPaymentProof = async (req, res, next) => {
  try {
    const { userId } = req.user;
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
      where: { [Op.and]: [{ userId }, { statusId: 1 }, { transactionId }] },
    });

    if (!transaction)
      throw {
        status: middlewareErrorHandling.NOT_FOUND_STATUS,
        message: middlewareErrorHandling.TRANSACTION_NOT_FOUND,
      };

    if (!req.file) {
      return next({
        type: "error",
        status: middlewareErrorHandling.BAD_REQUEST_STATUS,
        message: middlewareErrorHandling.IMAGE_NOT_FOUND,
      });
    }

    await transaction.update({
      paymentProof: req?.file?.filename,
      statusId: 2,
    });
    await transaction.update({ statusId: 2 });

    delete transaction?.dataValues?.canceledBy;
    delete transaction?.dataValues?.message;

    const name = transaction.dataValues?.user_account.userProfile.name;
    const email = transaction.dataValues?.user_account.email;

    const template = fs.readFileSync(
      path.join(
        process.cwd(),
        "projects/server/templates",
        "upload-payment-proof.html"
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
      subject: `Menunggu Konfirmasi ${transaction.dataValues?.invoice}`,
      html: html,
    };

    helperTransporter.transporter.sendMail(mailOptions, (error, info) => {
      if (error) throw error;
      console.log("Email sent: " + info.response);
    });

    res.status(200).json({
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

module.exports = {
  uploadPaymentProof
}