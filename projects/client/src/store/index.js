import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/auth"
import addressReducer from "./slices/address"
const store = configureStore({
    reducer : {
        auth : authReducer,
        address : addressReducer
    },
})

export default store