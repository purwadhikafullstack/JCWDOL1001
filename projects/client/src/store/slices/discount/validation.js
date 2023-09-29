import * as Yup from "yup";

export const DiscountInfoValidationSchema = Yup.object({
    discountDesc : Yup.string()
        .required("Description is required"),
    discountName : Yup.string()
        .required("Discount name is required"),
    discountCode : Yup.string()
        .when(["discountAmount","minimalTransaction"], ([discountAmount,minimalTransaction], schema) => {
            if(minimalTransaction && discountAmount) 
                return schema.required("Voucher Code is required")
            return schema
        }),
    discountAmount : Yup.number("Amount must be a number")
        .when(["discountName","minimalTransaction","oneGetOne"], ([discountName,minimalTransaction,oneGetOne,discountAmount], schema) => {
            if(!discountName || !discountAmount) return schema.required("Discount Amount is requiredd")
            return schema
        }),
    discountExpired : Yup.date().nullable(),
    isPercentage : Yup.number("Percentage status must be a number")
        .required("Percentage status is required"),
    oneGetOne : Yup.number("One Get One Status must be a number")
        .required("One Get One Status is required"),
    minimalTransaction : Yup.number("Minimum transaction must be a number").nullable(),
})