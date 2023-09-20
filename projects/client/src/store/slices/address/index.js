import { createSlice } from "@reduxjs/toolkit";

import {
    listCity,
    cost,
    listProvince,
    getAddress,
    deleteAddress,
    addAddress,
    updatePrimaryAddress,
    updateAddress
} from "./slices"

const INITIAL_STATE = {
    data : [],
    province : [],
    city : [],
    isLoading : false,
    isGetAddressLoading : false,
    isSubmitAddressLoading : false,
    success: false
}

const addressSlice = createSlice({
    name : "address",
    initialState : INITIAL_STATE,
    reducers: {
        resetSuccessAddress: (state, action) => {
            state.success = false;
        },
    },
    extraReducers : {

        [listProvince.pending] : (state, action) => {
            state.isLoading = true
        },
        [listProvince.fulfilled] : (state, action) => {                                                                                                                                                                                                                                                                                                                                                                                                                                                 
            state = Object.assign(state, {
                province : action.payload?.data,
                isLoading : false,
            })
        },
        [listProvince.rejected] : (state, action) => {
            state = Object.assign(state, {
                isLoading : false,
            })
        },

        [listCity.pending] : (state, action) => {
            state.isLoading = true
        },
        [listCity.fulfilled] : (state, action) => {                                                                                                                                                                                                                                                                                                                                                                                                                                                 
            state = Object.assign(state, {
                city : action.payload?.data,
                isLoading : false,
            })
        },
        [listCity.rejected] : (state, action) => {
            state = Object.assign(state, {
                isLoading : false,
            })
        },

        [getAddress.pending] : (state, action) => {
            state.isGetAddressLoading = true
        },
        [getAddress.fulfilled] : (state, action) => {                                                                                                                                                                                                                                                                                                                                                                                                                                                 
            state = Object.assign(state, {
                data : action.payload?.data,
                isGetAddressLoading : false,
            })
        },
        [getAddress.rejected] : (state, action) => {
            state = Object.assign(state, {
                isGetAddressLoading : false,
            })
        },

        [addAddress.pending] : (state, action) => {
            state.isSubmitAddressLoading = true
        },
        [addAddress.fulfilled] : (state, action) => {                                                                                                                                                                                                                                                                                                                                                                                                                                                 
            state = Object.assign(state, {
                data : action.payload?.data,
                isSubmitAddressLoading : false,
            })
        },
        [addAddress.rejected] : (state, action) => {
            state = Object.assign(state, {
                isSubmitAddressLoading : false,
            })
        },

        [updateAddress.pending] : (state, action) => {
            state.isSubmitAddressLoading = true
        },
        [updateAddress.fulfilled] : (state, action) => {                                                                                                                                                                                                                                                                                                                                                                                                                                                 
            state = Object.assign(state, {
                data : action.payload?.data,
                isSubmitAddressLoading : false,
            })
        },
        [updateAddress.rejected] : (state, action) => {
            state = Object.assign(state, {
                isSubmitAddressLoading : false,
            })
        },

        [deleteAddress.pending] : (state, action) => {
            state.isSubmitAddressLoading = true;
        },
        [deleteAddress.fulfilled] : (state, action) => {                                                                                                                                                                                                                                                                                                                                                                                                                                                 
            state.isSubmitAddressLoading = false;
            state.success = true;
        },
        [deleteAddress.rejected] : (state, action) => {
            state.isSubmitAddressLoading = false;
        },

        [updatePrimaryAddress.pending] : (state, action) => {
            state.isSubmitAddressLoading = true;
        },
        [updatePrimaryAddress.fulfilled] : (state, action) => {                                                                                                                                                                                                                                                                                                                                                                                                                                                 
            state.isSubmitAddressLoading = false;
            state.success = true;
        },
        [updatePrimaryAddress.rejected] : (state, action) => {
            state.isSubmitAddressLoading = false;
        }
    }
})

export default addressSlice.reducer

