import { createSlice } from "@reduxjs/toolkit";
import {
  getUnits,
  deleteUnit,
  resetUnit,
  updateUnit,
  addUnit,
  reactivateUnit,
  convertUnit,
} from "./slices";

const INITIAL_STATE = {
  data: [],
  success: false,
  isLoading: false,
};

const unitsSlice = createSlice({
  name: "units",
  initialState: INITIAL_STATE,
  reducers: {

  },
  extraReducers : {
      [getUnits.pending] : (state, action) => {
        state.isLoading = true
      },
      [getUnits.fulfilled] : (state, action) => {                                                                                                                                                                                                                                                                                                                                                                                                                                                 
        state = Object.assign(state, {
          data : action.payload?.unit,
          isLoading : false,
        })
      },
      [getUnits.rejected] : (state, action) => {
        state.isLoading = true
      },
      [deleteUnit.pending] : (state, action) => {
        state = Object.assign(state, {
          isLoading : true,
        })
      },
      [deleteUnit.fulfilled] : (state, action) => {                                                                                                                                                                                                                                                                                                                                                                                                                                                 
        state = Object.assign(state, {
          success : true,
          isLoading : false,
        })
      },
      [deleteUnit.rejected] : (state, action) => {
        state = Object.assign(state, {
          isLoading : false,
        })
      },
      [resetUnit.pending] : (state, action) => {
        state = Object.assign(state, {
          isLoading : true,
        })
      },
      [resetUnit.fulfilled] : (state, action) => {                                                                                                                                                                                                                                                                                                                                                                                                                                                 
        state = Object.assign(state, {
          success : false,
          isLoading : false,
        })
      },
      [resetUnit.rejected] : (state, action) => {
        state = Object.assign(state, {
          isLoading : false,
        })
      },
      [updateUnit.pending] : (state, action) => {
        state = Object.assign(state, {
          isLoading : true,
        })
      },
      [updateUnit.fulfilled] : (state, action) => {                                                                                                                                                                                                                                                                                                                                                                                                                                                 
        state = Object.assign(state, {
          success : true,
          isLoading : false,
        })
      },
      [updateUnit.rejected] : (state, action) => {
        state = Object.assign(state, {
          isLoading : false,
        })
      },
      [addUnit.pending] : (state, action) => {
        state = Object.assign(state, {
          isLoading : true,
        })
      },
      [addUnit.fulfilled] : (state, action) => {                                                                                                                                                                                                                                                                                                                                                                                                                                                 
        state = Object.assign(state, {
          success : true,
          isLoading : false,
        })
      },
      [addUnit.rejected] : (state, action) => {
        state = Object.assign(state, {
          isLoading : false,
        })
      },
      [reactivateUnit.pending] : (state, action) => {
        state = Object.assign(state, {
          isLoading : true,
        })
      },
      [reactivateUnit.fulfilled] : (state, action) => {                                                                                                                                                                                                                                                                                                                                                                                                                                                 
        state = Object.assign(state, {
          success : true,
          isLoading : false,
        })
      },
      [reactivateUnit.rejected] : (state, action) => {
        state = Object.assign(state, {
          isLoading : false,
        })
      },
      [convertUnit.pending] : (state, action) => {
        state = Object.assign(state, {
          isLoading : true,
        })
      },
      [convertUnit.fulfilled] : (state, action) => {                                                                                                                                                                                                                                                                                                                                                                                                                                                 
        state = Object.assign(state, {
          success : true,
          isLoading : false,
        })
      },
      [convertUnit.rejected] : (state, action) => {
        state = Object.assign(state, {
          isLoading : false,
        })
      },
    }
});

export default unitsSlice.reducer;
