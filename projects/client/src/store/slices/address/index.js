import { createSlice } from "@reduxjs/toolkit";

import {
    listCity,
    cost,
    listProvince
} from "./slices"

const INITIAL_STATE = {
    province : [],
    city : [],
    isLoading : false

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
    }
})

export default addressSlice.reducer

