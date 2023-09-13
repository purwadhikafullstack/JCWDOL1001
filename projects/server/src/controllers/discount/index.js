const {Op} = require("sequelize")
const { Discount, Discount_Product, Product_Detail, Product_List } = require("../../model/relation.js")
const { DiscountInfoValidationSchema } = require("./validation.js")
const { middlewareErrorHandling } = require("../../middleware/index.js")

const getDiscount = async (req, res, next) => {
    try{
        const { page, discountName } = req.query

        const options = {
            offset: page > 1 ? parseInt(page - 1) * 2 : 0,
            limit : 2,
        }

        const filter = { discountName }
        if(discountName) filter.discountName = {discountName: {[Op.like]: `${discountName}`}}
        
		const discount = await Discount.findAll({
            ...options,
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
            },
            where : filter.discountName,
        })

        if(discount.length === 0) throw({
            status : middlewareErrorHandling.BAD_REQUEST_STATUS,
            message : middlewareErrorHandling.DISCOUNT_NOT_FOUND
        })

		res.status(200).json({
			type : "success",
			message : "Data berhasil dimuat",
			discount : discount
		})
	}catch(error){
		next(error)
	}
}

const createDiscount = async (req, res, next) => {
    try{
        await DiscountInfoValidationSchema.validate(req.body.data)

        const isNameExist = await Discount.findAll({ where : { discountName : req.body.data.discountName } })

        if(isNameExist) throw({
            status : middlewareErrorHandling.BAD_REQUEST_STATUS,
            message : middlewareErrorHandling.DISCOUNT_NAME_ALREADY_EXIST
        })

        const discountData = await Discount.create(req.body.data)

        if(req.body.products){
            req.body.products.map((product)=>product.discountId = discountData.discountId)
            await Discount_Product.bulkCreate(req.body.products)
        }

		res.status(200).json({
			type : "success",
			message : "Data berhasil dimuat",
            discountData
		})
	}catch(error){
		next(error)
	}
}

const updateDiscount = async (req, res, next) =>{
    try{
        await DiscountInfoValidationSchema.validate(req.body.data)

        const discountId = req.params.discountId

        const isDiscountExist = await Discount.findAll({ where : { discountId } })
        
        if(!isDiscountExist) throw({
            status : middlewareErrorHandling.NOT_FOUND_STATUS,
            message : middlewareErrorHandling.DISCOUNT_NOT_FOUND
        })

        const isNameExist = await Discount.findAll({ where : { discountName : req.body.data.discountName } })

        if(isNameExist) throw({
            status : middlewareErrorHandling.BAD_REQUEST_STATUS,
            message : middlewareErrorHandling.DISCOUNT_NAME_ALREADY_EXIST
        })
        
        await DiscountInfoValidationSchema.validate(req.body.data)

        await Discount.update(req.body.data, { where : { discountId } })

        if(req.body.products){
            await Discount_Product.destroy({ where : { discountId } })

            req.body.products.map((product)=>product.discountId = discountId)

            await Discount_Product.bulkCreate(req.body.products)
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
			message : "Data berhasil diupdate",
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
        if(nominal) filter.nominal = {minimalTransaction: {[Op.like]: `${nominal}`}}
        if(productId) filter.productId = {productId: {[Op.like]: `${productId}`}}

        const isDiscountExist = await Discount.findAll({ 
            include : {
                model : Discount_Product,
                attributes : ["productId"],
                as : "productDiscount",
                where : filter.productId
            },
            where : {
                [Op.and]: [
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