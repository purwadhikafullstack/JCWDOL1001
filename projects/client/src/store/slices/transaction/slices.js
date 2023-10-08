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
            const { statusId, page, startFrom, endFrom, sortDate, sortTotal, filterName, invoice} = payload;

            let PARAMETER = ""

            if(page) PARAMETER +=`page=${page}&`

            if(startFrom) PARAMETER +=`startFrom=${startFrom}&endFrom=${endFrom}&`

            if(sortDate) PARAMETER +=`sortDate=${sortDate}&`
            
            if(sortTotal) PARAMETER +=`sortTotal=${sortTotal}&`

            if(filterName) PARAMETER +=`filterName=${filterName}&`

            if(invoice) PARAMETER +=`invoice=${invoice}&`
            
            const {data} = await api.get(`/transaction/${statusId}?`+ encodeURI(PARAMETER));
            
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
            toast.success("Checkout Successful. Don't forget to pay.")
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

export const confirmPayment = createAsyncThunk(
    "transactions/confirmPayment",
    async (payload, {rejectWithValue}) => {
        try{

            await api.patch(`/transaction/confirm-payment/${payload}`);

        }catch(error){
            toast.error(error.response.data.message);
            return rejectWithValue(error.response.data.message);
        }
    }
)

export const processOrder = createAsyncThunk(
    "transactions/processOrder",
    async (payload, {rejectWithValue}) => {
        try{

            await api.patch(`/transaction/process-order/${payload}`);

        }catch(error){
            toast.error(error.response.data.message);
            return rejectWithValue(error.response.data.message);
        }
    }
)

export const sendOrder = createAsyncThunk(
    "transactions/sendOrder",
    async (payload, {rejectWithValue}) => {
        try{

            await api.patch(`/transaction/send-order/${payload}`);

        }catch(error){
            toast.error(error.response.data.message);
            return rejectWithValue(error.response.data.message);
        }
    }
)

export const receiveOrder = createAsyncThunk(
    "transactions/receiveOrder",
    async (payload, {rejectWithValue}) => {
        try{

            await api.patch(`/transaction/receive-order/${payload}`);

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

export const rejectPayment = createAsyncThunk(
    "transactions/rejectPayment",
    async (payload, {rejectWithValue}) => {
        try{
            const transactionId= payload.transactionId
            delete payload.transactionId;

            await api.patch(`/transaction/reject-payment/${transactionId}`, payload);
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