const express = require("express")
const AuthControllers = require("./index.js")
const {verifyUser, verifyAdmin} = require("../../middleware/token.verify.js")
const { helperUploader } = require("../../helper/index.js");
const storage = helperUploader.createCloudinaryStorage("Public/Profiles")
const uploader = helperUploader.createUploader(storage)

const router = express.Router()

router.post("/login",  AuthControllers.login)
router.get("/keep-login", verifyUser, AuthControllers.keepLogin)
router.post("/register", AuthControllers.register)
router.post("/verify", verifyUser, AuthControllers.verify)
router.post("/resendOtp", AuthControllers.resendOtp)
router.get("/profile",verifyUser, AuthControllers.getProfile)
router.patch("/change-password/:userId",verifyUser,AuthControllers.changePassword)
router.patch("/change-email/:userId",verifyUser,AuthControllers.changeEmail)
router.patch("/change-profile/:userId",verifyUser,AuthControllers.changeProfileData)
router.patch("/change-picture/:userId",verifyUser, uploader.single("file"), AuthControllers.changeProfilePicture)
router.post("/changeOtp/:userId",verifyUser,AuthControllers.changeEmailOtp)
router.post("/forgot",AuthControllers.forgotPass)
router.post("/reset",verifyUser,AuthControllers.reset)

module.exports = router
