const express = require("express")
const product = require("./index.js")
const {verifyUser, verifyAdmin} = require("../../middleware/token.verify.js")
const { helperUploader } = require("../../helper/index.js");

const router = express.Router()
// @setup multer
const storage = helperUploader.createCloudinaryStorage("Public/Products")
const uploader = helperUploader.createUploader(storage)

router.get("/", product.getProducts)
router.post("/", verifyAdmin, uploader.single("file"), product.createProduct)
router.patch("/:id", verifyAdmin, uploader.single("file"), product.updateProduct)
router.patch("/delete/:id", verifyAdmin, product.deleteProduct)


module.exports = router

