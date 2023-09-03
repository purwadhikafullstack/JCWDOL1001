import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api.instance"
import { RegisterValidationSchema,VerifyValidationSchema } from "./validation";

export const login = createAsyncThunk(
    "auth/admin/login",
     
    async (payload, { rejectWithValue }) => {
        try {
            const response = await api.post("auth/login", payload)

            const {data} = response

            const token = response.headers.authorization.split(" ")[1]

            localStorage.setItem("token", token)

            alert(response?.data?.message)
            
            return data
        } catch (error) {
            alert(error.response?.data?.message)

            return rejectWithValue(error.response?.data?.message)
        }
    }
)

export const keepLogin = createAsyncThunk (
    "auth/admin/keep-login",

    async (payload, { rejectWithValue }) =>{
        try {
            const {data} = await api.get("/auth/keep-login")
            return data
        } catch (error) {
            alert(error.response?.data?.message)

            return rejectWithValue(error.response.data.message)
        }
    }
)

export const logout = createAsyncThunk(
    "",
    async (payload, { rejectWithValue }) => {
        try {
            localStorage.removeItem("token")

            alert("Logout Sucess")
        } catch (error) {
            alert(error.response ? error.response.data : error)

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
            
        } catch (error) {
            alert(error.response?.data?.message)

            return rejectWithValue(error.response?.data?.message)
        }
    }
)

export const verify = createAsyncThunk(
    "auth/admin/verify",
    async (payload, { rejectWithValue }) => {
        try {
            const {token} = payload
            console.log(token)
            delete payload.token
            console.log(payload)
            await VerifyValidationSchema.validate(payload)
            const response = await api.post("auth/verify", payload, {headers : {"Authorization": `Bearer ${token}`}})
            const newToken = response.headers.authorization.split(" ")[1]

            const {data} = response
        
            alert(response?.data?.message)
            return data
            
        } catch (error) {
            alert(error.response?.data?.message)

            return rejectWithValue(error.response?.data?.message)
        }
    }
)