const express = require("express")
const {verifyUser, verifyAdmin} = require("../../middleware/token.verify.js")
const { helperUploader } = require("../../helper/index.js");
const { uploadRecipe } = require("./index.js");

const router = express.Router()
// @setup multer
const storage = helperUploader.createCloudinaryStorage("Public/Upload-recipe")
const uploader = helperUploader.createUploader(storage)

router.post("/", verifyUser, uploader.single("file"), uploadRecipe)


module.exports = router

