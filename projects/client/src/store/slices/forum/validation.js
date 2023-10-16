import * as Yup from "yup";

export const PostQuestionValidationSchema = Yup.object({
  question: Yup.string()
    .required("Pertanyaan dibutuhkan"),
})

export const AnswerValidationSchema = Yup.object({
  answer: Yup.string()
    .required("Jawaban dibutuhkan"),
})