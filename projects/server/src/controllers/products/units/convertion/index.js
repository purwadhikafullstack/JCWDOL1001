const {Op} = require("sequelize")
const {middlewareErrorHandling} = require("../../../../middleware/index.js");
const { Product_Detail } = require("../../../../model/relation.js")


const makeConvertionUnit = async( req, res, next ) => {
  try{
    
    const isProductDefaultAvailable = await Product_Detail.findOne({
      where : {
        productId : req.body.productId,
        isDefault : 1,
        quantity : {
          [Op.gt] : 0
        }
      }
    })
    
    if(!isProductDefaultAvailable) throw ({
      status : middlewareErrorHandling.NOT_FOUND_STATUS, 
      message : middlewareErrorHandling.DEFAULT_UNIT_UNAVAILABLE 
    })

    const secondaryUnit = await Product_Detail.findOne({
      where : {
        productId : req.body.productId,
        isDefault : 0,
        isDeleted : 0
      }
    })

    if(!secondaryUnit) throw({
      status : middlewareErrorHandling.NOT_FOUND_STATUS,
      message : middlewareErrorHandling.SECONDARY_PRODUCT_UNIT_NOT_FOUND,
    })

    await Product_Detail.update(
      { quantity : isProductDefaultAvailable.dataValues?.quantity - req.body.times },
      { where : { stockId : isProductDefaultAvailable?.dataValues?.stockId } }
    )

    const unitConvertion = await Product_Detail.update(
      { quantity : secondaryUnit?.dataValues?.quantity +(isProductDefaultAvailable.dataValues?.convertion * req.body.times ) },
      { where : { productId : req.body.productId, isDefault : 0 } }
    )

    const productUnitResult = await Product_Detail.findAll({
      where : {
        productId : req.body.productId,
        isDeleted : 0
      }
    })

    res.status(200).json({ 
      type : "success",
      message : "Unit Produk berhasil dikonversi",
      result : productUnitResult
    })

  } catch (error){
    next(error)
  }
}

module.exports = {
    makeConvertionUnit
}