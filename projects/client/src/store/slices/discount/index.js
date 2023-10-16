import {createSlice} from "@reduxjs/toolkit";

import {
    getDiscount,
    deleteDiscount,
    updateDiscount,
    createDiscount,
    checkerDiscount,
} from "./slices.js"

const INITIAL_STATE = {
    data : [],
    listDiscount : [],
    success : false,
    totalPage: "",
    currentPage: "",
    limit:"",
    isLoading : false,
    isDeleteLoading : false,
}

const discountSlice = createSlice({
    name : "discount",
    initialState : INITIAL_STATE,
    reducers : {

    },
    extraReducers : {
        [getDiscount.pending] : (state, action) => {
            state.isLoading = true
        },
        [getDiscount.fulfilled] : (state, action) => {
            state = Object.assign(state, {
                data : action.payload?.discount,
                totalPage : action.payload?.totalPage,
                currentPage : action.payload?.currentPage,
                limit : action.payload?.limit,
                success : false,
                isLoading : false
            })
        },
        [getDiscount.rejected] : (state,action) => {
            state = Object.assign(state, {
                data : [],
                totalPage : 1,
                currentPage : 1,
                success : false,
                isLoading : false
            })
        },
        [deleteDiscount.pending] : (state, action) => {
            state.isDeleteLoading = true
        },
        [deleteDiscount.fulfilled] : (state, action) => {
            state = Object.assign(state, {
                success : true,
                isDeleteLoading : false
            })
        },
        [deleteDiscount.rejected] : (state,action) => {
            state.isDeleteLoading = false
        },
        [updateDiscount.pending] : (state, action) => {
            state.isLoading = true
        },
        [updateDiscount.fulfilled] : (state, action) => {
            state = Object.assign(state, {
                success : true,
                isLoading : false
            })
        },
        [updateDiscount.rejected] : (state,action) => {
            state.isLoading = false
        },
        [createDiscount.pending] : (state, action) => {
            state.isLoading = true
        },
        [createDiscount.fulfilled] : (state, action) => {
            state = Object.assign(state, {
                success : true,
                isLoading : false
            })
        },
        [createDiscount.rejected] : (state,action) => {
            state.isLoading = false
        },
        [checkerDiscount.pending] : (state, action) => {
            state.isLoading = true
        },
        [checkerDiscount.fulfilled] : (state, action) => {
            state = Object.assign(state, {
                listDiscount : action.payload.data
            })
        },
        [checkerDiscount.rejected] : (state,action) => {
            state.isLoading = false
        },
    }
})

export default discountSlice.reducer
