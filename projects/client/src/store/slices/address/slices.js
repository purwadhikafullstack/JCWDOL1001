import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api.instance";
import Axios from "axios";


export const getAddress = createAsyncThunk(
    "address/userAddress",
    async (payload, { rejectWithValue }) => {
        try {

            const { data } = await api.get("/address/")

            return data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message)
        }
    }
)

export const deleteAddress = createAsyncThunk(
    "address/deleteAddress",
    async (payload, { rejectWithValue }) => {
        try {

            const { data } = await api.patch("/address/delete/" + payload)

            return data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message)
        }
    }
)

export const listProvince = createAsyncThunk(
    "address/province",

    async (payload, { rejectWithValue }) => {
        try {

          const response = await api.get("/address/province")

            const {data} = response

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
            const response = await api.get(`/address/city?province=${payload?.province}`)

            const {data} = response

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
            //teruntuk siapapun yang ngerjain ongkir
            //cukup grab costId dari address user, sebagai alamat tujuan;
            // jadi bisa langsung dapet ongkosnya
            //nanti tanya wellington aja kalau bingung, trims
            
            // return data

        } catch (error) {
            alert(error.response?.data?.message)

            return rejectWithValue(error.response?.data?.message)
        }
    }
)
