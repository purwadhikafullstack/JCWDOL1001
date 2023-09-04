import {createSlice} from "@reduxjs/toolkit";

import {
    getCategory,
    addCategory,
    deleteCategory,
    updateCategory,
    updateCategoryPicture
} from "./slices.js"

const INITIAL_STATE = {
    category : [],
    isLoading : false
}

const catSlice = createSlice({
    name : "cat",
    initialState : INITIAL_STATE,
    reducers : {

    },
    extraReducers : {
        [getCategory.pending] : (state, action) => {
            state.isLoading = true
        },
        [getCategory.fulfilled] : (state, action) => {
            state = Object.assign(state, {
                category : action.payload?.data?.category,
                isLoading : false
            })
        },
        [getCategory.rejected] : (state,action) => {
            state = Object.assign(state, {
                isLoading : false
            })
        },
        [addCategory.pending] : (state, action) => {
            state.isLoading = true
        },
        [addCategory.fulfilled] : (state, action) => {
            state.isLoading = false
        },
        [addCategory.rejected] : (state, action) => {
            state.isLoading = false
        },
        [deleteCategory.pending] : (state, action) => {
            state.isLoading = true
        },
        [deleteCategory.fulfilled] : (state, action) => {
            state.isLoading = false
        },
        [deleteCategory.rejected] : (state, action) => {
            state.isLoading = false
        },
        [updateCategory.pending] : (state, action) => {
            state.isLoading = true
        },
        [updateCategory.fulfilled] : (state, action) => {
            state.isLoading = false
        },
        [updateCategory.rejected] : (state, action) => {
            state.isLoading = false
        },
        [updateCategoryPicture.pending] : (state, action) => {
            state.isLoading = true
        },
        [updateCategoryPicture.fulfilled] : (state, action) => {
            state.isLoading = false
        },
        [updateCategoryPicture.rejected] : (state, action) => {
            state.isLoading = false
        }
    }
})

export default catSlice.reducer