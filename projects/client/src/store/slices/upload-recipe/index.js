import { createSlice } from "@reduxjs/toolkit";

import {
  uploadRecipe,
} from "./slices";

const INITIAL_STATE = {
  success: false,
  isLoading: false,
};

const uploadRecipeSlice = createSlice({
  name: "upload-recipe",
  initialState: INITIAL_STATE,
  reducers: {

  },
  extraReducers : {
      [uploadRecipe.pending] : (state, action) => {
        state.isLoading = true
      },
      [uploadRecipe.fulfilled] : (state, action) => {                                                                                                                                                                                                                                                                                                                                                                                                                                                 
        state = Object.assign(state, {
          isLoading : false,
          success : true
        })
      },
      [uploadRecipe.rejected] : (state, action) => {
        state.isLoading = false
      }
    }
});

export default uploadRecipeSlice.reducer;
