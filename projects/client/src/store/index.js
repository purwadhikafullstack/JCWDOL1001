import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/auth"
import productsReducer from "./slices/product"

const store = configureStore({
    reducer : {
        auth : authReducer,
        products: productsReducer,
    },
})

export default store