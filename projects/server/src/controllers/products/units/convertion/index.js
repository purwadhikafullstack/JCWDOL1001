const {Op} = require("sequelize")
const {middlewareErrorHandling} = require("../../../../middleware/index.js");
const { Product_Detail, Product_Unit, Product_History } = require("../../../../model/relation.js")


const makeConvertionUnit = async( req, res, next ) => {
  try{
    
    const isProductDefaultAvailable = await Product_Detail.findOne({
      where : {
        productId : req.body.productId,
        isDefault : 1,
        quantity : {
          [Op.gt] : 0
        }
      },
      include :{
        model : Product_Unit
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
      },
      include :{
        model : Product_Unit
      }
    })

    if(!secondaryUnit) throw({
      status : middlewareErrorHandling.NOT_FOUND_STATUS,
      message : middlewareErrorHandling.SECONDARY_PRODUCT_UNIT_NOT_FOUND,
    })

    const stockAvailable = req.body.times  <= isProductDefaultAvailable.dataValues?.quantity

    if(!stockAvailable) throw({
      status : middlewareErrorHandling.BAD_REQUEST_STATUS,
      message : middlewareErrorHandling.INPUT_MORE_THAN_STOCK,
    })

    await Product_Detail.update(
      { quantity : isProductDefaultAvailable.dataValues?.quantity - req.body.times },
      { where : { stockId : isProductDefaultAvailable?.dataValues?.stockId } }
    )

    await Product_Detail.update(
      { quantity : secondaryUnit?.dataValues?.quantity +(isProductDefaultAvailable.dataValues?.convertion * req.body.times ) },
      { where : { productId : req.body.productId, isDefault : 0 } }
    )

    const productUnitResult = await Product_Detail.findOne({
      where : {
        productId : req.body.productId,
        isDeleted : 0,
        isDefault : 0
      },
      include :{
        model : Product_Unit
      }
    })

    await Product_History.create({
      productId : req.body.productId,
      unit : isProductDefaultAvailable?.dataValues?.product_unit.name,
      initialStock : isProductDefaultAvailable?.dataValues?.quantity,
      status : "Pengurangan",
      type : "Convert Product Unit",
      quantity : req.body.times,
      results : isProductDefaultAvailable.dataValues?.quantity - req.body.times
    })

    await Product_History.create({
      productId : req.body.productId,
      unit : secondaryUnit?.dataValues?.product_unit.name,
      initialStock : secondaryUnit?.dataValues?.quantity,
      status : "Penambahan",
      type : "Convert Product Unit",
      quantity : isProductDefaultAvailable.dataValues?.convertion * req.body.times,
      results : productUnitResult.dataValues?.quantity
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