const {middlewareErrorHandling} = require("../../middleware/index.js");
const {Categories} = require("../../model/category.js");
const cloudinary = require("cloudinary");
const {db} = require("../../model/index.js");
const {sequelize} = require("sequelize");

const getCategory = async (req, res, next) => {
    try{
		const category = await Categories?.findAll({where : {isDeleted : 0}});
		res.status(200).json({
			type : "success",
			message : "Kategori berhasil didapatkan",
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
                message : "Gambar kosong."
            })
        }
        const body = JSON.parse(data);
        const {categoryDesc} = body;

        const categoryExists = await Categories?.findOne({where : {categoryDesc}});
        
        if(categoryExists?.dataValues?.isDeleted === 1){
            
            const categoryAdded = await Categories?.update({isDeleted : 0, categoryPicture : req?.file?.filename},{where : {categoryDesc : categoryDesc}} );
            res.status(200).json({
                type : "success",
                message : "Kategori berhasil dibuat ulang.",
                data : {categoryId : categoryExists?.dataValues?.categoryId, categoryDesc : categoryDesc}
            });
        
        }else if(categoryExists?.dataValues?.isDeleted === 0){
            
            throw ({ status : middlewareErrorHandling.BAD_REQUEST_STATUS, message : "Kategori sudah ada!"});
        
        }else{
            
            const categoryAdded = await Categories?.create({categoryDesc, categoryPicture : req?.file?.filename, isDeleted : 0})
            res.status(200).json({
                type : "success",
                message : "Kategori berhasil dibuat.",
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
        if(!categoryExists) throw ({status : 400, message : "Kategori tidak ditemukan"});

        const categoryStatus = categoryExists?.dataValues?.isDeleted;
        if(categoryStatus === 1) throw ({status : 400, message : "Kategori telah di-delete"});

        const categoryDeleted = await categoryExists?.update({isDeleted : 1}, {where : {categoryId : categoryId}});
        res.status(200).json({message : "Kategori telah di-delete.", data : categoryDeleted});
    }catch(error){
        next(error);
    }
}

const updateCategory = async (req, res, next) => {
    try{
        const {categoryId, categoryDesc} = req.body;

        const categoryExists = await Categories?.findOne({where : {categoryId : categoryId}});
        if(!categoryExists) throw ({status : 400, message : "Kategori tidak ditemukan"});
        if(categoryExists?.dataValues?.isDeleted === 1) throw ({status : 400, message : "Kategori tidak ditemukan"});

        const categoryChanged = await Categories?.update({categoryDesc : categoryDesc},{where : {categoryId : categoryId}});
        res.status(200).json({message : "Kategori telah diganti.", data : {categoryId : categoryId, categoryDesc : categoryDesc}});
    }catch(error){
        next(error);
    }
}

const updateCategoryPicture = async (req, res, next) => {
    try {
        const {categoryId} = req.params;

        const categoryExists = await Categories?.findOne({where : {categoryId : categoryId}});

        if(!categoryExists) throw ({type : "error", message : "Kategori tidak ditemukan"});

        if(categoryExists?.dataValues?.isDeleted === 1) throw ({status : 400, message : "Kategori telah di-delete"});

        if(!req.file){
            return next({
                status : middlewareErrorHandling.BAD_REQUEST_STATUS,
                message : "Gambar kosong."
            });
        }       

        if(categoryExists?.dataValues?.categoryPicture){
            cloudinary.v2.api.delete_resources([`${categoryExists?.dataValues?.categoryPicture}`],{type : `upload`,resource_type : 'image'});
        }
        
        await Categories?.update({categoryPicture : req?.file?.filename},{where: {categoryId : categoryId}});

        res.status(200).json({type : "success", message : "Gambar Kategori sudah diupload.",imageURL : req?.file?.filename});
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