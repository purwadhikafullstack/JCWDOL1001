import {createAsyncThunk} from "@reduxjs/toolkit";
import api from "../../utils/api.instance";

export const getCategory = createAsyncThunk(
    "category/allcat",
    async(payload, {rejectWithValue}) => {
        try{
            const response = await api.get("/api/category");
            return response.data;
        }catch(error){
            return rejectWithValue(error.response.data);
        }
    }
)