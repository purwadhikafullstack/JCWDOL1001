import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api.instance"

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