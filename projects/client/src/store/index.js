import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/auth"
import productsReducer from "./slices/product"
import catReducer from "./slices/cat"
import addressReducer from "./slices/address"

const store = configureStore({
    reducer : {
        auth : authReducer,
        products: productsReducer,
        cat : catReducer,
        address : addressReducer
    },
})

export default store