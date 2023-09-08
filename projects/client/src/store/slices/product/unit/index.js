import { createSlice } from "@reduxjs/toolkit";
import {
  getUnits,
  deleteUnit,
  resetUnit,
  updateUnit,
  addUnit,
} from "./slices";

const INITIAL_STATE = {
  data: [],
  success: false,
  isGetUnitsLoading: false,
  isDeleteUnitLoading: false,
  isUpdateUnitLoading:false,
  isAddUnitLoading: false,
};

const unitsSlice = createSlice({
  name: "units",
  initialState: INITIAL_STATE,
  reducers: {

  },
  extraReducers : {
      [getUnits.pending] : (state, action) => {
        state.isGetUnitsLoading = true
      },
      [getUnits.fulfilled] : (state, action) => {                                                                                                                                                                                                                                                                                                                                                                                                                                                 
        state = Object.assign(state, {
          data : action.payload?.unit,
          isGetUnitsLoading : false,
        })
      },
      [getUnits.rejected] : (state, action) => {
        state.isGetUnitsLoading = true
      },
      [deleteUnit.pending] : (state, action) => {
        state = Object.assign(state, {
          isDeleteUnitLoading : true,
        })
      },
      [deleteUnit.fulfilled] : (state, action) => {                                                                                                                                                                                                                                                                                                                                                                                                                                                 
        state = Object.assign(state, {
            success : true,
            isDeleteUnitLoading : false,
        })
      },
      [deleteUnit.rejected] : (state, action) => {
        state = Object.assign(state, {
          isDeleteUnitLoading : false,
        })
      },
      [resetUnit.pending] : (state, action) => {
        state = Object.assign(state, {
          isDeleteUnitLoading : true,
        })
      },
      [resetUnit.fulfilled] : (state, action) => {                                                                                                                                                                                                                                                                                                                                                                                                                                                 
        state.success = false
      },
      [resetUnit.rejected] : (state, action) => {
        state = Object.assign(state, {
          isDeleteUnitLoading : false,
        })
      },
      [updateUnit.pending] : (state, action) => {
        state = Object.assign(state, {
          isUpdateUnitLoading : true,
        })
      },
      [updateUnit.fulfilled] : (state, action) => {                                                                                                                                                                                                                                                                                                                                                                                                                                                 
        state.isUpdateUnitLoading = false
      },
      [updateUnit.rejected] : (state, action) => {
        state = Object.assign(state, {
          isUpdateUnitLoading : false,
        })
      },
      [addUnit.pending] : (state, action) => {
        state = Object.assign(state, {
          isAddUnitLoading : true,
        })
      },
      [addUnit.fulfilled] : (state, action) => {                                                                                                                                                                                                                                                                                                                                                                                                                                                 
        state.isAddUnitLoading = false
      },
      [addUnit.rejected] : (state, action) => {
        state = Object.assign(state, {
          isAddUnitLoading : false,
        })
      },
    }
});

export default unitsSlice.reducer;
