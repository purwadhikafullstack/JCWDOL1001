import { createSlice } from "@reduxjs/toolkit";

import {
    login,
    keepLogin,
    logout,
    register,
    verify,
} from "./slices"

const INITIAL_STATE = {
    uuid : "",
    email : "",
    role: "",
    status : 0,
    profile:[],
    isLoginLoading : false,
    isRegisterLoading : false,
    isVerifyLoading : false,
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
                profile : action.payload?.user?.user_profile,
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
        [register.pending] : (state, action) => {
            state.isRegisterLoading = true
        },
        [register.fulfilled] : (state, action) => {
            state.isRegisterLoading = false
        },
        [register.rejected] : (state, action) => {
            state.isRegisterLoading = false
        }, 
        [verify.pending] : (state, action) => {
            state.isVerifyLoading = true
        },
        [verify.fulfilled] : (state, action) => {
            state = Object.assign(state, {
                uuid : action.payload?.data?.UUID,
                role : action.payload?.data?.role,
                email : action.payload?.data?.email,
                status : action.payload?.data?.status,
                profile : action.payload?.profile,
                isVerifyLoading : false
            })
        },
        [verify.rejected] : (state, action) => {
            state.isVerifyLoading = false
        }, 
    }
})

export default authSlice.reducer