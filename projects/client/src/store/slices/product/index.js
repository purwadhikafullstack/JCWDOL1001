import { createSlice } from "@reduxjs/toolkit";
import {
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
} from "./slices";

const INITIAL_STATE = {
  data: [],
  message: null,
  errorMessage:null,
  success: false,
  total_pages: null,
  current_page: null,
  next_page: null,
  isGetProductsLoading: false,
  isSubmitProductLoading: false,
  isDeleteProductLoading: false,
};

const productsSlice = createSlice({
  name: "products",
  initialState: INITIAL_STATE,
  reducers: {
    resetSuccessProduct: (state, action) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state, action) => {
        state.isGetProductsLoading = true;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isGetProductsLoading = false;
        state.data = action.payload.data;
        // state.total_pages = action.payload.total_pages;
        // state.current_page = action.payload.current_page;
        // state.next_page = action.payload.next_page;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isGetProductsLoading = false;
        state.data = action.payload.data;
      })

      .addCase(createProduct.pending, (state, action) => {
        state.isSubmitProductLoading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isSubmitProductLoading = false;
        state.success = true;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isSubmitProductLoading = false;
        state.errorMessage = action.payload;
      })

      .addCase(updateProduct.pending, (state, action) => {
        state.isSubmitProductLoading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isSubmitProductLoading = false;
        state.success = true;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isSubmitProductLoading = false;
        state.errorMessage = action.payload;
      })

      .addCase(deleteProduct.pending, (state, action) => {
        state.isDeleteProductLoading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isDeleteProductLoading = false;
        state.success = true;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isDeleteProductLoading = false;
      });
  },
});

export default productsSlice.reducer;
