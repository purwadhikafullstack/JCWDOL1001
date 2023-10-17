import {createAsyncThunk} from "@reduxjs/toolkit"
import api from "../../utils/api.instance"
import { toast } from 'react-toastify'

export const getForum = createAsyncThunk(
    "forum/getForum",
    async(payload, {rejectWithValue}) => {
        try{
            const { page, sortDate,filterQuestion } = payload

            let PARAMETER = "?"

            if(page) PARAMETER += `page=${page ? page : 1 }&`
            
            if(sortDate) PARAMETER += `sortDate=${sortDate}&`

            if(filterQuestion) PARAMETER += `filterQuestion=${filterQuestion}&`

            const { data } = await api.get("/forum" + encodeURI(PARAMETER))

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
            const { page, filterQuestion } = payload

            let PARAMETER = "?"

            if(page) PARAMETER += `page=${page ? page : 1 }&`

            if(filterQuestion) PARAMETER += `filterQuestion=${filterQuestion}&`

            const { data } = await api.get("/forum/public" + encodeURI(PARAMETER))

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
            const response = {}
            const result = await api.patch("/forum/"+payload)
            toast.success(result?.data?.message)
            const { data } = await api.get("/forum/admin")
            return data
            // if(window.location.pathname.split("/")[1]==="admin"){ response.data = await api.get("/forum/admin?")}
            // return response.data.data
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

export const getUnanswered = createAsyncThunk(
    "forum/getUnanswered",
    async(payload, {rejectWithValue}) => {
        try{
            const { page, sortDate,filterQuestion } = payload

            let PARAMETER = "?"

            if(page) PARAMETER += `page=${page ? page : 1 }&`
            
            if(sortDate) PARAMETER += `sortDate=${sortDate}&`

            if(filterQuestion) PARAMETER += `filterQuestion=${filterQuestion}&`

            const { data } = await api.get("/forum/admin" + encodeURI(PARAMETER))

            return data
        }catch(error){
            toast.error(error.response.data.message)
            return rejectWithValue(error.response.data)
        }
    }
)

export const PostAnswer = createAsyncThunk(
    "forum/answer",
    async(payload, {rejectWithValue}) => {
        try{
            const {sortDate} = payload
            delete payload?.sortDate
            await api.patch("/forum/", payload)
            const { data } = await api.get(`/forum/admin?sortDate=${sortDate}&`)
            toast.success(sortDate)
            return data
        }catch(error){
            toast.error(error.response.data.message)
            return rejectWithValue(error.response.data)
        }
    }
)

export const resetSuccessForum = () => ({
    type: "forum/resetSuccessForum",
  });