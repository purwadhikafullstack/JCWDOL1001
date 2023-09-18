const express = require("express")
const AddressControllers = require("./index.js")
const {verifyUser, verifyAdmin} = require("../../middleware/token.verify.js")

const router = express.Router()


router.get("/", verifyUser, AddressControllers.getAddress)
router.post("/", verifyUser, AddressControllers.addAddress)
router.patch("/:addressId", verifyUser, AddressControllers.updateAddress)
router.get("/province", AddressControllers.getListProvince)
router.get("/city", AddressControllers.getListCity)
router.patch("/delete/:addressId", verifyUser, AddressControllers.deleteAddress)


module.exports = router
