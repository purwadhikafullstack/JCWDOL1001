import {createAsyncThunk} from "@reduxjs/toolkit"
import api from "../../utils/api.instance"
import { toast } from 'react-toastify'

export const getReport = createAsyncThunk(
    "report/allReport",
    async(payload, {rejectWithValue}) => {
        try{
            const { page, startFrom, endFrom } = payload
            
            let PARAMETER = "?"

            if(page) PARAMETER += `page=${page ? page : 1 }&`
            
            if(startFrom) PARAMETER += `startFrom=${startFrom}&endFrom=${endFrom}&`

            const { data } = await api.get("/report/" + payload.statusId + encodeURI(PARAMETER))

            return data
        }catch(error){
            toast.error(error.response.data.message)
            return rejectWithValue(error.response.data)
        }
    }
)
