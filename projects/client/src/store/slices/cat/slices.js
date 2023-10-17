import {createAsyncThunk} from "@reduxjs/toolkit";
import api from "../../utils/api.instance";
import { CategoryValidationSchema } from "./validation";
import { toast } from 'react-toastify';

export const getCategory = createAsyncThunk(
    "category/allcat",
    async(payload, {rejectWithValue}) => {
        try{
            const {page, limit, searchedCategory, sortCat} = payload
            let query = "";
            if(page){
                query += `?page=${page}`;
            }
            if(limit){
                query += `${query ? '&' : '?'}limit=${limit}`;
            }
            if(searchedCategory){
                query += `${query ? '&' : '?'}searchedCategory=${searchedCategory}`;
            }
            if(sortCat){
                query += `${query ? '&' : '?'}sortCat=${sortCat}`;
            }
            const response = await api.get(`/category${query}`);
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
            toast.success("Category Added")
            return{}
        }catch(error){
            toast.error(error.response.data.message)
            return rejectWithValue(error.response.data);
        }
    }
)

export const deleteCategory = createAsyncThunk(
    "category/removecat",
    async(payload, {rejectWithValue}) => {
        try{
            const response = await api.patch("/category/delete-category",payload)
            toast.success("Category deleted")
            return{}
        }catch(error){
            toast.error(error.response.data.message)
            return rejectWithValue(error.response.data);
        }
    }
)

export const updateCategory = createAsyncThunk(
    "category/updatecat",
    async(payload, {rejectWithValue}) => {
        try{
            await CategoryValidationSchema.validate(payload)
            const response = await api.patch("/category",payload)
            toast.success("Category updated")
            return{}
        }catch(error){
            toast.error(error.response.data.message)
            return rejectWithValue(error.response.data);
        }
    }
)

export const updateCategoryPicture = createAsyncThunk(
    "category/upcatpict",
    async(payload, {rejectWithValue}) => {
        try{
            const response = await api.patch(`/category/category-picture/${payload.categoryId}`,payload.formData)
            toast.success("Category Image updated")
            return{}
        }catch(error){
            toast.error(error.response.data.message)
            return rejectWithValue(error.response.data);
        }
    }
)