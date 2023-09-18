import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api.instance";
import Axios from "axios";


export const getCart = createAsyncThunk(
    "cart/getCart",
    async (payload, { rejectWithValue }) => {
        try {
            const { data } = await api.get("/cart")
            return data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message)
        }
    }
)

export const totalProductCart = createAsyncThunk(
    "cart/totalProductCart",
    async (payload, { rejectWithValue }) => {
        try {

            const { data } = await api.get("/cart/total")

            return data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message)
        }
    }
)

export const updateCart = createAsyncThunk(
    "cart/updateCart",

    async (payload, { rejectWithValue }) => {
        try {

            await api.post("/cart",payload)
            // const {data} = response
            // alert(data?.message)
            const response = await api.get("/cart/total")
            const total = response.data
            const { data } = await api.get("/cart")
            return {data : data, total : total}
        } catch (error) {
            alert(error.response?.data?.message)

            return rejectWithValue(error.response?.data?.message)
        }
    }
)

export const deleteCart = createAsyncThunk(
    "cart/deleteCart",

    async (payload, { rejectWithValue }) => {
        try {
            const response = await api.delete(`/cart/${payload?.productId}`)

            // const {data} = response

            // return data
            
        } catch (error) {
            alert(error.response?.data?.message)

            return rejectWithValue(error.response?.data?.message)
        }
    }
)
