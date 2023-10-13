import * as Yup from "yup";

export const filterDateReportValidationSchema = Yup.object({
  startFrom: Yup.date(),
  endFrom: Yup
    .date()
    .min(Yup.ref("startDate"), "Tanggal akhir tidak boleh kurang dari tanggal awal")
  });
