const express = require("express")
const transaction = require("./index.js")
const {verifyUser, verifyAdmin} = require("../../middleware/token.verify.js")

const router = express.Router()

router.get("/:userId",verifyUser,transaction.getTransactions)
router.post("/checkout/:userId",verifyUser,transaction.createTransactions)
router.get("/cart/:userId",verifyUser, transaction.getCheckoutProducts)


module.exports = router