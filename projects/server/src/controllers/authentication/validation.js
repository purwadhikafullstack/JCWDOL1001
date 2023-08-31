const Yup = require("yup")
const YupPassword = require("yup-password")
YupPassword(Yup);

const LoginValidationSchema = Yup.object({
    email : Yup.string()
        .email("Email is invalid")
        .required("Email is required"),
    password : Yup.string().required("Password is required")
})

module.exports = {
    LoginValidationSchema
}