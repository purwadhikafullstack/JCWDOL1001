import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api.instance";
import { toast } from "react-toastify";

export const getCheckoutProducts = createAsyncThunk(
    "transactions/getCheckout",
    async (payload, {rejectWithValue}) => {
        try{
            const {userId} = payload.userId;
            const {data} = await api.get(`/transaction/cart/${userId}`);
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

export const getOngoingTransactions = createAsyncThunk(
    "transactions/getOngoingTransactions",
    async (payload, {rejectWithValue}) => {
        try{
            const { data } = await api.get(`/transaction/ongoing`);

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
            toast.success("Please check your payment")
            return{}
        }catch(error){
            toast.error(error.response.data.message);
            return rejectWithValue(error.response.data.message);
        }
    }
)

export const uploadPaymentProof = createAsyncThunk(
    "transactions/uploadPaymentProof",
    async (payload, {rejectWithValue}) => {
        try{
            const { transactionId, imageData } = payload
            await api.patch(`/transaction/upload-payment-proof/${transactionId}`, imageData);
        }catch(error){
            toast.error(error.response.data.message);
            return rejectWithValue(error.response.data.message);
        }
    }
)

export const cancelTransaction = createAsyncThunk(
    "transactions/cancelTransaction",
    async (payload, {rejectWithValue}) => {
        try{
            const transactionId= payload.transactionId
            delete payload.transactionId;

            await api.patch(`/transaction/cancel-transaction/${transactionId}`, payload);
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

export const resetSuccessTransaction = () => ({
    type: "transactions/resetSuccessTransaction",
});