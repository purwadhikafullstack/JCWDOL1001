const Yup = require("yup")

const DiscountInfoValidationSchema = Yup.object({
    discountDesc : Yup.string()
        .required("Deskripsi diskon dibutuhkan"),
    discountName : Yup.string()
        .required("Nama diskon dibutuhkan"),
    discountCode : Yup.string().nullable(),
    discountAmount : Yup.string("Potongan harus berupa angka"),
    discountExpired : Yup.date().nullable(),
    isPercentage : Yup.number("Persentase harus berupa angka")
        .required("Persentase dibutuhkan"),
    oneGetOne : Yup.number("Beli satu gratis satu harus berupa angka")
        .required("Beli satu gratis satu dibutuhkan"),
    minimalTransaction : Yup.string("Minimal transaksi harus berupa angka").nullable(),
    
})

module.exports = {
    DiscountInfoValidationSchema
}