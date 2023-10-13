import * as Yup from "yup"
const {parse, isDate} = require("date-fns")
const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

function parseDateString(value, originalValue) {
    const parsedDate = isDate(originalValue)
      ? originalValue
      : parse(originalValue, "yyyy-MM-dd", new Date());
    return parsedDate;
}


export const LoginValidationSchema = Yup.object({
    email : Yup.string()
        .email("Invalid email")
        .required("Email is required"),
    password : Yup.string().required("Password is required")
})

export const RegisterValidationSchema = Yup.object({
    name : Yup.string().required("Name is required"),
    password : Yup.string().required("Password is required")
        .min(6,"Password must at least 6 characters"),
    confirmPassword : Yup.string().required("Password is required")
        .min(6,"Password must at least 6 characters").oneOf([Yup.ref('password'), null], 
        'Must match "password" field value'), 
    email : Yup.string().email("Invalid email").required("Email is required"),
    phone : Yup.string().matches(phoneRegExp, 'Phone number is not valid')
        .min(11, "Phone number must at least 11 characters")
        .max(13, "Phone number must less than 14 characters")
})

export const VerifyValidationSchema = Yup.object({
    gender : Yup.string().required("Gender is required"),
    birthdate : Yup.date().transform(parseDateString).required("Birthdate is required") ,
    // address : Yup.string().required("Address is required"),
    // province : Yup.string().required("Province is required"),
    // city : Yup.string().required("City is required") ,
    // district : Yup.string().required("District is required") ,
    // postalCode : Yup.number().required("Postal Code is required"),
})

export const changePasswordValidationSchema = Yup.object({
    oldPassword : Yup.string().required("Password Lama harus diisi!")
        .min(6,"Password harus minimal 6 karakter"),
    newPassword : Yup.string().required("Password Baru harus diisi!")
        .min(6,"Password harus minimal 6 karakter"),
    rePassword : Yup.string().required("Konfirmasi ini harus diisi!")
        .min(6,"Password harus minimal 6 karakter").oneOf([Yup.ref('newPassword'), null], 
        'Harus sama dengan password baru anda!'), 
})

export const changeEmailValidationSchema = Yup.object({
    email : Yup.string().email("Invalid email").required("Email is required"),
})

export const changeProfileValidationSchema = Yup.object({
    name : Yup.string().required("Name is required"),
    gender : Yup.string().required("Gender is required"),
    birthdate : Yup.date().transform(parseDateString).required("Birthdate is required") ,
    phone : Yup.string().matches(phoneRegExp, 'Phone number is not valid')
        .min(11, "Phone number must at least 11 characters")
        .max(13, "Phone number must less than 14 characters")
})

export const ForgotPassValidationSchema = Yup.object({
    email : Yup.string().email("Email tidak valid").required("Email dibutuhkan")
})

export const PasswordValidationSchema = Yup.object({
    password : Yup.string().required("Password dibutuhkan")
    .min(6,"Password minimal 6 karakter"), //min 6 characters,
    confirmPassword : Yup.string().oneOf([Yup.ref('password'), null], 
    'Password harus sama') //min 6 characters
})