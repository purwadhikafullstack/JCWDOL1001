import {createAsyncThunk} from "@reduxjs/toolkit"
import api from "../../utils/api.instance"
import { toast } from 'react-toastify';

export const getUser = createAsyncThunk(
    "custom/getUser",
    async(payload, {rejectWithValue}) => {
        try{
            //validation payload
            const { page, sortDate,search} = payload
            // console.log(page, sortDate, search)
            let PARAMETER = "?"

            if(page) PARAMETER += `page=${page ? page : 1 }`
            
            if(sortDate) PARAMETER += `&sortDate=${sortDate}&search`

            if(search) PARAMETER += `=${search}`
            // console.log(PARAMETER)
            const { data } = await api.get("products/recipe/user"+PARAMETER)
            // toast.success(data?.message)
            return data
        }catch(error){
            toast.error(error.response.data.message)
            return rejectWithValue(error.response.data)
        }
    }
)

export const checkIngredient = createAsyncThunk(
    "custom/checkIngredient",
    async(payload, {rejectWithValue}) => {
        try{
            //validation payload
            const { data } = await api.post("/products/recipe/check", payload)
            toast.success(data?.message)
            return data
        }catch(error){
            toast.error(error.response.data.message)
            return rejectWithValue(error.response.data)
        }
    }
)

export const setOrder = createAsyncThunk(
    "custom/setOrder",
    async(payload, {rejectWithValue}) => {
        try{
            const { data } = await api.post(`/products/recipe/order/${payload}`)
            toast.success(data?.message)
            return data
        }catch(error){
            toast.error(error.response.data?.message)
            return rejectWithValue(error.response.data)
        }
    }
)

// export const reverseStock = createAsyncThunk(
//     "custom/reverseStock",
//     async(payload, {rejectWithValue}) => {
//         try{
//             await DiscountInfoValidationSchema.validate(payload.output.data)
//             const { data } = await api.patch("/discount/update/" +encodeURI(payload.discountId), payload.output)

//             toast.success(data?.message)
//             return data
//         }catch(error){
//             toast.error(error.response.data?.message)
//             return rejectWithValue(error.response.data)
//         }
//     }
// )

