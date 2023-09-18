import * as Yup from "yup";

export const InputAddressValidationSchema = Yup.object({
    address : Yup.string().required("Alamat harus diisi"),
    province : Yup.string().required("Provinsi harus diisi"),
    city : Yup.string().required("Kota harus diisi") ,
    district : Yup.string().required("Kecamatan harus diisi") ,
    postalCode : Yup.number().required("kode pos harus diisi")
})