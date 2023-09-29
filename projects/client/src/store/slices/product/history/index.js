import { createSlice } from "@reduxjs/toolkit";
import {
    productStockHistory
} from "./slices"

const INITIAL_STATE = {
    data : [],
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
                data : action.payload?.data,
                totalPage : action.payload?.totalPage,
                currentPage : action.payload?.currentPage,
                nextPage : action.payload?.nextPage,
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
        }
    }
})

export default stockSlice.reducer