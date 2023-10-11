import * as Yup from "yup";

export const CustomValidationSchema = Yup.object({
    list: Yup.array().required("Bahan obat racik dibutuhkan"),
    name: Yup.string().required("Nama dibutuhkan"),
    dosage: Yup.string().required("Dosis dibutuhkan"),
    quantity : Yup.string().required("Jumlah produk dibutuhkan"),
    price : Yup.number().required("Province is required"),

})

export const NormalValidationSchema = Yup.object({
    name : Yup.string().required("Gender is required"),
    //quantity : Yup.date().transform(parseDateString).required("Birthdate is required") ,
})