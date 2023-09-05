const Yup = require('yup');

const inputProductValidationSchema = Yup.object({
  name: Yup.string()
    .matches(/^[a-zA-Z\s]+$/, 'Product name must contain only letters')
    .matches(/^[a-zA-Z][a-zA-Z\s]*$/, 'Product name must start with a letter')
    .required('Product name is required'),
  price: Yup.string()
    .required('Price is required')
    .matches(/^[0-9]+$/, 'Price must contain only numbers'),
  description: Yup.string()
    .required('Description is required')
    .matches(/[a-zA-Z]/, 'Description must contain at least one letter')
    .min(20, 'Description must be at least 20 letters long'),
  categoryId: Yup.string().required('Category is required'),
  image: Yup.string().required('Image is required'),
});

const updateProductValidationSchema = Yup.object({
  name: Yup.string()
    .matches(/^[a-zA-Z\s]+$/, 'Product name must contain only letters')
    .required('Product name is required'),
  price: Yup.string()
    .required('Price is required')
    .matches(/^[0-9]+$/, 'Price must contain only numbers'),
  description: Yup.string()
    .required('Description is required')
    .matches(/[a-zA-Z]/, 'Description must contain at least one letter')
    .min(20, 'Description must be at least 20 letters long'),
  categoryId: Yup.string().required('Category is required'),
});

module.exports = {
  inputProductValidationSchema,
  updateProductValidationSchema
}
