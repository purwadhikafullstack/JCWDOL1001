import { createSlice } from "@reduxjs/toolkit";
import {
    getCheckoutProducts,
    getTransactionList,
    createTransaction
} from "./slices";

const INITIAL_STATE = {
    transactions : [],
    cart : [],
    isCreateTransactionLoading : false,
    isGetTransactionLoading : false,
    isGetCheckoutLoading : false
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
        [getTransactionList.rejected] : (state, action) => {
            state = Object.assign(state, {transactions : action.payload?.data, isGetTransactionLoading : false})
        },
        [getTransactionList.fulfilled] : (state, action) => {
            state = Object.assign(state, {transactions : [], isGetTransactionLoading : false})
        },
        [getCheckoutProducts.pending] : (state, action) => {
            state.isGetCheckoutLoading = true
        },
        [getCheckoutProducts.rejected] : (state, action) => {
            state = Object.assign(state, {cart : action.payload?.data, isGetCheckoutLoading : false})
        },
        [getCheckoutProducts.fulfilled] : (state, action) => {
            state = Object.assign(state, {cart : [], isGetCheckoutLoading : false})
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
    }
})

export default transactionsSlice.reducer