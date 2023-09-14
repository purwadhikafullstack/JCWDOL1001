const express = require("express")
const AddressControllers = require("./index.js")
const {verifyUser, verifyAdmin} = require("../../middleware/token.verify.js")

const router = express.Router()


router.get("/", AddressControllers.getListProvince)
router.get("/city", AddressControllers.getListCity)
router.get("/user-address", verifyUser, AddressControllers.getAddress)
router.patch("/delete/:addressId", verifyUser, AddressControllers.deleteAddress)


module.exports = router
