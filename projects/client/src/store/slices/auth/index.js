import { createSlice } from "@reduxjs/toolkit";

import {
    login,
    keepLogin,
    logout,
    register,
    verify,
    changePassword,
    changeEmail,
    changeProfilePicture,
    changeProfileData,
    forgotPass,
    resetPass,
    getProfile
} from "./slices"
// import { reset } from "../../../../../server/src/controllers/authentication";

const INITIAL_STATE = {
    uuid : "",
    email : "",
    role: "",
    status : 0,
    profile:[],
    address:[],
    isLogin : false,
    isLoginLoading : false,
    isRegister : false,
    isRegisterLoading : false,
    isVerifyLoading : false,
    isKeepLoginLoading : false,
    isLogoutLoading : false,
    isChangePasswordLoading : false,
    isChangeEmailLoading : false,
    isChangePictureLoading : false,
    isChangeProfileLoading : false,
    isForgotPasswordLoading : false,
    isResetPasswordLoading : false,
    isGetProfileLoading : false,
    resetStatus : false,
    isForgot : false
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
                profile : action.payload?.user?.userProfile,
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
                uuid : action.payload?.UUID,
                role : action.payload?.role,
                email : action.payload?.email,
                status : action.payload?.status,
                profile : action.payload?.userProfile,
                address : action.payload?.user_addresses,
                isKeepLoginLoading : false,
                isLogin : true,
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
            state.isRegister = true

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
        [changePassword.pending] : (state, action) => {
            state.isChangePasswordLoading = true
        },
        [changePassword.rejected] : (state, action) => {
            state.isChangePasswordLoading = false
        },
        [changePassword.fulfilled] : (state, action) => {
            state.isChangePasswordLoading = false
        },
        [changeEmail.pending] : (state, action) => {
            state.isChangeEmailLoading = true
        },
        [changeEmail.rejected] : (state, action) => {
            state.isChangeEmailLoading = false
        },
        [changeEmail.fulfilled] : (state, action) => {
            state.isChangeEmailLoading = false
        },
        [changeProfilePicture.pending] : (state, action) => {
            state.isChangePictureLoading = true
        },
        [changeProfilePicture.rejected] : (state, action) => {
            state.isChangePictureLoading = false
        },
        [changeProfilePicture.fulfilled] : (state, action) => {
            state.isChangePictureLoading = false
        },
        [changeProfileData.pending] : (state, action) => {
            state.isChangeProfileLoading = true
        },
        [changeProfileData.rejected] : (state, action) => {
            state.isChangeProfileLoading = false
        },
        [changeProfileData.fulfilled] : (state, action) => {
            state.isChangeProfileLoading = false
        },
        [forgotPass.pending] : (state, action) => {
            state.isForgotPasswordLoading = true
            state.isForgot = false
        },
        [forgotPass.rejected] : (state, action) => {
            state.isForgotPasswordLoading = false
            state.isForgot = true
        },
        [forgotPass.fulfilled] : (state, action) => {
            state.isForgotPasswordLoading= false
        },
        [resetPass.pending] : (state, action) => {
            state.isResetPasswordLoading = true
        },
        [resetPass.rejected] : (state, action) => {
            state.isResetPasswordLoading = false
            state.resetStatus = true
        },
        [resetPass.fulfilled] : (state, action) => {
            state.isResetPasswordLoading= false
        },
        [getProfile.pending] : (state, action) => {
            state.isGetProfileLoading = true
        },
        [getProfile.rejected] : (state, action) => {
            state.isGetProfileLoading = false
        },
        [getProfile.fulfilled] : (state, action) => {
            state = Object.assign(state, {
                profile : action.payload?.data?.data,
                isGetProfileLoading : false
            })
        }

    }
})

export default authSlice.reducer