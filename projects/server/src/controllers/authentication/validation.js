const Yup = require("yup")
// const YupPassword = require("yup-password")
const {parse, isDate} = require("date-fns")
const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
// YupPassword(Yup);
const passwordRegExp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*\d)(?=.*[-\@$!%*#?&_])[A-Za-z\d-\@$!%*#?&_]{6,}$/
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
    name : Yup.string().required("Nama dibutuhkan"),
    password : Yup.string().required("Password dibutuhkan")
        .min(6,"Password minimal 6 karakter")
        .matches(passwordRegExp,
            "Format password : huruf kapital, huruf non-kapital, angka, dan karakter spesial"),
    email : Yup.string().email("Email tidak valid").required("Email dibutuhkan"),
    phone : Yup.string().matches(phoneRegExp, 'Nomor telepon tidak valid')
        .min(11, "Nomor telepon minimal 11 karakter")
        .max(13, "Nomor telepon maksimal 13 karakter")
})

const VerifyValidationSchema = Yup.object({
    gender : Yup.string().required("Jenis kelamin dibutuhkan"),
    birthdate : Yup.date().test('birthdate', 'Pengguna minimal berumur 12 tahun', function (value, ctx) {
        const dob = new Date(value);
        const validDate = new Date();
        const valid = validDate.getFullYear() - dob.getFullYear() >= 12;
        return !valid ? ctx.createError() : valid; 
      }).transform(parseDateString).required("Tanggal lahir dibutuhkan") ,
})

const UpdatePasswordValidationSchema = Yup.object({
    oldPassword : Yup.string().required("Old password is required"),
    newPassword : Yup.string().required("New password is required")
})

const UpdateProfileValidationSchema = Yup.object({
    name : Yup.string().required("Nama harus ada."),
    phone : Yup.string().matches(phoneRegExp, 'No Handphone/Telepon tidak valid.')
        .min(11, "No Handphone/Telepon minimal 11 angka")
        .max(13, "No Handphone/Telepon maximal 13 angka"),
    gender : Yup.string().required("Jenis kelamin harus ada."),
    birthdate : Yup.date().transform(parseDateString).required("Tanggal Lahir harus ada.") ,   
})

const UpdateEmailValidationSchema = Yup.object({
    email : Yup.string()
        .email("Email tidak valid.")
        .required("Email dibutuhkan"),
})

const ForgotPassValidationSchema = Yup.string({
    email : Yup.string().email("Email tidak valid").required("Email dibutuhkan")
})

const PasswordValidationSchema = Yup.string({
    password : Yup.string().required("Password dibutuhkan")
    .min(6,"password minimal 6 karakter") //min 6 characters
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