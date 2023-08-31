const express = require("express")
const AuthControllers = require("./index.js")
const {verifyUser, verifyAdmin} = require("../../middleware/token.verify.js")

const router = express.Router()

router.post("/login", AuthControllers.login)
router.get("/keep-login", verifyUser, AuthControllers.keepLogin)
router.post("/register", AuthControllers.register)
router.post("/verify", verifyUser, AuthControllers.verify)
router.post("/resendOtp", verifyUser, AuthControllers.resendOtp)

module.exports = router
