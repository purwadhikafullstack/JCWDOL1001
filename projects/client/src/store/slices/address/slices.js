import { createAsyncThunk } from "@reduxjs/toolkit";
import addressApi from "../../utils/address.api.instance";

export const listProvince = createAsyncThunk(
    "address/province",
     
    async (payload, { rejectWithValue }) => {
        try {
            // const response = await addressApi.get("province", payload,{headers: {"key" : process.env.RAJAONGKIR_API_KEY}})

            // const {data} = response

            // alert(response?.data?.message)
            
            return data
        } catch (error) {
            alert(error.response?.data?.message)

            return rejectWithValue(error.response?.data?.message)
        }
    }
)

export const listCity = createAsyncThunk(
    "address/city",
     
    async (payload, { rejectWithValue }) => {
        try {

            
            return data
        } catch (error) {
            alert(error.response?.data?.message)

            return rejectWithValue(error.response?.data?.message)
        }
    }
)

export const cost = createAsyncThunk(
    "address/cost",
     
    async (payload, { rejectWithValue }) => {
        try {

            
            return data
        } catch (error) {
            alert(error.response?.data?.message)

            return rejectWithValue(error.response?.data?.message)
        }
    }
)
