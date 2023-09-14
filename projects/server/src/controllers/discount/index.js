const {Op} = require("sequelize")
const { Discount, Discount_Product, Product_Detail, Product_List } = require("../../model/relation.js")
const { DiscountInfoValidationSchema } = require("./validation.js")
const { middlewareErrorHandling } = require("../../middleware/index.js")

const getDiscount = async (req, res, next) => {
    try{
        const { page, discountName } = req.query

        const options = {
            offset: page > 1 ? parseInt(page - 1) * 5 : 0,
            limit : 5,
        }

        const filter = { discountName }
        if(discountName) filter.discountName = {discountName: {[Op.like]: `%${discountName}%`}}
        
		const discount = await Discount.findAll({
            ...options,
            include : {
                model : Discount_Product,
                attributes : ["productId"],
                as : "productDiscount",
                include : {
                    model : Product_List,
                    as: "detailProduct"
                }
            },
            where : {
                [Op.and]: [
                    filter.discountName,
                    {"isDeleted" : 0}
                ]
            },
        })

        if(discount.length === 0) throw({
            status : middlewareErrorHandling.BAD_REQUEST_STATUS,
            message : middlewareErrorHandling.DISCOUNT_NOT_FOUND
        })

        const total = discountName || page ?  await Discount?.count({where : { [Op.and]: [ filter.discountName, {"isDeleted" : 0} ] }}) : await Discount?.count({where : {"isDeleted" :0}})

        const pages = Math.ceil(total / options.limit)

		res.status(200).json({
			type : "success",
			message : "Data berhasil dimuat",
            currentPage : page ? page : 1,
            totalPage : pages,
			discount : discount
		})
	}catch(error){
		next(error)
	}
}

const createDiscount = async (req, res, next) => {
    try{
        await DiscountInfoValidationSchema.validate(req.body.data)

        const {discountCode,discountAmount,oneGetOne,minimalTransaction,isPercentage,} = req.body.data

        if((oneGetOne === 0 || (minimalTransaction === "" || minimalTransaction =="0")) && discountCode === "" ) throw({
            status : middlewareErrorHandling.BAD_REQUEST_STATUS,
            message : middlewareErrorHandling.VOUCHER_CODE_EMPTY
        })

        if((discountAmount === "" || discountAmount == "0" ) && discountCode !== "" ) throw({
            status : middlewareErrorHandling.BAD_REQUEST_STATUS,
            message : middlewareErrorHandling.VOUCHER_CANT_WITH_AMOUNT
        })

        const isNameExist = await Discount.findAll({ where : { discountName : req.body.data.discountName } })

        if(isNameExist>0) throw({
            status : middlewareErrorHandling.BAD_REQUEST_STATUS,
            message : middlewareErrorHandling.DISCOUNT_NAME_ALREADY_EXIST
        })

        const discountData = await Discount.create(req.body.data)

        if(req.body.products.length > 0){
            if(isPercentage == 1 ){
                req.body.products.map((product)=>product.endingPrice = ((1 - (discountAmount/100) )* product.productPrice))
            }
            if(isPercentage == 0 && discountAmount > 0){
                req.body.products.map((product)=>product.endingPrice = product.productPrice - discountAmount)
            }
            await req.body.products.map((product)=>product.discountId = discountData.discountId)
            const outputProducts = req.body.products.map(({productId, endingPrice,discountId}) => { return {productId, endingPrice,discountId} })
            await Discount_Product.bulkCreate(outputProducts)
        }

		res.status(200).json({
			type : "success",
			message : "Data berhasil dimuat",
            
		})
	}catch(error){
		next(error)
	}
}

