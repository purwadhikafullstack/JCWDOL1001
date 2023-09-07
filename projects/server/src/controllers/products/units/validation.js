const Yup = require('yup');

const productUnitValidationSchema = Yup.object({
  unitId: Yup.number("Unit is required")
    .required("Unit is required"),
  quantity: Yup.number("Qty must contain only numbers")
    .required("Qty is required"),
});

const deleteProductUnitValidationSchema = Yup.object({
  stockId: Yup.number("Unit ID is required")
    .required("Unit ID is required")
});

module.exports = {
  productUnitValidationSchema,  
  deleteProductUnitValidationSchema
}
