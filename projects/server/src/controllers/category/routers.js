const express = require("express")
const CatControllers = require("./index.js")
const {verifyUser, verifyAdmin} = require("../../middleware/token.verify.js")
const { helperUploader } = require("../../helper/index.js");
const router = express.Router()
// @setup multer
const storage = helperUploader.createCloudinaryStorage("Public/Categories")
const uploader = helperUploader.createUploader(storage)

//@add category(EXAMPLE)
router.post("/", verifyAdmin, uploader.single("file"), CatControllers.addCategory)
router.get("/", CatControllers.getCategory)
router.patch("/",verifyAdmin, CatControllers.updateCategory)
router.patch("/categorypicture/:categoryId",verifyAdmin,uploader.single("file"), CatControllers.updateCategoryPicture)
router.patch("/deletecategory",verifyAdmin,CatControllers.deleteCategory)

module.exports = router

