const {middlewareErrorHandling} = require("../../../middleware/index.js");
const { Product_Unit, Product_Detail } = require("../../../model/relation.js")
const {productUnitValidationSchema, deleteProductUnitValidationSchema } = require("./validation.js")

const productUnits = async( req, res, next ) => {
  try{
    const unitProduct = await Product_Unit.findAll()

    res.status(200).json({ 
      type : "success",
      message : "Data berhasil dimuat",
      unit : unitProduct
    })

  } catch (error){
    next(error)
  }
}

const setProductUnits = async( req, res, next ) => {
  try{
    const productId = req.params.productId

    await productUnitValidationSchema.validate(req.body)

    const isExceedMaxUnit = await Product_Detail.count({where : { productId }})

    if(isExceedMaxUnit === 2 ) throw ({
      status : middlewareErrorHandling.BAD_REQUEST_STATUS, 
      message : middlewareErrorHandling.PRODUCT_UNIT_EXCEED_LIMIT 
    })

    const isDefaultUnitExist = await Product_Detail.findOne({where : {productId, isDefault:1}})

    if(Number(isDefaultUnitExist?.dataValues?.isDefault) === Number(req.body.isDefault)) throw ({
        status : middlewareErrorHandling.BAD_REQUEST_STATUS, 
        message : middlewareErrorHandling.PRODUCT_ALREADY_HAS_DEFAULT_UNIT 
    })

    const isProductUnitAlreadyExist = await Product_Detail.findOne({
      where : {
        productId, 
        unitId : req.body.unitId
      }
    })

    if(isProductUnitAlreadyExist?.dataValues?.unitId === Number(req.body.unitId)) throw ({
        status : middlewareErrorHandling.BAD_REQUEST_STATUS, 
        message : middlewareErrorHandling.PRODUCT_UNIT_ALREADY_EXISTS 
    })

    const unitProductList = await Product_Unit.findOne({where :{unitId : req.body.unitId}})

    if(!unitProductList){
      const isUnitNameExist = await Product_Unit.findOne({where : { name : req.body.unitName }})
      
      if(isUnitNameExist) throw ({
          status : middlewareErrorHandling.BAD_REQUEST_STATUS, 
          message : middlewareErrorHandling.PRODUCT_UNIT_ALREADY_EXISTS 
      })

      const newUnit = await Product_Unit.create({name : req.body.unitName})
      
      req.body.unitId = newUnit?.dataValues?.unitId
    }

    req.body.productId = productId

    req.body.isDeleted = 0

    const unitProduct = await Product_Detail.create(req.body)

    res.status(200).json({ 
      type : "success",
      message : "Unit Produk berhasil diatur",
      unit : unitProduct
    })

  } catch (error){
    next(error)
  }
}

const updateProductUnits = async( req, res, next ) => {
  try{
    const productId = req.params.productId

    await productUnitValidationSchema.validate(req.body)

    const isDefaultUnitExist = await Product_Detail.findOne({
      where : {
        productId, 
        isDefault:1
      }
    })

    if(Number(isDefaultUnitExist?.dataValues?.isDefault) === Number(req.body.isDefault)) throw ({
        status : middlewareErrorHandling.BAD_REQUEST_STATUS, 
        message : middlewareErrorHandling.PRODUCT_ALREADY_HAS_DEFAULT_UNIT 
    })

    const isProductUnitAlreadyExist = await Product_Detail.findOne({
      where : {
        productId, 
        unitId : req.body.unitId
      }
    })

    if(isProductUnitAlreadyExist?.dataValues?.unitId === Number(req.body.unitId)) throw ({
        status : middlewareErrorHandling.BAD_REQUEST_STATUS, 
        message : middlewareErrorHandling.PRODUCT_UNIT_ALREADY_EXISTS 
    })

    const unitProductList = await Product_Unit.findOne({ where :{unitId : req.body.unitId}})

    if(!unitProductList){
      const isUnitNameExist = await Product_Unit.findOne({
        where : { 
          name : req.body.unitName 
        }
      })

      if(isUnitNameExist) throw ({
          status : middlewareErrorHandling.BAD_REQUEST_STATUS, 
          message : middlewareErrorHandling.PRODUCT_UNIT_ALREADY_EXISTS 
      })

      const newUnit = await Product_Unit.create({name : req.body.unitName})

      req.body.unitId = newUnit?.dataValues?.unitId
    }

    const stockId = req.body.stockId

    req.body.productId = productId

    delete req.body.stockId

    await Product_Detail.update(
      req.body,
      {
        where : {
          stockId
        }
      }
    )

    const unitProduct =await Product_Detail.findOne({where:{stockId}})

    res.status(200).json({ 
      type : "success",
      message : "Unit Produk berhasil diperbaharui",
       unit : unitProduct
    })

  } catch (error){
    next(error)
  }
}

const deleteProductUnits = async( req, res, next ) => {
  try{
    const productId = req.params.productId

    await deleteProductUnitValidationSchema.validate(req.body)

    const isDefaultUnit = await Product_Detail.findOne({
      where : {
        productId, 
        stockId : req.body.stockId, 
        isDefault : 1
      }
    })

    if(isDefaultUnit) throw ({
        status : middlewareErrorHandling.BAD_REQUEST_STATUS, 
        message : middlewareErrorHandling.CANNOT_DELETE_DEFAULT_PRODUCT_UNIT 
    })

    await Product_Detail.update({isDeleted : 1},{where:{stockId : req.body.stockId}})

    res.status(200).json({ 
      type : "success",
      message : "Unit Produk berhasil didelete"
    })

  } catch (error){
    next(error)
  }
}

module.exports = {
    productUnits,
    setProductUnits,
    updateProductUnits,
    deleteProductUnits
}