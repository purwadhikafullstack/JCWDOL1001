import { createSlice } from "@reduxjs/toolkit";
import {
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
  getProductById,
  updateMainStock,

} from "./slices";

const INITIAL_STATE = {
  data: [],
  productDetail: null,
  message: null,
  errorMessage:null,
  success: false,
  total_page: null,
  current_page: null,
  //next_page: null,
  isGetProductsLoading: false,
  isSubmitProductLoading: false,
  isDeleteProductLoading: false,
  isSubmitStockLoading: false,
};

const productsSlice = createSlice({
  name: "products",
  initialState: INITIAL_STATE,
  reducers: {
    resetSuccessProduct: (state, action) => {
      state.success = false;
      state.errorMessage = null;
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
        state.total_page = action.payload.totalPage;
        state.current_page = action.payload.currentPage;
        // state.next_page = action.payload.next_page;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isGetProductsLoading = false;
        state.data = action.payload.data;
      })

      .addCase(getProductById.pending, (state, action) => {
        state.isGetProductsLoading = true;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.isGetProductsLoading = false;
        state.productDetail = action.payload.data;
      })
      .addCase(getProductById.rejected, (state, action) => {
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
      })
      .addCase(updateMainStock.pending, (state, action) => {
        state.isSubmitStockLoading = true;
      })
      .addCase(updateMainStock.fulfilled, (state, action) => {
        state.isSubmitStockLoading= false;
        state.success = true;
      })
      .addCase(updateMainStock.rejected, (state, action) => {
        state.isSubmitStockLoading = false;
        state.errorMessage = action.payload;
      });
  },
});

export default productsSlice.reducer;
