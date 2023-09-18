const Yup = require("yup")

const UpdateCartValidationSchema = Yup.object({
    productId: Yup.string()
      .required("productId is required")
      .matches(/^[0-9]+$/, "productId must contain only numbers"),
    quantity: Yup.number()
    .min(1, 'The minimum amount is one')
    .typeError('The amount invalid')
    .required('The amount is required')
    .test(
      'no-leading-zero',
      'Leading zero is not allowed',
      (value, context) => {
        return context.originalValue && !context.originalValue.startsWith(0);})
  });

// const DeleteCartValidationSchema = Yup.object({
//     productId: Yup.string()
//       .required("productId is required")
//       .matches(/^[0-9]+$/, "productId must contain only numbers")
//   });

module.exports = {
    UpdateCartValidationSchema,
    // DeleteCartValidationSchema
}