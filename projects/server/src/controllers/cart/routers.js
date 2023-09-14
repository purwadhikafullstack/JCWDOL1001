const express = require("express")
const CartControllers = require("./index.js")
const {verifyUser} = require("../../middleware/token.verify.js")

const router = express.Router()

router.get("/total", verifyUser, CartControllers.totalProductCart)
router.get("/", verifyUser, CartControllers.getCart)
// router.post("/", verifyUser, CartControllers.addToCart)
router.post("/", verifyUser, CartControllers.updateCart)
router.delete("/:productId", verifyUser, CartControllers.deleteProductCart)

module.exports = router