const updateDiscount = async (req, res, next) =>{
    try{
        await DiscountInfoValidationSchema.validate(req.body.data)
        
        const {discountCode,discountAmount,oneGetOne,minimalTransaction,isPercentage,} = req.body.data

        const discountId = req.params.discountId

        const isDiscountExist = await Discount.findAll({ where : { discountId } })
        
        if(!isDiscountExist) throw({
            status : middlewareErrorHandling.NOT_FOUND_STATUS,
            message : middlewareErrorHandling.DISCOUNT_NOT_FOUND
        })

        const isNameExist = await Discount.count({ where : { discountName : req.body.data.discountName,[Op.not]:[{discountId}] } })

        if(isNameExist>0) throw({
            status : middlewareErrorHandling.BAD_REQUEST_STATUS,
            message : middlewareErrorHandling.DISCOUNT_NAME_ALREADY_EXIST
        })

        if((oneGetOne === 0 || (minimalTransaction === "" || minimalTransaction =="0")) && discountCode === "" ) throw({
            status : middlewareErrorHandling.BAD_REQUEST_STATUS,
            message : middlewareErrorHandling.VOUCHER_CODE_EMPTY
        })

        if((discountAmount === "" || discountAmount == "0" ) && discountCode !== "" ) throw({
            status : middlewareErrorHandling.BAD_REQUEST_STATUS,
            message : middlewareErrorHandling.VOUCHER_CANT_WITH_AMOUNT
        })

        await Discount.update(req.body.data, { where : { discountId } })

        if(req.body.products.length > 0){
            await Discount_Product.destroy({ where : { discountId } })
            
            if(isPercentage == 1 ){
                req.body.products.map((product)=>product.endingPrice = ((1 - (discountAmount/100) )* product.detailProduct.productPrice))
            }
            if(isPercentage == 0 && discountAmount > 0){
                req.body.products.map((product)=>product.endingPrice = product.detailProduct.productPrice - discountAmount)
            }
            await req.body.products.map((product)=>product.discountId = discountId)
            
            const outputProducts = req.body.products.map(({productId, endingPrice,discountId}) => { return {productId, endingPrice,discountId} })
            
            await Discount_Product.bulkCreate(outputProducts)
        }

        const discountData = await Discount.findOne({ 
            where : { discountId } ,
            include : {
                model : Discount_Product,
                attributes : ["productId"],
                as : "productDiscount",
                include : {
                    model : Product_Detail,
                    attributes : ["quantity","convertion"],
                    as : "productDetail",
                    include : {
                        model : Product_List,
                        as : "productList",
                        attributes : {
                            exclude : ["productId","isDeleted","productPicture"]
                        }
                    }
                }
            }
        })

        res.status(200).json({
			type : "success",
			message : "Data berhasil diupdate",
            discount : discountData
		})

    }catch(error){
        next(error)
    }
}

const deleteDiscount = async (req, res, next) =>{
    try{
        const discountId = req.params.discountId

        const isDiscountExist = await Discount.findAll({ where : { discountId } })
        
        if(!isDiscountExist) throw({
            status : middlewareErrorHandling.NOT_FOUND_STATUS,
            message : middlewareErrorHandling.DISCOUNT_NOT_FOUND
        })
        
        await Discount.update({isDeleted : 1}, { where : { discountId } })

        const discountData = await Discount.findAll({ 
            where : { discountId },
            attributes : ["discountId","discountName","isDeleted"]
        })

        res.status(200).json({
			type : "success",
			message : "Data diskon berhasil didelete",
            data : discountData
		})

    }catch(error){
        next(error)
    }
}

const checkDiscount = async (req, res, next) =>{
    try{
        const { code, nominal, productId } = req.body

        const filter = { code, nominal, productId }
        if(code) filter.code = {discountCode: {[Op.like]: `${code}`}}
        if(nominal) filter.nominal = {minimalTransaction: {[Op.gte]: `${nominal}`}}
        if(productId) filter.productId = {productId: {[Op.or]: productId}}


        const isDiscountExist = await Discount.findAll({ 
            include : {
                model : Discount_Product,
                attributes : ["productId"],
                as : "productDiscount",
                where : filter.productId
            },
            where : {
                [Op.or]: [
                    { isDeleted : 0 },
                    { [Op.or] :[
                        filter.nominal,
                        filter.code
                    ] }
                ]
            },
        })
        
        if(!isDiscountExist || isDiscountExist.length === 0) throw({
            status : middlewareErrorHandling.NOT_FOUND_STATUS,
            message : middlewareErrorHandling.DISCOUNT_NOT_FOUND
        })

        res.status(200).json({
			type : "success",
			message : "Data berhasil dimuat",
            data : isDiscountExist
		})

    }catch(error){
        next(error)
    }
}

module.exports = {
    getDiscount,
    createDiscount,
    updateDiscount,
    deleteDiscount,
    checkDiscount
}