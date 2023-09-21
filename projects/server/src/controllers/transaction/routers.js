const express = require("express")
const transaction = require("./index.js")
const {verifyUser, verifyAdmin} = require("../../middleware/token.verify.js")

const router = express.Router()

router.get("/cart/:userId",verifyUser, transaction.getCheckoutProducts)
router.post("/checkout", verifyUser, transaction.createTransactions)
router.get("/:statusId", verifyUser, transaction.getTransactions)

module.exports = router