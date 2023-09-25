import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api.instance";
import { toast } from "react-toastify";

export const getCheckoutProducts = createAsyncThunk(
    "transactions/getCheckout",
    async (payload, {rejectWithValue}) => {
        try{
            const {data} = await api.get(`/transaction/cart`);
            return data;
        }catch(error){
            toast.error(error.response.data.message);
            return rejectWithValue(error.response.data.message);
        }
    }
)

export const getTransactionList = createAsyncThunk(
    "transactions/getTransactionList",
    async (payload, {rejectWithValue}) => {
        try{
            const { statusId } = payload;
            const {data} = await api.get(`/transaction/${statusId}`);
            return data;
        }catch(error){
            toast.error(error.response.data.message);
            return rejectWithValue(error.response.data.message);
        }
    }
)

export const createTransaction = createAsyncThunk(
    "transactions/createTransaction",
    async (payload, {rejectWithValue}) => {
        try{
            await api.post(`/transaction/checkout`,payload);
            toast.success("Checkout Successful. Don't forget to pay.")
            return{}
        }catch(error){
            toast.error(error.response.data.message);
            return rejectWithValue(error.response.data.message);
        }
    }
)

    export const getTransactionStatus = createAsyncThunk(
        "transactions/getTransactionStatus",
        async (payload, {rejectWithValue}) => {
            try{
                const { data } = await api.get(`/transaction/status`);
                return data;
            }catch(error){
                toast.error(error.response.data.message);
                return rejectWithValue(error.response.data.message);
            }
        }
    )