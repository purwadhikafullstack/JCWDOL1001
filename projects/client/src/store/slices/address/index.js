import { createSlice } from "@reduxjs/toolkit";

import {
    listCity,
    listProvince,
    getAddress,
    deleteAddress,
    addAddress,
    updatePrimaryAddress,
    updateAddress,
    getShippingCost,
} from "./slices"

const INITIAL_STATE = {
    totalPage : null,
    currentPage : null,
    nextPage : null,
    totalAddress : null,
    data : [],
    province : [],
    city : [],
    shippingCost : [],
    isLoading : false,
    isGetAddressLoading : false,
    isSubmitAddressLoading : false,
    isGetCostLoading : false,
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
                totalPage : action.payload?.data.totalPage,
                currentPage : action.payload?.data.currentPage,
                nextPage : action.payload?.data.nextPage,
                totalAddress : action.payload?.data.totalAddress,
                data : action.payload?.data.data,
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
                isSubmitAddressLoading : false,
                success:true
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
                success:true
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
        },
        [getShippingCost.pending] : (state, action) => {
            state.isGetCostLoading = true;
        },
        [getShippingCost.fulfilled] : (state, action) => {                                                                                                                                                                                                                                                                                                                                                                                                                                                 
            state.isGetCostLoading = false;
            state.shippingCost = action.payload?.data[0].costs;
        },
        [getShippingCost.rejected] : (state, action) => {
            state.isGetCostLoading = false;
        }
    }
})

export default addressSlice.reducer

