const {middlewareErrorHandling} = require("../../../middleware/index.js");
const { Product_Unit, Product_Detail, Product_History } = require("../../../model/relation.js")
const {productUnitValidationSchema, deleteProductUnitValidationSchema, reactivateProductUnitValidationSchema } = require("./validation.js")

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

    const isExceedMaxUnit = await Product_Detail.count({where : { productId, isDeleted : 0}})

    if(isExceedMaxUnit === 2 ) throw ({
      status : middlewareErrorHandling.BAD_REQUEST_STATUS, 
      message : middlewareErrorHandling.PRODUCT_UNIT_EXCEED_LIMIT 
    })

    const isDefaultUnitExist = await Product_Detail.findOne({where : {productId, isDefault:1}})

    if(Number(isDefaultUnitExist?.dataValues?.isDefault) === Number(req.body.isDefault)) throw ({
        status : middlewareErrorHandling.BAD_REQUEST_STATUS, 
        message : middlewareErrorHandling.PRODUCT_ALREADY_HAS_DEFAULT_UNIT 
    })

    if(!isDefaultUnitExist && Number(req.body.isDefault) ===0 && isExceedMaxUnit > 0) throw ({
        status : middlewareErrorHandling.BAD_REQUEST_STATUS, 
        message : middlewareErrorHandling.PRODUCT_DONT_HAVE_DEFAULT_UNIT 
    })

    const isProductUnitAlreadyExist = await Product_Detail.findOne({ where : { productId, unitId : req.body.unitId }})

    if(isProductUnitAlreadyExist?.dataValues?.unitId === Number(req.body.unitId)) throw ({
        status : middlewareErrorHandling.BAD_REQUEST_STATUS, 
        message : middlewareErrorHandling.PRODUCT_UNIT_ALREADY_EXISTS 
    })

    
    const isInUnitProductList = await Product_Unit.findOne({where :{unitId : req.body.unitId}})
    
    const productUnitName = req?.body?.unitName ? req?.body?.unitName : isInUnitProductList.name

    if(!isInUnitProductList){
      const isUnitNameExist = await Product_Unit.findOne({where : {name : req.body.unitName,isSecondary : req.body.isSecondary}})
      
      if(isUnitNameExist) throw ({
          status : middlewareErrorHandling.BAD_REQUEST_STATUS, 
          message : middlewareErrorHandling.PRODUCT_UNIT_NAME_ALREADY_EXISTS 
      })

      const newUnit = await Product_Unit.create({name : req.body.unitName, isSecondary : req.body.isSecondary})
      
      req.body.unitId = newUnit?.dataValues?.unitId
    }

    req.body.productId = productId

    req.body.isDeleted = 0

    const unitProduct = await Product_Detail.create(req.body)
    
    await Product_History.create({
      productId : req.body.productId,
      unit : productUnitName,
      initialStock : 0,
      status : "Penambahan",
      type : "Set Product Unit",
      quantity : req.body.quantity,
      results : req.body.quantity
    })

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

    // const isDefaultUnitExist = await Product_Detail.findOne({ where : { productId, isDefault:1 }})

    // const lengthUnit = await Product_Detail.count({where:{productId}})

    const stockId = req.body.stockId

    delete req.body.stockId

    const stock = await Product_Detail.findOne({ 
      where : { productId, stockId },
      include :{
        model : Product_Unit
      }
    })

    const productUnitName = req?.body?.unitName ? req?.body?.unitName : stock?.dataValues?.product_unit?.name

    // if(
    //     ( Number(isDefaultUnitExist?.dataValues?.isDefault) === Number(req.body.isDefault) ) && 
    //     ( Number(isDefaultUnitExist?.dataValues?.stockId) !== Number(stockId) ) && lengthUnit>1
    //   ) throw ({
    //     status : middlewareErrorHandling.BAD_REQUEST_STATUS, 
    //     message : middlewareErrorHandling.PRODUCT_ALREADY_HAS_DEFAULT_UNIT 
    // })

    // const isProductUnitAlreadyExist = await Product_Detail.findOne({ where : { productId, unitId : stockId }})

    // if(isProductUnitAlreadyExist?.dataValues?.unitId === Number(stockId)) throw ({
    //     status : middlewareErrorHandling.BAD_REQUEST_STATUS, 
    //     message : middlewareErrorHandling.PRODUCT_UNIT_ALREADY_EXISTS 
    // })

    const unitProductList = await Product_Unit.findOne({ where :{unitId : req.body.unitId}})

    if(!unitProductList){
      const isUnitNameExist = await Product_Unit.findOne({ where : {name : req.body.unitName}})

      if(isUnitNameExist) throw ({
          status : middlewareErrorHandling.BAD_REQUEST_STATUS, 
          message : middlewareErrorHandling.PRODUCT_UNIT_ALREADY_EXISTS 
      })

      const newUnit = await Product_Unit.create({name : req.body.unitName, isSecondary : req.body.isSecondary ? 1 : 0})

      req.body.unitId = newUnit?.dataValues?.unitId
    }

    req.body.productId = productId
    
    await Product_Detail.update( req.body, {where : {stockId}} )

    const unitProduct =await Product_Detail.findOne({where:{stockId}})

    await Product_History.create({
      productId : req.body.productId,
      unit : productUnitName,
      initialStock : stock?.dataValues?.quantity,
      status : "Perubahan",
      type : "Update Unit",
      quantity : req.body.quantity,
      results : unitProduct?.dataValues?.quantity
    })

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

    await Product_Detail.update({isDeleted : 1},{where: {stockId : req.body.stockId}})

    const stock = await Product_Detail.findOne({ 
      where : { productId, stockId : req.body.stockId},
      include :{
        model : Product_Unit
      }
    })

    await Product_History.create({
      productId : productId,
      unit : stock?.dataValues?.product_unit.name,
      initialStock : stock?.dataValues?.quantity,
      status : "Penghapusan",
      type : "Delete Product Unit",
      quantity : stock?.dataValues?.quantity,
      results : stock?.dataValues?.quantity
    })

    res.status(200).json({ 
      type : "success",
      message : "Unit Produk berhasil didelete",
      isDefaultUnit
    })

  } catch (error){
    next(error)
  }
}

