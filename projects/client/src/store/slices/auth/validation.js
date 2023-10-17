import * as Yup from "yup"
const {parse, isDate} = require("date-fns")
const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
const passwordRegExp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*\d)(?=.*[-\@$!%*#?&_])[A-Za-z\d-\@$!%*#?&_]{6,}$/
function parseDateString(value, originalValue) {
    const parsedDate = isDate(originalValue)
      ? originalValue
      : parse(originalValue, "yyyy-MM-dd", new Date());
    return parsedDate;
}


export const LoginValidationSchema = Yup.object({
    email : Yup.string()
        .email("Format email tidak sesuai")
        .required("Email dibutuhkan"),
    password : Yup.string().required("Password dibutuhkan")
})

export const RegisterValidationSchema = Yup.object({
    name : Yup.string().required("Nama dibutuhkan"),
    password : Yup.string().required("Password dibutuhkan")
        .min(6,"Password minimal 6 karakter")
        .matches(passwordRegExp,
            "Format : huruf kapital, huruf non-kapital, angka, dan karakter spesial"),
    confirmPassword : Yup.string().required("Konfirmasi password dibutuhkan")
        .min(6,"Password minimal 6 karakter").oneOf([Yup.ref('password'), null], 
        'Konfirmasi password tidak sesuai'), 
    email : Yup.string().email("Email tidak sesuai").required("Email dibutuhkan"),
    phone : Yup.string().matches(phoneRegExp, 'Nomor telepon tidak sesuai')
        .min(11, "Nomor telepon minimal 11 karakter")
        .max(13, "Nomor telepon maksimal 13 karakter")
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
    .min(6,"Password minimal 6 karakter")
    .matches(passwordRegExp,
        "Password tidak sesuai format"),
    confirmPassword : Yup.string().required("Konfirmasi password dibutuhkan")
    .oneOf([Yup.ref('password'), null], 
    'Konfirmasi password tidak sesuai') //min 6 characters
})