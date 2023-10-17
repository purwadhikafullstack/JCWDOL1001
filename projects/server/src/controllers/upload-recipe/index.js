const path = require("path")
const fs = require("fs")
const handlebars = require("handlebars")
const cloudinary =require("cloudinary")
const {GMAIL} = require("../../config/index.js")
const {helperTransporter} = require("../../helper/index.js")
const { User_Account, User_Profile } = require("../../model/relation.js")
const { middlewareErrorHandling } = require("../../middleware/index.js")
const uploadRecipeValidationSchema = require("./validation.js")
const moment = require("moment")

const uploadRecipe = async (req, res, next) => {
  try {
    const isUserExist = await User_Account.findOne({
      where : { UUID : req.user.UUID },
      attributes : ["email","imgRecipe"],
      include : {
        model : User_Profile,
        as : "userProfile",
        attributes : ["name","gender","birthdate","phone"]
      }
    })

    if(!isUserExist) throw({
        status : middlewareErrorHandling.NOT_FOUND_STATUS, 
        message : middlewareErrorHandling.USER_NOT_FOUND 
    })

    if (!req.file) throw({
        type: "error",
        status: middlewareErrorHandling.BAD_REQUEST_STATUS,
        message: middlewareErrorHandling.IMAGE_NOT_FOUND,
    })

    await uploadRecipeValidationSchema.validate(req.body);

    const address = JSON.parse(req.body.address)
    const courier = JSON.parse(req.body.courier)

    await User_Account.update(
        { 
          imgRecipe : req?.file?.filename ,
          addressIdRecipe : address.addressId,
          shippingRecipe : courier.name + "," + courier.type + "," + courier.cost ,
          createdRecipe : moment().format("YYYY-MM-DD hh:mm:ss")
        },
        { where : { UUID : req.user.UUID } }
    )

    const admin = await User_Account.findOne({where : {role : 1}})

    const template = fs.readFileSync(path.join(process.cwd(), "projects/server/templates", "getAnRecipe.html"), "utf8")
    const html = handlebars.compile(template)({ 
      name: (isUserExist.userProfile.name), 
      link :(process.env.CLOUDINARY_BASE_URL + req.file.filename) 
    })

    const mailOptions = {
      from: `Apotech Team Support <${GMAIL}>`,
      to: admin.email,
      subject: `${isUserExist.userProfile.name} just uploaded an recipe`,
      html: html
    }
    
    helperTransporter.transporter.sendMail(mailOptions, (error, info) => {
        if (error) throw error;
        console.log("Email sent: " + info.response);
    })
    
    res.status(200).json({ 
        type : "success",
        message: "Resep berhasil di upload, mohon menunggu konfirmasi", 
        data: req?.file?.filename 
    });
  } catch (error) {
    cloudinary.v2.api
        .delete_resources([`${req?.file?.filename}`],
            { type: 'upload', resource_type: 'image' })
    next(error);
  }
}

module.exports = {
    uploadRecipe,
}