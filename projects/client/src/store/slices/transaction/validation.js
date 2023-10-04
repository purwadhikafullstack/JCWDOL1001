import * as yup from "yup";

export const setDateValidationSchema = yup.object({
  startDate: yup.date().required("Tanggal awal harus diisi"),
  endDate: yup
    .date()
    .required("Tanggal akhir harus diisi")
    .min(yup.ref("startDate"), "Tanggal akhir tidak boleh kurang dari tanggal awal")
  });
