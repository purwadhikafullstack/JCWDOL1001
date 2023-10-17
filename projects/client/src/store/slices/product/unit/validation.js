import * as Yup from "yup";

export const ProductUnitValidationSchema = Yup.object({
  unitId: Yup.number("Satuan dibutuhkan")
    .required("Satuan dibutuhkan"),
  quantity: Yup.number("Kuantitas harus berupa angka"),
});

export const DeleteProductUnitValidationSchema = Yup.object({
  stockId: Yup.number("Satuan dibutuhkan")
    .required("Satuan dibutuhkan")
});

export const ReactivateProductUnitValidationSchema = Yup.object({
  productId: Yup.number("ID Produk dibutuhkan")
    .required("ID Produk dibutuhkan"),
  stockId: Yup.number("Unit dibutuhkan")
    .required("Unit dibutuhkan"),
});

export const MakeConvertionProductUnitValidationSchema = Yup.object({
  productId: Yup.number("ID Produk dibutuhkan")
    .required("ID Produk dibutuhkan"),
  times: Yup.number("Konversi dibutuhkan")
    .required("Konversi dibutuhkan"),
});
