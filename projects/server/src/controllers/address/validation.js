const Yup = require("yup")

const InputAddressValidationSchema = Yup.object({
    address : Yup.string().required("Address is required"),
    province : Yup.string().required("Province is required"),
    city : Yup.string().required("City is required") ,
    district : Yup.string().required("District is required") ,
    postalCode : Yup.number().required("Postal Code is required")
})

module.exports = {
    InputAddressValidationSchema
}