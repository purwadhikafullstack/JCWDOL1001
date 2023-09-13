import * as Yup from "yup";

export const inputProductValidationSchema = Yup.object({
  productName: Yup.string()
    .required("Product name is required"),
  productPrice: Yup.string()
    .min(1, "Price must be greater than 0")
    .required("Price is required"),
  productDosage: Yup.string()
    .required("Dosage is required"),
  productDescription: Yup.string()
    .required("Description is required")
    .matches(/[a-zA-Z]/, "Description must contain at least one letter")
    .min(20, "Description must be at least 20 letters long"),
  categoryId: Yup.array()
    .min(1, "At least one category must be selected")
    .required("Category is required"),
  productPicture: Yup.mixed()
    .required("Image is required")
});

export const updateProductValidationSchema = Yup.object({
  productName: Yup.string()
    .required("Product name is required"),
  productPrice: Yup.string()
    .min(1, "Price must be greater than 0")
    .required("Price is required"),
  productDosage: Yup.string()
    .required("Dosage is required"),
  productDescription: Yup.string()
    .required("Description is required")
    .matches(/[a-zA-Z]/, "Description must contain at least one letter")
    .min(20, "Description must be at least 20 letters long"),
  categoryId: Yup.array()
    .min(1, "At least one category must be selected")
    .required("Category is required"),
  productPicture: Yup.mixed()
    .nullable()
});

export const updateMainStockValidationSchema = Yup.object({
  productId: Yup.string()
    .required("productId is required")
    .matches(/^[0-9]+$/, "productId must contain only numbers"),
  value: Yup.string()
    .required("Value is required")
    .matches(/-*[0-9]+$/, "Changes must contain only numbers")
});
