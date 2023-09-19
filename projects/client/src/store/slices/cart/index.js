import { createSlice } from "@reduxjs/toolkit";

import {
    getCart,
    totalProductCart,
    updateCart,
    deleteCart
} from "./slices"

const INITIAL_STATE = {
    total : 0,
    cart : [],
    message : "",
    isLoading : false,
    isUpdateLoading : false,
    isDeleteLoading  : false
}

const cartSlice = createSlice({
    name : "cart",
    initialState : INITIAL_STATE,
    reducers : {

    },
    extraReducers : {
        [getCart.pending] : (state, action) => {
            state.isLoading = true
        },
        [getCart.fulfilled] : (state, action) => {                                                                                                                                                                                                                                                                                                                                                                                                                                                 
            state = Object.assign(state, {
                cart : action.payload?.data,
                isLoading : false
            })
        },
        [getCart.rejected] : (state, action) => {
            state.isLoading = false
    
        },
        [totalProductCart.pending] : (state, action) => {
            state.isLoading = true
        },
        [totalProductCart.fulfilled] : (state, action)=> {
            state = Object.assign(state, {
                total : action.payload?.total,
                isLoading : false
            })
        },
        [totalProductCart.rejected] : (state, action) => {
            state.isLoading = false
        },
        [updateCart.pending] : (state, action) => {
            state = Object.assign(state, {
                isLoading : true,
                isUpdateLoading : true,
            })
        },
        [updateCart.fulfilled] : (state, action) => {
            state = Object.assign(state, {
                isLoading : false,
                isUpdateLoading : false,
                cart : action.payload?.data.data,
                total : action.payload?.total.total,
            })
        },
        [updateCart.rejected] : (state, action) => {
            state = Object.assign(state, {
                isLoading : false,
                isUpdateLoading : false,
            })
        }, 
        [deleteCart.pending] : (state, action) => {
            state = Object.assign(state, {
                isLoading : true,
                isDeleteLoading : true,
            })
        },
        [deleteCart.fulfilled] : (state, action) => {
            state = Object.assign(state, {
                isLoading : false,
                isDeleteLoading : false,
                cart : action.payload?.data.data,
                total : action.payload?.total.total,
            })
        },
        [deleteCart.rejected] : (state, action) => {
            state = Object.assign(state, {
                isLoading : false,
                isDeleteLoading : false,
            })
        }, 
       
    }
})

export default cartSlice.reducer