const reactivateUnits = async( req, res, next ) => {
  try{
    await reactivateProductUnitValidationSchema.validate(req.body)

    const unitProduct = await Product_Detail.findOne({
      where : { stockId : req.body.stockId, productId : req.body.productId},
      include :{ model : Product_Unit }
    })

    if(!unitProduct ) throw ({
      status : middlewareErrorHandling.NOT_FOUND_STATUS, 
      message : middlewareErrorHandling.PRODUCT_UNIT_NOT_FOUND 
    })

    const isExceedMaxUnit = await Product_Detail.count({where : { productId : req.body.productId, isDeleted : 0}})

    if(isExceedMaxUnit === 2 ) throw ({
      status : middlewareErrorHandling.BAD_REQUEST_STATUS, 
      message : middlewareErrorHandling.PRODUCT_UNIT_EXCEED_LIMIT 
    })

    await Product_Detail.update({isDeleted : 0},{where:{ productId : req.body.productId, stockId : req.body.stockId}})

    await Product_History.create({
      productId : req.body.productId,
      unit : unitProduct?.dataValues?.product_unit.name,
      initialStock : unitProduct?.dataValues?.quantity,
      status : "Pengaktifan",
      type : "Reactivate Product Unit",
      quantity : unitProduct?.dataValues?.quantity,
      results : unitProduct?.dataValues?.quantity
    })

    res.status(200).json({ 
      type : "success",
      message :"Unit Produk berhasil diaktifkan kembali"
    })

  } catch (error){
    next(error)
  }
}

module.exports = {
    productUnits,
    setProductUnits,
    updateProductUnits,
    deleteProductUnits,
    reactivateUnits
}