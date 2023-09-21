import { createSlice } from "@reduxjs/toolkit";
import {
    getCheckoutProducts,
    getTransactionList,
    createTransaction,
    getTransactionStatus
} from "./slices";

const INITIAL_STATE = {
    transactions : [],
    cart : [],
    transactionStatus : [],
    isCreateTransactionLoading : false,
    isGetTransactionLoading : false,
    isGetCheckoutLoading : false,
    isGetTransactionStatusLoading : false,
}

const transactionsSlice = createSlice({
    name : "transactions",
    initialState : INITIAL_STATE,
    reducers : {

    },
    extraReducers: {
        [getTransactionList.pending] : (state, action) => {
            state.isGetTransactionLoading = true
        },
        [getTransactionList.fulfilled] : (state, action) => {
            state = Object.assign(state, {transactions : action.payload?.data, isGetTransactionLoading : false})
        },
        [getTransactionList.rejected] : (state, action) => {
            state = Object.assign(state, {isGetTransactionLoading : false})
        },

        [getCheckoutProducts.pending] : (state, action) => {
            state.isGetCheckoutLoading = true
        },
        [getCheckoutProducts.fulfilled] : (state, action) => {
            state = Object.assign(state, {cart : action.payload?.data, isGetCheckoutLoading : false})
        },
        [getCheckoutProducts.rejected] : (state, action) => {
            state = Object.assign(state, {isGetCheckoutLoading : false})
        },
        
        [createTransaction.pending] : (state, action) => {
            state.isCreateTransactionLoading = true
        },
        [createTransaction.rejected] : (state, action) => {
            state.isCreateTransactionLoading = false
        },
        [createTransaction.fulfilled] : (state, action) => {
            state.isCreateTransactionLoading = false
        },

        [getTransactionStatus.pending] : (state, action) => {
            state.isGetTransactionStatusLoading = true
        },
        [getTransactionStatus.fulfilled] : (state, action) => {
            state = Object.assign(state, {transactionStatus : action.payload?.data, isGetTransactionStatusLoading : false})
        },
        [getTransactionStatus.rejected] : (state, action) => {
            state = Object.assign(state, {isGetTransactionStatusLoading : false})
        },
    }
})

export default transactionsSlice.reducer