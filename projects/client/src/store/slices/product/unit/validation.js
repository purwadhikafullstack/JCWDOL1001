import * as Yup from "yup";

export const ProductUnitValidationSchema = Yup.object({
  unitId: Yup.number("Unit is required")
    .required("Unit is required"),
  quantity: Yup.number("Qty must contain only numbers"),
});

export const DeleteProductUnitValidationSchema = Yup.object({
  stockId: Yup.number("Unit ID is required")
    .required("Unit ID is required")
});

export const ReactivateProductUnitValidationSchema = Yup.object({
  productId: Yup.number("Product ID is required")
    .required("Product  is required"),
  stockId: Yup.number("Stock ID is required")
    .required("Stock is required"),
});

export const MakeConvertionProductUnitValidationSchema = Yup.object({
  productId: Yup.number("Product ID is required")
    .required("Product  is required"),
  times: Yup.number("How many times of convertion is required")
    .required("How many times of convertion is required"),
});
