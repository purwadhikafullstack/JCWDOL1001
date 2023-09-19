const Yup = require("yup")

const InputAddressValidationSchema = Yup.object({
    address : Yup.string().required("Alamat harus diisi"),
    province : Yup.string().required("Provinsi harus diisi"),
    city : Yup.string().required("Kota harus diisi"),
    district : Yup.string().required("Kecamatan harus diisi"),
    postalCode : Yup.string().required("Kode pos harus diisi"),
    contactPhone : Yup.string().required("Nomor telpon kontak harus diisi"),
    contactName : Yup.string().required("Nama kontak harus diisi"),
})

module.exports = {
    InputAddressValidationSchema
}