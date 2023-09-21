const express = require("express")
const transaction = require("./index.js")
const {verifyUser, verifyAdmin} = require("../../middleware/token.verify.js")
const { helperUploader } = require("../../helper/index.js");

const router = express.Router()

// @setup multer
const storage = helperUploader.createCloudinaryStorage("Public/Payment")
const uploader = helperUploader.createUploader(storage)

router.get("/cart/:userId", verifyUser, transaction.getCheckoutProducts)
router.get("/status", verifyUser, transaction.getTransactionStatus)
router.post("/checkout", verifyUser, transaction.createTransactions)
router.patch("/upload-payment-proof/:transactionId", verifyUser, uploader.single("file"), transaction.uploadPaymentProof)
router.get("/:statusId", verifyUser,  transaction.getTransactions)

module.exports = router