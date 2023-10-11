const Yup = require('yup');

const productUnitValidationSchema = Yup.object({
  unitId: Yup.number("Unit is required")
    .required("Unit is required"),
  quantity: Yup.number("Qty must contain only numbers"),
});

const deleteProductUnitValidationSchema = Yup.object({
  stockId: Yup.number("Unit ID is required")
    .required("Unit ID is required")
});

const reactivateProductUnitValidationSchema = Yup.object({
  productId: Yup.number("Product ID is required")
    .required("Product  is required"),
  stockId: Yup.number("Stock ID is required")
    .required("Unit is required"),
});

const makeConvertionProductUnitValidationSchema = Yup.object({
  productId: Yup.number("Product ID is required")
    .required("Product  is required"),
  times: Yup.number("How many times of convertion is required")
    .required("How many times of convertion is required"),
});

module.exports = {
  productUnitValidationSchema,  
  deleteProductUnitValidationSchema,
  reactivateProductUnitValidationSchema,
  makeConvertionProductUnitValidationSchema
}
