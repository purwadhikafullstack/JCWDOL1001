import { createSlice } from "@reduxjs/toolkit";
import {
    productDetailHistory,
    productStockHistory
} from "./slices"

const INITIAL_STATE = {
    data : [],
    stock : [],
    totalPage : null,
    currentPage : null,
    nextPage : null,
    isLoading : false
}

const stockSlice = createSlice({
    name : "stocks",
    initialState : INITIAL_STATE,
    reducers : {

    },
    extraReducers : {
        [productStockHistory.pending] : (state, action) => {
            state.isLoading = true
        },
        [productStockHistory.fulfilled] : (state, action) => {
            state = Object.assign(state, {
                data : action.payload?.data?.data,
                totalPage : action.payload?.data?.totalPage,
                currentPage : action.payload?.data?.currentPage,
                nextPage : action.payload?.data?.nextPage,
                isLoading : false
            })
        },
        [productStockHistory.rejected] : (state,action) => {
            state = Object.assign(state, {
                data : [],
                totalPage : null,
                currentPage : null,
                nextPage : null,
                isLoading : false
            })
        },
        [productDetailHistory.pending] : (state, action) => {
            state.isLoading = true
        },
        [productDetailHistory.fulfilled] : (state, action) => {
            state = Object.assign(state, {
                stock : action.payload?.data?.data,
                isLoading : false
            })
        },
        [productStockHistory.rejected] : (state, action) => {
            state = Object.assign(state, {
                stock : [],
                isLoading : false
            })
        }
    }
})

export default stockSlice.reducer