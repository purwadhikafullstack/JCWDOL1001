import { createSlice } from "@reduxjs/toolkit";
import {
    getCheckoutProducts,
    getTransactionList,
    createTransaction,
    getTransactionStatus,
    uploadPaymentProof,
    getOngoingTransactions,
    cancelTransaction
} from "./slices";

const INITIAL_STATE = {
    transactions : [],
    ongoingTransactions : null,
    cart : [],
    transactionStatus : [],
    isCreateTransactionLoading : false,
    isGetTransactionLoading : false,
    isGetCheckoutLoading : false,
    isGetTransactionStatusLoading : false,
    isUpdateOngoingTransactionLoading : false,
    successUpdateOngoingTransaction: false,
    successCancelTransaction: false,
}

const transactionsSlice = createSlice({
    name : "transactions",
    initialState : INITIAL_STATE,
    reducers : {
        resetSuccessTransaction: (state, action) => {
            state.successUpdateOngoingTransaction = false;
            state.successCancelTransaction = false;
        },
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

        [getOngoingTransactions.pending] : (state, action) => {
            state.isGetTransactionLoading = true
        },
        [getOngoingTransactions.fulfilled] : (state, action) => {
            state = Object.assign(state, {ongoingTransactions : action.payload.data, isGetTransactionLoading : false})
        },
        [getOngoingTransactions.rejected] : (state, action) => {
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
        [createTransaction.fulfilled] : (state, action) => {
            state.isCreateTransactionLoading = false
        },
        [createTransaction.rejected] : (state, action) => {
            state.isCreateTransactionLoading = false
        },
        
        [uploadPaymentProof.pending] : (state, action) => {
            state.isUpdateOngoingTransactionLoading = true
        },
        [uploadPaymentProof.fulfilled] : (state, action) => {
            state.isUpdateOngoingTransactionLoading = false
            state.successUpdateOngoingTransaction = true
        },
        [uploadPaymentProof.rejected] : (state, action) => {
            state.isUpdateOngoingTransactionLoading = false
        },

        [cancelTransaction.pending] : (state, action) => {
            state.isUpdateOngoingTransactionLoading = true
        },
        [cancelTransaction.fulfilled] : (state, action) => {
            state.isUpdateOngoingTransactionLoading = false
            state.successCancelTransaction = true
        },
        [cancelTransaction.rejected] : (state, action) => {
            state.isUpdateOngoingTransactionLoading = false
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