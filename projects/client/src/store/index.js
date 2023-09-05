import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/auth"
import productsReducer from "./slices/product"
import catReducer from "./slices/cat"

const store = configureStore({
    reducer : {
        auth : authReducer,
        products: productsReducer,
        cat : catReducer
    },
})

export default store