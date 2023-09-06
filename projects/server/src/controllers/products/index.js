const {middlewareErrorHandling} = require("../../middleware/index.js");
const {Product_Category, Product_List} = require("../../model/relation.js")
const {Op} = require("sequelize")
const cloudinary = require("cloudinary");
const {inputProductValidationSchema, updateProductValidationSchema } = require("./validation.js")
const {ValidationError} = require("yup")

const getProducts = async (req, res, next) => {
    try{
		const products = await Product_List?.findAll({where : {isDeleted : 0}});
		res.status(200).json({
			type : "success",
			message : "Products fetched",
			data : products
		});
	}catch(error){
		next(error);
	}
}

const addProducts = async (req, res, next) => {
  try {
    const { data } = req.body;
    const body = JSON.parse(data);

    if(!req.file) {
      return next ({
          type : "error",
          status : middlewareErrorHandling.BAD_REQUEST_STATUS,
          message : middlewareErrorHandling.IMAGE_NOT_FOUND
      })
    }

    const productData = {
      productName: body?.productName,
      productPrice: +body?.productPrice,
      productDosage: body?.productDosage,
      productDescription: body?.productDescription,
      categoryId: body?.categoryId,
      productPicture: req.file?.filename
    };

    // await inputProductValidationSchema.validate(productData);

    const productExists = await Product_List.findOne({
      where: { productName: body.productName, isDeleted: 0 },
    });

    if (productExists) {
      throw new Error('Product already exists');
    }

    const product = await Product_List.create(productData);

      for (const categoryId of body?.categoryId) {
        await Product_Category.create({
          productId: product.productId,
          categoryId: categoryId,
        });
      }

    res.status(200).json({ message: 'Product Added Successfully', data: product
    });
  } catch (error) {
    cloudinary.v2.api.delete_resources([`${req?.file?.filename}`],{type : `upload`,resource_type : 'image'})
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { data } = req.body;
    const body = JSON.parse(data);

    const product = await Product_List.findOne({ where: { productId : id } });

    if (!product) {
      throw new Error('Product not found');
    }

    const productExist = await Product_List.findAll({ where: { productId: { [Op.not]: id }, productName: body?.name ? body.name : '' } });

    if (productExist.length > 0) {
      throw new Error('Product already exists');
    }

    // await updateProductValidationSchema.validate(productData);

    product.productName = body.productName || product.productName;
    product.productPrice = +body.productPrice || product.productPrice;
    product.productDosage = body.productDosage || product.productDosage;
    product.productDescription = +body.productDescription || product.productDescription;

    if (req.file) {
      if (product.productPicture) {
        cloudinary.v2.api.delete_resources([`${product.productPicture}`], { type: 'upload', resource_type: 'image' });
      }

      product.productPicture = req.file.filename;
    }

    await product.save();

    if (Array.isArray(body?.categoryId)) {
      await Product_Category.destroy({ where: { productId: id } });

      for (const categoryId of body?.categoryId) {
        await Product_Category.create({
          productId: product.productId,
          categoryId: categoryId,
        });
      }
    }

    res.status(200).json({ message: 'Product updated successfully', data: product });
  } catch (error) {

    if (req.file) {
      await cloudinary.v2.api.delete_resources([req.file.filename], {
        type: 'upload',
        resource_type: 'image',
      });
    }

    next(error);
  }
};

const deleteProduct = async (req, res, next)=>{
  try {
    const { id } = req.params
    const productExists = await Product_List.findOne({ where: { productId : id } });

    if (!productExists) {
      throw new Error('Product not found');
    }
    await productExists.update({ isDeleted: 1 });

    res.status(200).json({ message: 'Product deleted successfully' });

  } catch (error) {
    next(error);
    
  }
}

module.exports = {
    getProducts,
    addProducts,
    updateProduct,
    deleteProduct,
}