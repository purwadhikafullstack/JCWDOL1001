const express = require("express")
const product = require("./index.js")
const {verifyUser, verifyAdmin} = require("../../middleware/token.verify.js")
const { helperUploader } = require("../../helper/index.js");

const router = express.Router()
// @setup multer
const storage = helperUploader.createCloudinaryStorage("Public/Products")
const uploader = helperUploader.createUploader(storage)

router.get("/", product.getProducts)
router.post("/", uploader.single("file"), product.addProducts) //NOTE: verifyAdmin
router.patch("/:id", uploader.single("file"), product.updateProduct) //NOTE: verifyAdmin
router.patch("/delete/:id", product.deleteProduct) //NOTE: verifyAdmin


module.exports = router

