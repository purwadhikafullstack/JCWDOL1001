import * as Yup from "yup";

export const UploadRecipeValidationSchema = Yup.object({
  addressId: Yup.string()
    .required("Alamat dibutuhkan"),
  courierName: Yup.string()
    .required("Jasa pengiriman dibutuhkan"),
  file: Yup.string()
    .required("Gambar resep dibutuhkan")
})