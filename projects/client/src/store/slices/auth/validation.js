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
    otp: Yup.string().required("OTP dibutuhkan").min(6,"OTP harus 6 karakter")
    .max(6,"OTP harus 6 karakter"),
    gender : Yup.string().required("Jenis kelamin dibutuhkan"),
    birthdate : Yup.date().test('birthdate', 'Pengguna minimal berumur 12 tahun', function (value, ctx) {
        const dob = new Date(value);
        const validDate = new Date();
        const valid = validDate.getFullYear() - dob.getFullYear() >= 12;
        return !valid ? ctx.createError() : valid; 
      }).transform(parseDateString).required("Birthdate is required") ,
})

export const changePasswordValidationSchema = Yup.object({
    oldPassword : Yup.string().required("Old Password is required")
        .min(6,"Password must at least 6 characters"),
    newPassword : Yup.string().required("New Password is required")
        .min(6,"Password must at least 6 characters"),
    rePassword : Yup.string().required("Password is required")
        .min(6,"Password must at least 6 characters").oneOf([Yup.ref('newPassword'), null], 
        'Must match "New password" field value'), 
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