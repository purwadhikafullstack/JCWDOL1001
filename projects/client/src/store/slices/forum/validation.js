import * as Yup from "yup";

export const PostQuestionValidationSchema = Yup.object({
  question: Yup.string()
    .required("Question is required"),
})