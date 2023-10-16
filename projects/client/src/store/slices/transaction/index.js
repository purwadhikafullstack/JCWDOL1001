import { createSlice } from "@reduxjs/toolkit";
import {
    getCheckoutProducts,
    getTransactionList,
    createTransaction,
    getTransactionStatus,
    uploadPaymentProof,
    getOngoingTransactions,
    cancelTransaction,
    confirmPayment,
    processOrder,
    sendOrder,
    receiveOrder,
    rejectPayment
} from "./slices";

const INITIAL_STATE = {
    totalPage : null,
    currentPage : null,
    nextPage : null,
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
            state = Object.assign(state, {
                transactions : action.payload?.data,
                totalPage : action.payload?.totalPage,
                currentPage : action.payload?.currentPage,
                nextPage : action.payload?.nextPage,
                isGetTransactionLoading : false
            })
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
            state = Object.assign(state, {cart : action.payload?.data, isGetCheckoutLoading : false, checkoutStatus : null})
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

        [confirmPayment.pending] : (state, action) => {
            state.isUpdateOngoingTransactionLoading = true
        },
        [confirmPayment.fulfilled] : (state, action) => {
            state.isUpdateOngoingTransactionLoading = false
            state.successUpdateOngoingTransaction = true
        },
        [confirmPayment.rejected] : (state, action) => {
            state.isUpdateOngoingTransactionLoading = false
        },

        [processOrder.pending] : (state, action) => {
            state.isUpdateOngoingTransactionLoading = true
        },
        [processOrder.fulfilled] : (state, action) => {
            state.isUpdateOngoingTransactionLoading = false
            state.successUpdateOngoingTransaction = true
        },
        [processOrder.rejected] : (state, action) => {
            state.isUpdateOngoingTransactionLoading = false
        },

        [sendOrder.pending] : (state, action) => {
            state.isUpdateOngoingTransactionLoading = true
        },
        [sendOrder.fulfilled] : (state, action) => {
            state.isUpdateOngoingTransactionLoading = false
            state.successUpdateOngoingTransaction = true
        },
        [sendOrder.rejected] : (state, action) => {
            state.isUpdateOngoingTransactionLoading = false
        },

        [receiveOrder.pending] : (state, action) => {
            state.isUpdateOngoingTransactionLoading = true
        },
        [receiveOrder.fulfilled] : (state, action) => {
            state.isUpdateOngoingTransactionLoading = false
            state.successUpdateOngoingTransaction = true
        },
        [receiveOrder.rejected] : (state, action) => {
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

        [rejectPayment.pending] : (state, action) => {
            state.isUpdateOngoingTransactionLoading = true
        },
        [rejectPayment.fulfilled] : (state, action) => {
            state.isUpdateOngoingTransactionLoading = false
            state.successCancelTransaction = true
        },
        [rejectPayment.rejected] : (state, action) => {
            state.isUpdateOngoingTransactionLoading = false
        },

        [getTransactionStatus.pending] : (state, action) => {
            state.isGetTransactionStatusLoading = true
        },
        [getTransactionStatus.fulfilled] : (state, action) => {
            state = Object.assign(state, {transactionStatus : action.payload?.data})
        },
        [getTransactionStatus.rejected] : (state, action) => {
            state = Object.assign(state, {isGetTransactionStatusLoading : false})
        },
    }
})

export default transactionsSlice.reducer