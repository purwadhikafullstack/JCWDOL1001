import * as Yup from "yup";

export const setDateValidationSchema = Yup.object({
  startDate: Yup.date().required("Tanggal awal harus diisi"),
  endDate: Yup
    .date()
    .required("Tanggal akhir harus diisi")
    .min(Yup.ref("startDate"), "Tanggal akhir tidak boleh kurang dari tanggal awal")
  });
