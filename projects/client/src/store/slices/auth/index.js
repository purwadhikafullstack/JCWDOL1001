import { createSlice } from "@reduxjs/toolkit";

import {
    login,
    keepLogin,
    logout,
} from "./slices"

const INITIAL_STATE = {
    uuid : "",
    email : "",
    role: "",
    status:"",
    profile:[],
    isLogin : false,
    isLoginLoading : false,
    isKeepLoginLoading : false,
    isLogoutLoading : false
}

const authSlice = createSlice({
    name : "auth",
    initialState : INITIAL_STATE,
    reducers : {

    },
    extraReducers : {
        [login.pending] : (state, action) => {
            state.isLoginLoading = true
        },
        [login.fulfilled] : (state, action) => {
            state = Object.assign(state, {
                uuid : action.payload?.user?.UUID,
                role : action.payload?.user?.role,
                email : action.payload?.user?.email,
                status : action.payload?.user?.status,
                profile : action.payload?.user?.user_profile,
                isLogin : true,
                isLoginLoading : false,
            })
        },
        [login.rejected] : (state, action) => {
            state = Object.assign(state, {
                isLoginLoading : false,
                isLogin : false,
            })
        },
        [keepLogin.pending] : (state, action) => {
            state.isKeepLoginLoading = true
        },
        [keepLogin.fulfilled] : (state, action)=> {
            state = Object.assign(state, {
                uuid : action.payload?.user?.UUID,
                role : action.payload?.user?.role,
                email : action.payload?.user?.email,
                profile : action.payload?.user?.user_profile,
                isKeepLoginLoading : false
            })
        },
        [keepLogin.rejected] : (state, action) => {
            state.isKeepLoginLoading = false
        },
        [logout.pending] : (state, action) => {
            state.isLogoutLoading = true
        },
        [logout.fulfilled] : (state, action) => {
            state = Object.assign(state, INITIAL_STATE)         
        },
        [logout.rejected] : (state, action) => {
            state.isLogoutLoading = false
        }, 
    }
})

export default authSlice.reducer