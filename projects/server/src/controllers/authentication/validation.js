const Yup = require("yup")
// const YupPassword = require("yup-password")
const {parse, isDate} = require("date-fns")
const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
// YupPassword(Yup);

const today = new Date();

function parseDateString(value, originalValue) {
    const parsedDate = isDate(originalValue)
      ? originalValue
      : parse(originalValue, "yyyy-MM-dd", new Date());
    return parsedDate;
}

const LoginValidationSchema = Yup.object({
    email : Yup.string()
        .email("Email is invalid")
        .required("Email is required"),
    password : Yup.string().required("Password is required")
})

const RegisterValidationSchema = Yup.object({
    name : Yup.string().required("Name is required"),
    password : Yup.string().required("Password is required")
        .min(6,"Password must at least 6 characters"), 
    email : Yup.string().email("Invalid email").required("Email is required"),
    phone : Yup.string().matches(phoneRegExp, 'Phone number is not valid')
        .min(11, "Phone number must at least 11 characters")
        .max(13, "Phone number must less than 14 characters")
})

const VerifyValidationSchema = Yup.object({
    gender : Yup.string().required("Gender is required"),
    birthdate : Yup.date().transform(parseDateString).required("Birthdate is required") ,
    address : Yup.string().required("Address is required"),
    province : Yup.string().required("Province is required"),
    city : Yup.string().required("City is required") ,
    district : Yup.string().required("District is required") ,
    postalCode : Yup.number().required("Postal Code is required")
})

const UpdatePasswordValidationSchema = Yup.object({
    oldPassword : Yup.string().required("Old password is required"),
    newPassword : Yup.string().required("New password is required")
})

const UpdateProfileValidationSchema = Yup.object({
    name : Yup.string().required("Name is required"),
    phone : Yup.string().matches(phoneRegExp, 'Phone number is not valid')
        .min(11, "Phone number must at least 11 characters")
        .max(13, "Phone number must less than 14 characters"),
    gender : Yup.string().required("Gender is required"),
    birthdate : Yup.date().transform(parseDateString).required("Birthdate is required") ,   
})

const UpdateEmailValidationSchema = Yup.object({
    email : Yup.string()
        .email("Email is invalid")
        .required("Email is required"),
})

const ForgotPassValidationSchema = Yup.string({
    email : Yup.string().email("Invalid email").required("Email is required")
})

const PasswordValidationSchema = Yup.string({
    password : Yup.string().required("Password is required")
    .min(6,"password must at least 6 characters") //min 6 characters
})

module.exports = {
    LoginValidationSchema,
    RegisterValidationSchema,
    VerifyValidationSchema,
    UpdatePasswordValidationSchema,
    UpdateProfileValidationSchema,
    UpdateEmailValidationSchema,
    ForgotPassValidationSchema,
    PasswordValidationSchema
}