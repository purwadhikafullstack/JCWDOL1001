const express = require("express")
const AuthControllers = require("./index.js")
const {verifyUser, verifyAdmin} = require("../../middleware/token.verify.js")

const router = express.Router()

router.post("/login", AuthControllers.login)
router.get("/keep-login", verifyUser, AuthControllers.keepLogin)

module.exports = router
