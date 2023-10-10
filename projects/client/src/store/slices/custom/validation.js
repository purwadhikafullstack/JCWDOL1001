import * as Yup from "yup";

export const ingredientValidationSchema = Yup.object({
    ingredientId : Yup.number().required("Produk harus dipilih").min(1,"Produk harus dipilih"),
    ingredientQuantity : Yup.string()
    .required("Jumlah produk dibutuhkan")
    .matches(/^[0-9]+$/, "Jumlah produk dibutuhkan"),
})

export const customValidationSchema = Yup.object({
    ingredientList: Yup.array()
    .min(1, "Perlu minimal 1 bahan untuk obat racik")
    .required("Bahan obat racik dibutuhkan"),
    productName: Yup.string().required("Nama produk dibutuhkan"),
    productDosage: Yup.string().required("Dosis dibutuhkan"),
    productQuantity : Yup.string()
    .required("Jumlah produk dibutuhkan")
    .matches(/^[0-9]+$/, "Jumlah produk dibutuhkan"),
    productPrice : Yup.string().required("Harga produk dibutuhkan")
    .matches(/^[0-9]+$/, "Harga produk dibutuhkan"),
})

export const normalValidationSchema = Yup.object({
    normalProductId : Yup.number().required("Produk harus dipilih").min(1,"Produk harus dipilih"),
    normalProductName : Yup.string().required("Nama produk dibutuhkan"),
    normalProductPrice : Yup.string().required("Harga produk dibutuhkan")
    .matches(/^[0-9]+$/, "Harga produk dibutuhkan"),
    normalProductQuantity : Yup.string()
    .required("Jumlah produk dibutuhkan")
    .matches(/^[0-9]+$/, "Jumlah produk dibutuhkan"),
})