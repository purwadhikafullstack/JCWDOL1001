import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/auth"
import productsReducer from "./slices/product"
import catReducer from "./slices/cat"
import addressReducer from "./slices/address"
import unitReducer from "./slices/product/unit"
import uploadRecipeReducer from "./slices/upload-recipe"
import discounteReducer from "./slices/discount"
import cartReducer from "./slices/cart"
import transactionReducer from "./slices/transaction"
import customReducer from "./slices/custom"
import reportReducer from "./slices/report"
import forumReducer from "./slices/forum"

const store = configureStore({
    reducer : {
        auth : authReducer,
        products: productsReducer,
        units: unitReducer,
        cat : catReducer,
        address : addressReducer,
        uploadRecipe : uploadRecipeReducer,
        discount : discounteReducer,
        cart : cartReducer,
        transaction: transactionReducer,
        custom: customReducer,
        report: reportReducer,
        forum: forumReducer,
    },
})

export default store