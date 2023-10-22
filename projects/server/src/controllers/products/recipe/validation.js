const Yup = require('yup');

const ingredientValidationSchema = Yup.object({
    ingredientId : Yup.number().required("Produk harus dipilih").min(1,"Produk harus dipilih"),
    ingredientQuantity : Yup.string()
    .required("Jumlah produk dibutuhkan")
    .matches(/^[0-9]+$/, "Jumlah produk dibutuhkan"),
})

const customValidationSchema = Yup.object({
    productName: Yup.string().required("Nama produk dibutuhkan"),
    productDosage: Yup.string().required("Dosis dibutuhkan"),
    productQuantity : Yup.string()
    .required("Jumlah produk dibutuhkan")
    .matches(/^[0-9]+$/, "Jumlah produk dibutuhkan"),
    productPrice : Yup.string().required("Harga produk dibutuhkan")
    .matches(/^[0-9]+$/, "Harga produk dibutuhkan"),
})

const normalValidationSchema = Yup.object({
    productId : Yup.number().required("Produk harus dipilih").min(1,"Produk harus dipilih"),
    productQuantity : Yup.string()
    .required("Jumlah produk dibutuhkan")
    .matches(/^[0-9]+$/, "Jumlah produk dibutuhkan"),
})

module.exports = {
    ingredientValidationSchema,
    customValidationSchema,
    normalValidationSchema
  }