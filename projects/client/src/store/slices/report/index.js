import { createSlice } from "@reduxjs/toolkit"
import { getReport } from "./slices"

const INITIAL_STATE = {
    list : [],
    totalPage: "",
    currentPage: "",
    isGetReportListLoading : false
}

const reportSlice = createSlice({
    name : "report",
    initialState : INITIAL_STATE,
    reducers : {

    },
    extraReducers: {
        [getReport.pending] : (state, action) => {
            state.isGetTransactionLoading = true
        },
        [getReport.fulfilled] : (state, action) => {
            state = Object.assign(state, {
                list : action.payload.report,
                // totalPage : action.payload?.totalPage,
                // currentPage : action.payload?.currentPage,
                isGetReportListLoading : false
            })
        },
        [getReport.rejected] : (state, action) => {
            state.isGetTransactionLoading = false
        },
    }
})

export default reportSlice.reducer