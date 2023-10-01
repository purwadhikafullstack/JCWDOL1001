import {createSlice} from "@reduxjs/toolkit";

import {
checkIngredient,
getUser,
setOrder
} from "./slices.js"

const INITIAL_STATE = {
    dataUser: [],
    status : false,
    isLoading : false,
    message : ""
}

const customSlice = createSlice({
    name : "custom",
    initialState : INITIAL_STATE,
    reducers : {

    },
    extraReducers : {
        [checkIngredient.pending] : (state, action) => {
            state.isLoading = true
        },
        [checkIngredient.fulfilled] : (state, action) => {
            state = Object.assign(state, {
                isLoading : false,
                message : action.yaload?.message
            })
        },
        [checkIngredient.rejected] : (state,action) => {
            state.isLoading = false
        },
        [getUser.pending] : (state, action) => {
            state.isLoading = true
        },
        [getUser.fulfilled] : (state, action) => {
            state = Object.assign(state, {
                dataUser : action.payload?.data,
                isLoading : false
            })
        },
        [getUser.rejected] : (state,action) => {
            state.isLoading = false
        },
        [setOrder.pending] : (state, action) => {
            state.isLoading = true
        },
        [setOrder.fulfilled] : (state, action) => {
            state = Object.assign(state, {
                // success : true,action.payload?
                status : true,
                isLoading : false
            })
        },
        [setOrder.rejected] : (state,action) => {
            state.isLoading = false
        },
        
    }
})

export default customSlice.reducer
