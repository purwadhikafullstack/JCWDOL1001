import * as Yup from "yup";

export const UploadRecipeValidationSchema = Yup.object({
  addressId: Yup.string()
    .required("address is required"),
  courierName: Yup.string()
    .required("courier is required"),
  file: Yup.string()
    .required("Image is required")
})