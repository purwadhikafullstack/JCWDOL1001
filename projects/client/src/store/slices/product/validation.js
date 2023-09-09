import * as Yup from "yup";

export const inputProductValidationSchema = Yup.object({
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
  productPicture: Yup.mixed()
    .required("Image is required")
    .test("fileFormat", "Invalid file format", (value) => {
      if (!value) return false;
      return value && value.type.startsWith("image/");
    })
    .test("fileSize", "File size is too large", (value) => {
      if (!value) return false;
      const maxSize = 1 * 1024 * 1024;
      return value && value.size <= maxSize;
    }),
});

export const updateProductValidationSchema = Yup.object({
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
  productPicture: Yup.mixed()
    .nullable()
    .test("fileSize", "File size is too large", (value) => {
      if (!value) return true;
      const maxSize = 1 * 1024 * 1024;
      return value.size <= maxSize;
    }),
});

export const updateMainStockValidationSchema = Yup.object({
  productId: Yup.string()
    .required("productId is required")
    .matches(/^[0-9]+$/, "productId must contain only numbers"),
  value: Yup.string()
    .required("Value is required")
    .matches(/-*[0-9]+$/, "Changes must contain only numbers")
});
