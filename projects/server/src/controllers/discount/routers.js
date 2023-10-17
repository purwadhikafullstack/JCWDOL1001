const express = require("express")
const discount = require("./index.js")
const { verifyAdmin} = require("../../middleware/token.verify.js")

const router = express.Router()

router.get("/", discount.getDiscount)
router.post("/create", verifyAdmin, discount.createDiscount)
router.post("/check", discount.checkDiscount)
router.patch("/update/:discountId", verifyAdmin, discount.updateDiscount)
router.patch("/delete/:discountId", verifyAdmin, discount.deleteDiscount)


module.exports = router
