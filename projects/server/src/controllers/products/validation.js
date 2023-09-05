const Yup = require('yup');

const inputProductValidationSchema = Yup.object({
  productName: Yup.string()
    .required("Product name is required"),
  productPrice: Yup.string()
    .required("Price is required")
    .matches(/^[0-9]+$/, "Price must contain only numbers"),
  productDosage: Yup.string()
    .required("Dosage is required"),
  productDescription: Yup.string()
    .required("Description is required")
    .matches(/[a-zA-Z]/, "Description must contain at least one letter")
    .min(20, "Description must be at least 20 letters long"),
  categoryId: Yup.array()
    .min(1, "At least one category must be selected")
    .required("Category is required"),
  productPicture: Yup.string().required('Image is required'),
});

const updateProductValidationSchema = Yup.object({
  productName: Yup.string()
    .required("Product name is required"),
  productPrice: Yup.string()
    .required("Price is required")
    .matches(/^[0-9]+$/, "Price must contain only numbers"),
  productDosage: Yup.string()
    .required("Dosage is required"),
  productDescription: Yup.string()
    .required("Description is required")
    .matches(/[a-zA-Z]/, "Description must contain at least one letter")
    .min(20, "Description must be at least 20 letters long"),
  categoryId: Yup.array()
    .min(1, "At least one category must be selected")
    .required("Category is required"),
});

module.exports = {
  inputProductValidationSchema,
  updateProductValidationSchema
}
