import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api.instance"
import { toast } from 'react-toastify';

import { LoginValidationSchema, RegisterValidationSchema,VerifyValidationSchema } from "./validation";


export const login = createAsyncThunk(
    "auth/login",
     
    async (payload, { rejectWithValue }) => {
        try {
            await LoginValidationSchema.validate(payload)

            const response = await api.post("auth/login", payload)

            const {data} = response

            const token = response.headers.authorization.split(" ")[1]

            localStorage.setItem("token", token)

            // alert(response?.data?.message)
            toast.success(response?.data?.message, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            
            return data
        } catch (error) {
            alert(error.response?.data?.message)

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
            // alert(error.response?.data?.message)

            return rejectWithValue(error.response.data.message)
        }
    }
)

export const logout = createAsyncThunk(
    "auth/logout",
    async (payload, { rejectWithValue }) => {
        try {
            localStorage.removeItem("token")

            toast.success("Logout Sucess")
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

            alert(response?.data?.message)

            return data

            
        } catch (error) {
            if (error){
                alert(error)
            }
            else{
                alert(error.response?.data?.message)
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
            
            alert(response?.data?.message)
            return data
            
        } catch (error) {
            alert(error.response?.data?.message)

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

            alert(response?.data?.message)
            
        } catch (error) {
            alert(error.response?.data?.message)

            return rejectWithValue(error.response?.data?.message)
        }
    }
)