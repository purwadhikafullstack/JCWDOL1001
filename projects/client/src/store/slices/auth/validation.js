import * as Yup from "yup"
import YupPassword from 'yup-password';
YupPassword(Yup);

export const LoginValidationSchema = Yup.object({
    email : Yup.string()
        .email("Invalid email")
        .required("Email is required"),
    password : Yup.string().required("Password is required")
})