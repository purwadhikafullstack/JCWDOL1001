const express = require("express")
const discount = require("./index.js")
const {verifyUser, verifyAdmin} = require("../../middleware/token.verify.js")

const router = express.Router()

router.get("/", discount.getDiscount)
router.post("/create", discount.createDiscount)
router.post("/check", discount.checkDiscount)
router.patch("/update/:discountId", discount.updateDiscount)
router.patch("/delete/:discountId", discount.deleteDiscount)


module.exports = router
