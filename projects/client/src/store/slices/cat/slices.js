import {createAsyncThunk} from "@reduxjs/toolkit";
import api from "../../utils/api.instance";
import { CategoryValidationSchema } from "./validation";

export const getCategory = createAsyncThunk(
    "category/allcat",
    async(payload, {rejectWithValue}) => {
        try{
            const response = await api.get("/category");
            return response.data;
        }catch(error){
            return rejectWithValue(error.response.data);
        }
    }
)

export const addCategory = createAsyncThunk(
    "category/newcat",
    async(payload, {rejectWithValue}) => {
        try{
            const response = await api.post("/category",payload)
            alert("Category added!")
            return{}
        }catch(error){
            return rejectWithValue(error.response.data);
        }
    }
)

export const deleteCategory = createAsyncThunk(
    "category/removecat",
    async(payload, {rejectWithValue}) => {
        try{
            const response = await api.patch("/category/delete-category",payload)
            alert("Category deleted")
            return{}
        }catch(error){
            return rejectWithValue(error.response.data);
        }
    }
)

export const updateCategory = createAsyncThunk(
    "category/updatecat",
    async(payload, {rejectWithValue}) => {
        try{
            const response = await api.patch("/category",payload)
            alert("Category updated")
            return{}
        }catch(error){
            return rejectWithValue(error.response.data);
        }
    }
)

export const updateCategoryPicture = createAsyncThunk(
    "category/upcatpict",
    async(payload, {rejectWithValue}) => {
        try{
            const response = await api.patch(`/category/category-picture/${payload.categoryId}`,payload.formData)
            alert("Category Image updated")
            return{}
        }catch(error){
            return rejectWithValue(error.response.data);
        }
    }
)