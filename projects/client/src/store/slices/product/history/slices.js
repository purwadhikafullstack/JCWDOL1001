import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../utils/api.instance.js"
import { toast } from "react-toastify"

export const productStockHistory = createAsyncThunk(
    "products/stockHistory",
    async(payload, {rejectWithValue}) => {
        try{
            const {productId, page, sort_status, sort_type, start_date, end_date} = payload;
            let query="";

            if(page){
                query += `?page=${page}`
            }
            if(start_date){
                query += `${query ? '&' : '?'}start_date=${start_date}`
            }
            if(end_date){
                query += `${query ? '&' : '?'}end_date=${end_date}`
            }
            if(sort_status){
                query += `${query ? '&' : '?'}sort_status=${sort_status}`
            }
            if(sort_type){
                query += `${query ? '&' : '?'}sort_type=${sort_type}`
            }

            const data = await api.get(`/products/history/${productId}`+`${query}`);
            return data;
        }catch(error){
            return rejectWithValue(error.response.data.message);
        }
    }
)

export const productDetailHistory = createAsyncThunk(
    "products/detailsHistory",
    async(payload, {rejectWithValue}) => {
        try{
            const data = await api.get(`/products/stock/${payload.productId}`);
            return data;
        }catch(error){
            return rejectWithValue(error.response.data.message);
        }
    }
)