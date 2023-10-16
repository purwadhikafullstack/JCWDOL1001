const express = require("express")
const AddressControllers = require("./index.js")
const {verifyUser} = require("../../middleware/token.verify.js")

const router = express.Router()


router.get("/", verifyUser, AddressControllers.getAddress)
router.post("/", verifyUser, AddressControllers.addAddress)
router.patch("/update-primary/:addressId", verifyUser, AddressControllers.updatePrimaryAddress)
router.patch("/delete/:addressId", verifyUser, AddressControllers.deleteAddress)
router.get("/province", verifyUser, AddressControllers.getListProvince)
router.get("/city", verifyUser, AddressControllers.getListCity)
router.post("/shipping-cost", verifyUser, AddressControllers.shippingCost)
router.patch("/:addressId", verifyUser, AddressControllers.updateAddress)


module.exports = router
