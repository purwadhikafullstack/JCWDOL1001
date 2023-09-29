import * as Yup from "yup";

export const AddressAndShippingValidationSchema = Yup.object({
  addressId: Yup.string()
    .required("address is required"),
  courierName: Yup.string()
    .required("courier is required")
})