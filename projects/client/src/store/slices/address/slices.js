import { createAsyncThunk } from "@reduxjs/toolkit";
import addressApi from "../../utils/address.api.instance.js";
import Axios from "axios";

export const listProvince = createAsyncThunk(
    "address/province",
     
    async (payload, { rejectWithValue }) => {
        try {
            // console.log(addressApi)
            const response = await Axios.get("https://api.rajaongkir.com/starter/"+"province",{headers: {"key" : "bf12278d056fc12d712c25b1d6561eb9", "Content-Type": "application/x-www-form-urlencoded"}})

            // const {data} = response

            // alert(response?.data?.message)
            
            // return data
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
            // https://api.rajaongkir.com/starter/city?province=21
            const response = await addressApi.get(`city?province=${payload?.province}`,{headers: {"key" : process.env.RAJAONGKIR_API_KEY}})

            const {data} = response

            alert(response?.data?.message)
            
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

            
            // return data
        } catch (error) {
            alert(error.response?.data?.message)

            return rejectWithValue(error.response?.data?.message)
        }
    }
)
