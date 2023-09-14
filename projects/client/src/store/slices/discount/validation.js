import * as Yup from "yup";

export const DiscountInfoValidationSchema = Yup.object({
    discountDesc : Yup.string()
        .required("Description is required"),
    discountName : Yup.string()
        .required("Name is required"),
    discountAmount : Yup.number("Amount must be a number").nullable(),
    discountCode : Yup.string().nullable(),
    discountAmount : Yup.number("Amount must be a number").nullable(),
    discountExpired : Yup.date().nullable(),
    isPercentage : Yup.number("Percentage status must be a number")
        .required("Percentage status is required"),
    oneGetOne : Yup.number("One Get One Status must be a number")
        .required("One Get One Status is required"),
    minimalTransaction : Yup.number("Minimum transaction must be a number").nullable(),
    
})