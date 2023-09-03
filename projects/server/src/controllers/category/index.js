const {middlewareErrorHandling} = require("../../middleware/index.js");
const {Categories} = require("../../model/category.js");
const cloudinary = require("cloudinary");

const getCategory = async (req, res, next) => {
    try{
		const category = await Categories?.findAll({where : {isDeleted : 0}});
		res.status(200).json({
			type : "success",
			message : "categoryGet",
			data : {category}
		});
	}catch(error){
		next(error);
	}
}

const addCategory = async (req, res, next) => {
    try{
        const {data} = req.body;
        if(!req.file) {
            return next ({
                type : "error",
                status : middlewareErrorHandling.BAD_REQUEST_STATUS,
                message : middlewareErrorHandling.IMAGE_NOT_FOUND
            })
        }
        const body = JSON.parse(data);
        const {categoryDesc} = body;

        const categoryExists = await Categories?.findOne({where : {categoryDesc}});
        
        if(categoryExists?.dataValues?.isDeleted === 1){
            
            const categoryAdded = await Categories?.update({isDeleted : 0, categoryPicture : req?.file?.filename},{where : {categoryDesc : categoryDesc}} );
            res.status(200).json({
                type : "success",
                message : "Category has been re-created.",
                data : {categoryId : categoryExists?.dataValues?.categoryId, categoryDesc : categoryDesc}
            });
        
        }else if(categoryExists?.dataValues?.isDeleted === 0){
            
            throw ({ status : middlewareErrorHandling.BAD_REQUEST_STATUS, message : middlewareErrorHandling.CATEGORY_ALREADY_EXISTS});
        
        }else{
            
            const categoryAdded = await Categories?.create({categoryDesc, categoryPicture : req?.file?.filename, isDeleted : 0})
            res.status(200).json({
                type : "success",
                message : "Category created",
                data : categoryAdded
            });
        }       
    }catch(error){

        cloudinary.v2.api.delete_resources([`${req?.file?.filename}`],{type : `upload`,resource_type : 'image'})
        next(error);
    }
}

const deleteCategory = async (req, res, next) => {
    try{
        const {categoryId} = req.body;

        const categoryExists = await Categories?.findOne({where : {categoryId : categoryId}});
        if(!categoryExists) throw ({status : middlewareErrorHandling.BAD_REQUEST_STATUS, message : middlewareErrorHandling.CATEGORY_NOT_FOUND});

        const categoryStatus = categoryExists?.dataValues?.isDeleted;
        if(categoryStatus === 1) throw ({status : middlewareErrorHandling.BAD_REQUEST_STATUS, message : middlewareErrorHandling.CATEGORY_NOT_FOUND});

        const categoryDeleted = await categoryExists?.update({isDeleted : 1}, {where : {categoryId : categoryId}});
        res.status(200).json({message : "Category has been deleted", data : categoryDeleted});
    }catch(error){
        next(error);
    }
}

const updateCategory = async (req, res, next) => {
    try{
        const {categoryId, categoryDesc} = req.body;

        const categoryExists = await Categories?.findOne({where : {categoryId : categoryId}});
        if(!categoryExists) throw ({status : middlewareErrorHandling.BAD_REQUEST_STATUS, message : middlewareErrorHandling.CATEGORY_NOT_FOUND});
        if(categoryExists?.dataValues?.isDeleted === 1) throw ({status : middlewareErrorHandling.BAD_REQUEST_STATUS, message : middlewareErrorHandling.CATEGORY_NOT_FOUND});

        const categoryChanged = await Categories?.update({categoryDesc : categoryDesc},{where : {categoryId : categoryId}});
        res.status(200).json({message : "Category has been changed!", data : {categoryId : categoryId, categoryDesc : categoryDesc}});
    }catch(error){
        next(error);
    }
}

const updateCategoryPicture = async (req, res, next) => {
    try {
        const {categoryId} = req.params;

        const categoryExists = await Categories?.findOne({where : {categoryId : categoryId}});

        if(!categoryExists) throw ({status : middlewareErrorHandling.BAD_REQUEST_STATUS, message : middlewareErrorHandling.CATEGORY_NOT_FOUND});

        if(categoryExists?.dataValues?.isDeleted === 1) throw ({status : middlewareErrorHandling.BAD_REQUEST_STATUS, message : middlewareErrorHandling.CATEGORY_NOT_FOUND});

        if(!req.file){
            return next({
                status : middlewareErrorHandling.BAD_REQUEST_STATUS,
                message : middlewareErrorHandling.IMAGE_NOT_FOUND
            });
        }       

        if(categoryExists?.dataValues?.categoryPicture){
            cloudinary.v2.api.delete_resources([`${categoryExists?.dataValues?.categoryPicture}`],{type : `upload`,resource_type : 'image'});
        }
        
        await Categories?.update({categoryPicture : req?.file?.filename},{where: {categoryId : categoryId}});

        res.status(200).json({type : "success", message : "Category Image Uploaded.",imageURL : req?.file?.filename});
    }catch(error){

        cloudinary.v2.api.delete_resources([`${req?.file?.filename}`],{type : `upload`,resource_type : 'image'});
        next(error);

    }
}

module.exports = {
    getCategory,
    addCategory,
    deleteCategory,
    updateCategory,
    updateCategoryPicture
}