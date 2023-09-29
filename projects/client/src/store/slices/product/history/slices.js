import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../utils/api.instance.js"
import { toast } from "react-toastify"

export const ProductStockHistory = createAsyncThunk(
    "products/stockHistory",
    async(payload, {rejectWithValue}) => {
        try{
            const {productId, sort_status, start_date, end_date} = payload;
            await api.get(`/products/history/${productId}`+`${query}`);
        }catch(error){
            return rejectWithValue(error.response.data.message);
        }
    }
)