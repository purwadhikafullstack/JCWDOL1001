const express = require("express")
const report = require("./index.js")
const {verifyAdmin} = require("../../middleware/token.verify.js")

const router = express.Router()
router.get("/:statusId", verifyAdmin, report.getReport)

module.exports = router
