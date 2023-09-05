import { createSlice } from "@reduxjs/toolkit";

import {
    listCity,
    cost,
    listProvince
} from "./slices"

const INITIAL_STATE = {
    province : [],
    city : [],
}

const addressSlice = createSlice({
    name : "address",
    initialState : INITIAL_STATE,
    reducers : {
    },
    extraReducers : {
       
    }
})

export default authSlice.reducer