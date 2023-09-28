import { createSlice } from "@reduxjs/toolkit"
import { 
    getForum,
    getPublicForum,
    deleteQuestion,
    PostQuestion
} from "./slices"

const INITIAL_STATE = {
    list : [],
    totalPage: "",
    currentPage: "",
    success : false,
    isLoading : false,
}

const reportSlice = createSlice({
    name : "forum",
    initialState : INITIAL_STATE,
    reducers : {

    },
    extraReducers: {
        [getForum.pending] : (state, action) => {
            state.isLoading = true
        },
        [getForum.fulfilled] : (state, action) => {
            state = Object.assign(state, {
                list : action.payload?.data,
                totalPage : action.payload?.totalPage,
                currentPage : action.payload?.currentPage,
                success : false,
                isLoading : false
            })
        },
        [getForum.rejected] : (state, action) => {
            state.isLoading = false
        },
        [getPublicForum.pending] : (state, action) => {
            state.isLoading = true
        },
        [getPublicForum.fulfilled] : (state, action) => {
            state = Object.assign(state, {
                list : action.payload?.data,
                totalPage : action.payload?.totalPage,
                currentPage : action.payload?.currentPage,
                isLoading : false
            })
        },
        [getPublicForum.rejected] : (state, action) => {
            state.isLoading = false
        },
        [deleteQuestion.pending] : (state, action) => {
            state.isLoading = true
        },
        [deleteQuestion.fulfilled] : (state, action) => {
            state = Object.assign(state, {
                isLoading :false,
                success : true
            })
        },
        [deleteQuestion.rejected] : (state, action) => {
            state.isLoading = false
        },
        [PostQuestion.pending] : (state, action) => {
            state.isLoading = true
        },
        [PostQuestion.fulfilled] : (state, action) => {
            state = Object.assign(state, {
                isLoading :false,
                success : true
            })
        },
        [PostQuestion.rejected] : (state, action) => {
            state.isLoading = false
        },
    }
})

export default reportSlice.reducer