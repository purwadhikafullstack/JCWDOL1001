const express = require("express")
const transaction = require("./index.js")
const {verifyUser, verifyAdmin} = require("../../middleware/token.verify.js")

const router = express.Router()

router.get("/:userId",transaction.getTransactions)
router.post("/checkout/:userId",transaction.createTransactions)

module.exports = router