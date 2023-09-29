const express = require("express")
const report = require("./index.js")
const {verifyUser, verifyAdmin} = require("../../middleware/token.verify.js")

const router = express.Router()
router.get("/:statusId", report.getReport)

module.exports = router
