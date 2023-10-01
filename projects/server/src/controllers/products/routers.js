const express = require("express")
const product = require("./index.js")
const unit = require("./units/index.js")
const convertion = require("./units/convertion/index.js")
const recipe = require("./recipe/index.js")
const {verifyUser, verifyAdmin} = require("../../middleware/token.verify.js")
const { helperUploader } = require("../../helper/index.js");

const router = express.Router()
// @setup multer
const storage = helperUploader.createCloudinaryStorage("Public/Products")
const uploader = helperUploader.createUploader(storage)

router.get("/", product.getProducts)
router.post("/", verifyAdmin, uploader.single("file"), product.createProduct)
router.patch("/delete/:id", verifyAdmin, product.deleteProduct)
router.get("/unit", verifyAdmin, unit.productUnits)
router.patch("/unit/update/:productId", verifyAdmin, unit.updateProductUnits)
router.patch("/unit/delete/:productId", verifyAdmin, unit.deleteProductUnits)
router.patch("/unit/make-convertion", verifyAdmin, convertion.makeConvertionUnit)
router.patch("/unit/reactivate", verifyAdmin, unit.reactivateUnits)
router.post("/unit/:productId", verifyAdmin, unit.setProductUnits)
router.patch("/stock/update",  verifyAdmin, product.updateMainStock)
router.get("/:id", product.getProductById)
router.patch("/:id", verifyAdmin, uploader.single("file"), product.updateProduct)

router.get("/recipe/user", verifyAdmin, recipe.getUser)
router.post("/recipe/check", verifyAdmin, recipe.checkIngredientStock)
router.post("/recipe/reverse", verifyAdmin, recipe.reverseStock)
router.post("/recipe/order/:token",verifyUser, recipe.createCustomProductOrder)

module.exports = router


