import {createAsyncThunk} from "@reduxjs/toolkit"
import api from "../../utils/api.instance"
import { toast } from 'react-toastify'

export const getForum = createAsyncThunk(
    "forum/getForum",
    async(payload, {rejectWithValue}) => {
        try{
            const { page, sortDate,filterName } = payload

            let PARAMETER = "?"

            if(page) PARAMETER += `page=${page ? page : 1 }&`
            
            if(sortDate) PARAMETER += `sortDate=${sortDate}&`

            if(filterName) PARAMETER += `filterName=${filterName}&`

            const { data } = await api.get("/forum"+ encodeURI(PARAMETER))

            return data
        }catch(error){
            toast.error(error.response.data.message)
            return rejectWithValue(error.response.data)
        }
    }
)

export const getPublicForum = createAsyncThunk(
    "forum/forPublic",
    async(payload, {rejectWithValue}) => {
        try{

            const { data } = await api.get("/forum/public")

            return data
        }catch(error){
            toast.error(error.response.data.message)
            return rejectWithValue(error.response.data)
        }
    }
)

export const deleteQuestion = createAsyncThunk(
    "forum/delete",
    async(payload, {rejectWithValue}) => {
        try{

            const { data } = await api.patch("/forum/"+payload)
            toast.success(data.message)
            return data
        }catch(error){
            toast.error(error.response.data.message)
            return rejectWithValue(error.response.data)
        }
    }
)

export const AnswerQuestion = createAsyncThunk(
    "forum/answer",
    async(payload, {rejectWithValue}) => {
        try{

            const { data } = await api.post("/forum/"+payload.qnaId, payload.answer)

            return data
        }catch(error){
            toast.error(error.response.data.message)
            return rejectWithValue(error.response.data)
        }
    }
)

export const PostQuestion = createAsyncThunk(
    "forum/post",
    async(payload, {rejectWithValue}) => {
        try{

            const { data } = await api.post("/forum/",payload)

            return data
        }catch(error){
            toast.error(error.response.data.message)
            return rejectWithValue(error.response.data)
        }
    }
)
