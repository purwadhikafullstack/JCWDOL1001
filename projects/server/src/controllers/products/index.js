const { middlewareErrorHandling } = require("../../middleware/index.js");
const {
  Product_Category,
  Product_List,
  Product_Unit,
  Categories,
  Product_Detail,
  Product_History,
  Discount_Product,
  Discount,
  Cart,
} = require("../../model/relation.js");
const { Op } = require("sequelize");
const cloudinary = require("cloudinary");
const {
  inputProductValidationSchema,
  updateProductValidationSchema,
  updateMainStockValidationSchema,
} = require("./validation.js");
const { ValidationError } = require("yup");
const { capitalizeEachWords, trimString } = require("../../utils/index.js");
const moment = require("moment")

const getProducts = async (req, res, next) => {
  try {
    const { page, id_cat, product_name, sort_price, sort_name, limit, promo } =
      req.query;

    const currentPage = page ? parseInt(page) : 1;

    const options = {
      offset:
        currentPage > 1 ? parseInt(currentPage - 1) * (limit ? +limit : 10) : 0,
      limit: limit ? +limit : 10,
    };

    const filter = { id_cat, product_name };
    if (id_cat) filter.id_cat = { categoryId: id_cat };
    if (product_name)
      filter.product_name = { productName: { [Op.like]: `%${trimString(product_name)}%` } };

    let sort = [];
    if (sort_price) sort.push([`productPrice`, sort_price]);
    if (sort_name) sort.push([`productName`, sort_name]);

    const products = await Product_List?.findAll({
      ...options,
      include: [
        {
          model: Categories,
          attributes: ["categoryDesc", "categoryId"],
          as: "productCategories",
          where: filter.id_cat,
        },
        {
          model: Product_Unit,
          as: "productUnits"
        },
        {
          model: Product_Detail,
        },
        {
          model: Discount_Product,
          attributes: { exclude: ["discountProductId"] },
          as: "discountProducts",
          where:{isDeleted:0},
          include: {
            model: Discount,
            where: { isDeleted: 0, 
              [Op.or] :[
                {discountExpired :{[Op.gte] : moment()}},
                {discountExpired :{[Op.is] : null}}
              ]
            },
            required: !!promo,
          },
          required: false,
        },
      ],
      where: { [Op.and]: [filter.product_name, { isDeleted: 0 }] },
      order: sort,
    });

    const total =
        product_name && !id_cat ?
          await Product_List?.count({
            where: { [Op.and]: [filter.product_name, { isDeleted: 0 }] },
          })
        : 
        id_cat || product_name ?
          await Product_List?.count({
            include: {
              model: Categories,
              as: "productCategories",
              where: filter.id_cat,
            },
            where: { [Op.and]: [filter.product_name, { isDeleted: 0 }] },
          })
        : promo ? 
          await Discount_Product?.count({where:{isDeleted:0}})
        :
          await Product_List?.count({ 
            include:{
              model: Discount_Product,
              attributes: { exclude: ["discountProductId"] },
              as: "discountProducts",
              include: {
                model: Discount,
                where: { isDeleted: 0 },
                required: !!promo,
              },
            },
            where: { isDeleted: 0 } 
          })

    const pages = Math.ceil(total / options.limit);

    res.status(200).json({
      type: "success",
      message: "Products fetched",
      currentPage: +page ? +page : 1,
      totalPage: pages,
      totalProducts: total,
      productLimit: options.limit,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

const getProductDiscount = async (req, res, next) => {
  try {
    const options = {
      offset:0,
      limit: 10,
    };
    const products = await Product_List?.findAll({
      ...options,
      include: [
        {
          model: Categories,
          attributes: ["categoryDesc", "categoryId"],
          as: "productCategories",
        },
        {
          model: Discount_Product,
          attributes: { exclude: ["discountProductId"] },
          as: "discountProducts",
          where:{isDeleted:0},
          include: {
            model: Discount,
            where: { isDeleted: 0, 
              [Op.or] :[
                {discountExpired :{[Op.gte] : moment()}},
                {discountExpired :{[Op.is] : null}}
              ]
            },
            required: true,
          },
          required: false,
        },
      ],
      where:{ isDeleted: 0  },
    });

    if (!products) {
      throw new Error(middlewareErrorHandling.PRODUCT_NOT_FOUND);
    }
    
    res.status(200).json({
      type: "success",
      message: "Products fetched",
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product_List?.findOne({
      include: [
        {
          model: Categories,
          attributes: ["categoryDesc", "categoryId"],
          as: "productCategories",
        },
        {
          model: Product_Unit,
          as: "productUnits",
        },
        {
          model: Product_Detail,
          attributes: ["quantity"],
        },
        {
          model: Discount_Product,
          attributes: { exclude: ["discountProductId"] },
          as: "discountProducts",
          include: {
            model: Discount,
            required: false,
          },
          where: { isDeleted: 0 },
          required:false
        },
      ],
      where: { productId: id },
    });

    if (!product) {
      throw new Error(middlewareErrorHandling.PRODUCT_NOT_FOUND);
    }

    res.status(200).json({
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const { data } = req.body;
    const body = JSON.parse(data);

    if (!req.file) {
      return next({
        type: "error",
        status: middlewareErrorHandling.BAD_REQUEST_STATUS,
        message: middlewareErrorHandling.IMAGE_NOT_FOUND,
      });
    }

    const productData = {
      productName: capitalizeEachWords(trimString(body?.productName)),
      productPrice: +body?.productPrice,
      productDosage: capitalizeEachWords(trimString(body?.productDosage)),
      productDescription: capitalizeEachWords(
        trimString(body?.productDescription)
      ),
      categoryId: body?.categoryId,
      productPicture: req.file?.filename,
    };

    await inputProductValidationSchema.validate(productData);

    const existingProduct = await Product_List.findOne({
      where: { productName: body.productName, isDeleted: 0 },
    });

    if (existingProduct) {
      throw new Error(middlewareErrorHandling.PRODUCT_ALREADY_EXISTS);
    }

    const product = await Product_List.create(productData);

    const categoryIds = Array.isArray(body?.categoryId)
      ? body.categoryId.map((categoryId) => ({
          productId: product.productId,
          categoryId,
        }))
      : [];

    if (categoryIds.length > 0) {
      await Product_Category.bulkCreate(categoryIds);
    }

    res
      .status(200)
      .json({ message: "Product Added Successfully", data: product });
  } catch (error) {
    if (req.file) {
      await cloudinary.v2.api.delete_resources([req.file.filename], {
        type: "upload",
        resource_type: "image",
      });
    }
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { data } = req.body;
    const body = JSON.parse(data);

    const product = await Product_List.findOne({ where: { productId: id } });

    if (!product) {
      throw new Error(middlewareErrorHandling.PRODUCT_NOT_FOUND);
    }

    const existingProduct = await Product_List.findOne({
      where: {
        productId: { [Op.not]: id },
        productName: body.productName || product.productName,
      },
    });

    if (existingProduct) {
      throw new Error(middlewareErrorHandling.PRODUCT_ALREADY_EXISTS);
    }

    const productData = {
      productName:
        capitalizeEachWords(trimString(body?.productName)) ||
        product.productName,
      productPrice: +body.productPrice || product.productPrice,
      productDosage:
        capitalizeEachWords(trimString(body?.productDosage)) ||
        product.productDosage,
      productDescription:
        capitalizeEachWords(trimString(body?.productDescription)) ||
        product.productDescription,
      categoryId: body.categoryId || product.categoryId,
    };

    // console.log(productData);

    await updateProductValidationSchema.validate(productData);

    Object.assign(product, productData);

    if (req.file) {
      if (product.productPicture) {
        cloudinary.v2.api.delete_resources([`${product.productPicture}`], {
          type: "upload",
          resource_type: "image",
        });
      }

      product.productPicture = req.file.filename;
    }

    await product.save();

    if (Array.isArray(body.categoryId)) {
      await Product_Category.destroy({ where: { productId: id } });

      const categoryIds = body.categoryId.map((categoryId) => ({
        productId: product.productId,
        categoryId,
      }));

      await Product_Category.bulkCreate(categoryIds);
    }

    res
      .status(200)
      .json({ message: "Product updated successfully", data: product });
  } catch (error) {
    if (req.file) {
      await cloudinary.v2.api.delete_resources([req.file.filename], {
        type: "upload",
        resource_type: "image",
      });
    }

    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const productExists = await Product_List.findOne({
      where: { productId: id },
    });

    if (!productExists) {
      throw new Error(middlewareErrorHandling.PRODUCT_NOT_FOUND);
    }
    await productExists.update({ isDeleted: 1 });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const updateMainStock = async (req, res, next) => {
  try {
    const { productId, value } = req.body;
    // type: penjualan, unit conversion,update stock; kasus ini typenya cmn buat update main stock
    //@validate request
    await updateMainStockValidationSchema.validate(req.body);
    //@ambil data product details(id produk, id unit, idsstocknya, quantity, dll :
    //misal as detailproduk, dimana id product sesuai input dan isdefault true
    const detail = await Product_Detail.findOne({
      where: { productId: productId, isDefault: 1 },
    });
    const unitName = await Product_Unit.findOne({
      where: { unitId: detail?.unitId },
    });
    // kalau status detail produk is deleted 1 throw error
    if (detail?.isDeleted === 1) {
      throw new Error(middlewareErrorHandling.PRODUCT_NOT_FOUND);
    }

    let status = "Penambahan";
    // kalau besar perubahan > 0, tipe penambahan
    if (value < 0) {
      status = "Pengurangan";
    }
    if (value === 0) {
      throw new Error(middlewareErrorHandling.NO_CHANGES);
    }

    //@update product detail and history
    const history = await Product_History.create({
      productId: productId,
      unit: unitName?.name,
      initialStock: detail?.quantity,
      status: status,
      type: "Update Stock",
      quantity: value > 0 ? value : -1 * +value,
      results: detail?.quantity + +value,
    });

    await detail.update({ quantity: history?.results });

    //get cart where productId = productId
    //map aja, promise all, if quantity > result di history, brrti update cartnya
    const itemInCart = await Cart.findAll({where : {
      productId : productId
    }})

    await Promise.all(
      itemInCart.map(async(item)=>{
        if(item.quantity > detail?.quantity){
          // console.log("user "+item.userId+" punya "+item.quantity)
          await Cart.update({
            quantity : (detail?.quantity)
          },{
            where : {
              cartId : item?.dataValues?.cartId
            }
          })
        }
      })
    )

    res
      .status(200)
      .json({
        message: "Product stock updated successfully",
        detail: detail,
        history: history,
      });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  getProductDiscount,
  createProduct,
  updateProduct,
  deleteProduct,
  updateMainStock,
};
