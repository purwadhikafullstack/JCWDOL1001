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
    isLoading : false,
    isAddLoading : false,
    isDeleteLoading : false,
    isUpdateLoading : false
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
            state.isAddLoading = true
        },
        [addCategory.fulfilled] : (state, action) => {
            state.isAddLoading = false
        },
        [addCategory.rejected] : (state, action) => {
            state.isAddLoading = false
        },
        [deleteCategory.pending] : (state, action) => {
            state.isDeleteLoading = true
        },
        [deleteCategory.fulfilled] : (state, action) => {
            state.isDeleteLoading = false
        },
        [deleteCategory.rejected] : (state, action) => {
            state.isDeleteLoading = false
        },
        [updateCategory.pending] : (state, action) => {
            state.isUpdateLoading = true
        },
        [updateCategory.fulfilled] : (state, action) => {
            state.isUpdateLoading = false
        },
        [updateCategory.rejected] : (state, action) => {
            state.isUpdateLoading = false
        },
        [updateCategoryPicture.pending] : (state, action) => {
            state.isUpdateLoading = true
        },
        [updateCategoryPicture.fulfilled] : (state, action) => {
            state.isUpdateLoading = false
        },
        [updateCategoryPicture.rejected] : (state, action) => {
            state.isUpdateLoading = false
        }
    }
})

export default catSlice.reducer
