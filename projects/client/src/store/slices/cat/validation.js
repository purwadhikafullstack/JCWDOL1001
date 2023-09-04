import * as Yup from "yup"

export const CategoryValidationSchema = Yup.object({
    categoryDesc : Yup.string().required("Description is required!")
})