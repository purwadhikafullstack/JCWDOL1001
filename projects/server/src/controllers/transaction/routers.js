const express = require("express")
const transaction = require("./index.js")
const {verifyUser, verifyAdmin} = require("../../middleware/token.verify.js")
const { helperUploader } = require("../../helper/index.js");

const router = express.Router()


// @setup multer
const storage = helperUploader.createCloudinaryStorage("Public/Payment")
const uploader = helperUploader.createUploader(storage)

router.get("/cart",verifyUser, transaction.getCheckoutProducts)
router.get("/status", verifyUser, transaction.getTransactionStatus)
router.post("/checkout", verifyUser, transaction.createTransactions)
router.patch("/upload-payment-proof/:transactionId", verifyUser, uploader.single("file"), transaction.uploadPaymentProof)
router.patch("/confirm-payment/:transactionId", verifyAdmin, transaction.confirmPayment)
router.patch("/process-order/:transactionId", verifyAdmin, transaction.processOrder)
router.patch("/send-order/:transactionId", verifyAdmin, transaction.sendOrder)
router.patch("/receive-order/:transactionId", verifyUser, transaction.receiveOrder)
router.patch("/cancel-transaction/:transactionId", verifyUser, transaction.cancelTransaction)
router.patch("/reject-payment/:transactionId", verifyAdmin, transaction.rejectPayment)
router.get("/ongoing", verifyUser, transaction.getOngoingTransactions)
router.get("/:statusId", verifyUser,  transaction.getTransactions)

module.exports = router