const Yup = require('yup');

const inputProductValidationSchema = Yup.object({
  productName: Yup.string()
    .required("Nama produk harus diisi"),
  productPrice: Yup.string()
    .required("Harga produk harus diisi")
    .matches(/^[0-9]+$/, "Harga hanya boleh diisi dengan angka"),
  productDosage: Yup.string()
    .required("Dosis harus diisi"),
  productDescription: Yup.string()
    .required("Deskripsi harus diisi")
    .matches(/[a-zA-Z]/, "Deskripsi harus mengandung setidaknya satu huruf")
    .min(20, "Deskripsi minimal 20 karakter"),
  categoryId: Yup.array()
    .min(1, "Pilih setidaknya satu kategori")
    .required("Kategori harus diisi"),
  // productPicture: Yup.mixed().required('Pilih gambar'),
  productPicture: Yup.mixed()
    .test('fileSize', 'File is too large', (value) => {
      if (!value) return false;
      return value.size <= imageMaxSize;
    })
    .required('Pilih gambar'),

  
});

const updateProductValidationSchema = Yup.object({
  productName: Yup.string()
    .required("Nama produk harus diisi"),
  productPrice: Yup.string()
    .required("Harga produk harus diisi")
    .matches(/^[0-9]+$/, "Harga hanya boleh diisi dengan angka"),
  productDosage: Yup.string()
    .required("Dosis harus diisi"),
  productDescription: Yup.string()
    .required("Deskripsi harus diisi")
    .matches(/[a-zA-Z]/, "Deskripsi harus mengandung setidaknya satu huruf")
    .min(20, "Deskripsi minimal 20 karakter"),
  categoryId: Yup.array()
    .min(1, "Pilih setidaknya satu kategori")
    .required("Kategori harus diisi"),
  // productPicture: Yup.mixed()
  //   .nullable(),
  productPicture: Yup.mixed()
  .test('fileSize', 'File is too large', (value) => {
    if (!value) return true;
    return value.size <= imageMaxSize;
  })
  .nullable(),
});

const updateMainStockValidationSchema = Yup.object({
  productId: Yup.string()
    .required("productId is required")
    .matches(/^[0-9]+$/, "productId must contain only numbers"),
  value: Yup.string()
    .required("value is required")
    .matches(/-*[0-9]+$/, "value must contain only numbers"),
});

module.exports = {
  inputProductValidationSchema,
  updateProductValidationSchema,
  updateMainStockValidationSchema
}
