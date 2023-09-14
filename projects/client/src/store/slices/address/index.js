import { createSlice } from "@reduxjs/toolkit";

import {
    listCity,
    cost,
    listProvince,
    getAddress
} from "./slices"

const INITIAL_STATE = {
    data : [],
    province : [],
    city : [],
    isLoading : false,
    success: false
}

const addressSlice = createSlice({
    name : "address",
    initialState : INITIAL_STATE,
    reducers : {
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
            state.isLoading = true
        },
        [getAddress.fulfilled] : (state, action) => {                                                                                                                                                                                                                                                                                                                                                                                                                                                 
            state = Object.assign(state, {
                data : action.payload?.data,
                isLoading : false,
            })
        },
        [getAddress.rejected] : (state, action) => {
            state = Object.assign(state, {
                isLoading : false,
            })
        },
    }
})

export default addressSlice.reducer

