const { User_Account } = require("../../model/relation.js")
const { middlewareErrorHandling } = require("../../middleware/index.js")
const cloudinary =require("cloudinary")


const uploadRecipe = async (req, res, next) => {
  try {
    const isUserExist = await User_Account.findOne({where : { UUID : req.user.UUID }})

    if(!isUserExist) throw({
        status : middlewareErrorHandling.NOT_FOUND_STATUS, 
        message : middlewareErrorHandling.USER_NOT_FOUND 
    })

    if (!req.file) throw({
        type: "error",
        status: middlewareErrorHandling.BAD_REQUEST_STATUS,
        message: middlewareErrorHandling.IMAGE_NOT_FOUND,
    })

    await User_Account.update(
        { imgRecipe : req?.file?.filename },
        { where : { UUID : req.user.UUID } }
    )
    
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