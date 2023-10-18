import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api.instance"
import { toast } from 'react-toastify';

import { ForgotPassValidationSchema, LoginValidationSchema, PasswordValidationSchema, 
    RegisterValidationSchema,VerifyValidationSchema, changeEmailValidationSchema, changePasswordValidationSchema } from "./validation";

export const login = createAsyncThunk(
    "auth/login",
     
    async (payload, { rejectWithValue }) => {
        try {
            await LoginValidationSchema.validate(payload)

            const response = await api.post("auth/login", payload)

            const {data} = response

            const token = response.headers.authorization.split(" ")[1]

            localStorage.setItem("token", token)

            toast.success(response?.data?.message);
            
            return data
        } catch (error) {
            toast.error(error.response?.data?.message)

            return rejectWithValue(error.response?.data?.message)
        }
    }
)

export const keepLogin = createAsyncThunk (
    "auth/keep-login",

    async (payload, { rejectWithValue }) =>{
        try {
            const {data} = await api.get("/auth/keep-login")
            return data.user
        } catch (error) {

            return rejectWithValue(error.response.data.message)
        }
    }
)

export const logout = createAsyncThunk(
    "auth/logout",
    async (payload, { rejectWithValue }) => {
        try {
            localStorage.removeItem("token")

            toast.success("Logout Success")
        } catch (error) {
            toast.error(error.response ? error.response.data : error)

            return rejectWithValue(error.response ? error.response.data : error)
        }
    }
)

export const forcedLogout = createAsyncThunk(
    "auth/forcedLogout",
    async (payload, { rejectWithValue }) => {
        try {
            localStorage.removeItem("token")
        } catch (error) {
            toast.error(error.response ? error.response.data : error)

            return rejectWithValue(error.response ? error.response.data : error)
        }
    }
)

export const register = createAsyncThunk(
    "auth/admin/register",
     
    async (payload, { rejectWithValue }) => {
        try {
            await RegisterValidationSchema.validate(payload)
            
            const response = await api.post("auth/register", payload)

            const {data} = response

            toast.success("Berhasil register")

            return data

            
        } catch (error) {
            if (error){
                toast.error(error)
            }
            else{
                toast.error(error.response?.data?.message)
            }
            return rejectWithValue(error.response?.data?.message)
        }
    }
)

export const verify = createAsyncThunk(
    "auth/admin/verify",
    async (payload, { rejectWithValue }) => {
        try {
            const {token} = payload
           
            delete payload.token
            console.log(payload)
            await VerifyValidationSchema.validate(payload)
            const response = await api.post("auth/verify", payload, {headers : {"Authorization": `Bearer ${token}`}})
            const newToken = response.headers.authorization.split(" ")[1]
            localStorage.setItem("token", newToken)

            const {data} = response
            
            toast.success("Kamu telah terverifikasi. Selamat!")
            return data
            
        } catch (error) {
            toast.error(error.response?.data?.message)

            return rejectWithValue(error.response?.data?.message)
        }
    }
)

export const resendOtp= createAsyncThunk(
    "auth/admin/resendOtp",
     
    async (payload, { rejectWithValue }) => {
        try {
            const response = await api.post("auth/resendOtp", payload)

            const {data} = response

            toast.success(data?.message)
            
        } catch (error) {
            toast.error(error.response?.data?.message)

            return rejectWithValue(error.response?.data?.message)
        }
    }
)

export const changePassword = createAsyncThunk (
    "auth/user/changePassword",
    async(payload, {rejectWithValue}) => {
        try{
            await changePasswordValidationSchema.validate(payload);
            const userId = payload.userId;
            delete payload.userId;
            const response = await api.patch(`auth/change-password/${userId}`,payload)
            toast.success("Password telah dirubah.")
            return {}
        }catch(error){
            toast.error(error.response?.data?.message)
            return rejectWithValue(error.response?.data?.message)
        }
    }
)

export const changeProfilePicture = createAsyncThunk(
    "auth/user/changeProfilePicture",
    async(payload, {rejectWithValue}) => {
        try{
            const response = await api.patch(`auth/change-picture/${payload.userId}`,payload.formData)
            toast.success("Tampilan anda telah dirubah.")
            return {}
        }catch(error){
            toast.error(error.response?.data?.message)
            return rejectWithValue(error.response?.data?.message)
        }
    }
)

export const changeEmailOtp = createAsyncThunk(
    "auth/user/changeEmailOtp",
    async(payload, {rejectWithValue}) => {
        try{
            const response = await api.post(`auth/changeOtp/${payload.userId}`)
            toast.success("OTP telah dikirim ke Email Anda.")
            return {}
        }catch(error){
            toast.error(error.response?.data?.message)
            return rejectWithValue(error.response?.data?.message)
        }
    }
)

export const changeEmail = createAsyncThunk (
    "auth/user/changeEmail",
    async(payload, {rejectWithValue}) => {
        try{
            const userId = payload.userId;
            delete payload.userId;
            const response = await api.patch(`auth/change-email/${userId}`,payload)
            toast.success("Email telah berhasil dirubah! Silahkan Login kembali dengan Email yang baru.")
            return {}
        }catch(error){
            toast.error(error.response?.data?.message)
            return rejectWithValue(error.response?.data?.message)
        }
    }
)

export const changeProfileData = createAsyncThunk (
    "auth/user/changeProfile",
    async(payload, {rejectWithValue}) => {
        try{
            const userId = payload.userId;
            delete payload.userId;
            const response = await api.patch(`auth/change-profile/${userId}`,payload)
            toast.success("Your profile data has been updated.")
            return {}
        }catch(error){
            toast.error(error.response?.data?.message)
            return rejectWithValue(error.response?.data?.message)
        }
    }
)

export const forgotPass = createAsyncThunk(
    "auth/user/forgotPassword",
     
    async (payload, { rejectWithValue }) => {
        try {
            // await ForgotPassValidationSchema.validate(payload)
            const response = await api.post("auth/forgot", payload)

            const {data} = response

            toast.success("Form reset telah dikirim")
            
        } catch (error) {
            toast.error(error.response?.data?.message)

            return rejectWithValue(error.response?.data?.message)
        }
    }
)

export const resetPass= createAsyncThunk(
    "auth/user/resetPassword",
     
    async (payload, { rejectWithValue }) => {
        try {
            const {token} = payload
            console.log(token)
            delete payload.token
            // await PasswordValidationSchema.validate(payload)
            const response = await api.post("auth/reset", payload, {headers : {"Authorization": `Bearer ${token}`}})

            const {data} = response

            toast.success("Data Password telah diubah")
            
        } catch (error) {
            toast.error(error.response?.data?.message)

            return rejectWithValue(error.response?.data?.message)
        }
    }
)

export const getProfile = createAsyncThunk(
    "auth/user/getProfile",
    async(payload, {rejectWithValue}) =>{
        try{
            const data = await api.get("auth/profile");
            return data;
        }catch(error){
            toast.error(error.response?.data?.message)
            return rejectWithValue(error.response?.data?.message)
        }
    }
)

export const changePasswordSuccess = () => ({
    type: "address/changePasswordSuccess",
});