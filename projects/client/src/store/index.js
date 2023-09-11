import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/auth"
import productsReducer from "./slices/product"
import catReducer from "./slices/cat"
import addressReducer from "./slices/address"
import unitReducer from "./slices/product/unit"

const store = configureStore({
    reducer : {
        auth : authReducer,
        products: productsReducer,
        units: unitReducer,
        cat : catReducer,
        address : addressReducer
    },
})

export default store