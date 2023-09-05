import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api.instance";
import axios from "axios";

export const getProducts = createAsyncThunk(
  "products/getProducts",
  async (payload, { rejectWithValue }) => {
    try {
      // const {
      //   category_id,
      //   page,
      //   sort_name,
      //   sort_price,
      //   limit,
      //   keywords,
      //   status,
      // } = payload;
      // const PARAMETER = `page=${page}&limit=${limit}&category_id=${category_id}&sort_name=${sort_name}&sort_price=${sort_price}&status=${status}&keywords=${keywords}`;
      // const { data } = await api.get("/products?" + encodeURI(PARAMETER));
      const { data } = await api.get("/products");

      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/products", payload);
      return data.message;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/products/${encodeURI(id)}`, formData);
      return data.message;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (payload, { rejectWithValue }) => {
    try {
      await api.patch("/products/delete/" + encodeURI(payload));
      // Toast.success("Category deleted successfully");
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const resetSuccessProduct = () => ({
  type: "products/resetSuccessProduct",
});
