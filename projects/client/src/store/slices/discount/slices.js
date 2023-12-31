import {createAsyncThunk} from "@reduxjs/toolkit"
import api from "../../utils/api.instance"
import { toast } from 'react-toastify';
import { DiscountInfoValidationSchema } from "./validation";

export const getDiscount = createAsyncThunk(
    "discount/allDiscount",
    async(payload, {rejectWithValue}) => {
        try{
            const { page, discountName, limit} = payload
            let parameter = "?"

            if(page){
                parameter +=`page=${page}&`
            }

            if(discountName){
                parameter +=`discountName=${discountName}&`
            }

            if(limit){
                parameter +=`limit=${limit}&`
            }

            const { data } = await api.get("/discount" + encodeURI(parameter))

            return data
        }catch(error){
            toast.error(error.response.data.message)
            return rejectWithValue(error.response.data)
        }
    }
)

export const deleteDiscount = createAsyncThunk(
    "discount/deleteDiscount",
    async(payload, {rejectWithValue}) => {
        try{
            const { data } = await api.patch("/discount/delete/" +encodeURI(payload))

            toast.success(data?.message)
            return data
        }catch(error){
            toast.error(error.response.data?.message)
            return rejectWithValue(error.response.data)
        }
    }
)

export const updateDiscount = createAsyncThunk(
    "discount/updateDiscount",
    async(payload, {rejectWithValue}) => {
        try{
            await DiscountInfoValidationSchema.validate(payload.output.data)
            const { data } = await api.patch("/discount/update/" +encodeURI(payload.discountId), payload.output)

            toast.success(data?.message)
            return data
        }catch(error){
            toast.error(error.response.data?.message)
            return rejectWithValue(error.response.data)
        }
    }
)

export const createDiscount = createAsyncThunk(
    "discount/createDiscount",
    async(payload, {rejectWithValue}) => {
        try{
            await DiscountInfoValidationSchema.validate(payload.data)
            const { data } = await api.post("/discount/create/", payload)

            toast.success(data?.message)
            return data
        }catch(error){
            toast.error(error.response.data?.message)
            return rejectWithValue(error.response.data)
        }
    }
)

export const    checkerDiscount = createAsyncThunk(
    "discount/checkerDiscount",
    async(payload, {rejectWithValue}) => {
        try{
            const {page, code, nominal } = payload
            
            let PARAMETER = "?"
            
            if(code){
                PARAMETER +=`code=${code}&`
            }
            if(nominal){
                PARAMETER +=`nominal=${nominal}&`
            }
            if(page){
                PARAMETER +=`page=${page}&`
            }

            const { data } = await api.post("/discount/check" + encodeURI(PARAMETER))

            return data
        }catch(error){
            toast.error(error.response.data?.message)
            return rejectWithValue(error.response.data)
        }
    }
)
