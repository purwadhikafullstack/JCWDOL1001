import * as Yup from "yup";

export const inputProductValidationSchema = Yup.object({
  name: Yup.string()
    .matches(/^[a-zA-Z][a-zA-Z\s]*$/, "Product name must start with a letter")
    .matches(/^[a-zA-Z\s]+$/, "Product name must contain only letters")
    .required("Product name is required"),
  price: Yup.string()
    .required("Price is required")
    .matches(/^[0-9]+$/, "Price must contain only numbers"),
  description: Yup.string()
    .required("Description is required")
    .matches(/[a-zA-Z]/, "Description must contain at least one letter")
    .min(20, "Description must be at least 20 letters long"),
  categoryId: Yup.string().required("Category is required"),
  image: Yup.mixed()
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
  name: Yup.string()
    .matches(/^[a-zA-Z\s]+$/, "Product name must contain only letters")
    .required("Product name is required"),
  price: Yup.string()
    .required("Price is required")
    .matches(/^[0-9]+$/, "Price must contain only numbers"),
  description: Yup.string()
    .required("Description is required")
    .matches(/[a-zA-Z]/, "Description must contain at least one letter")
    .min(20, "Description must be at least 20 letters long"),
  categoryId: Yup.string().required("Category is required"),
  image: Yup.mixed()
    .nullable()
    .test("fileSize", "File size is too large", (value) => {
      if (!value) return true;
      const maxSize = 1 * 1024 * 1024;
      return value.size <= maxSize;
    }),
});
