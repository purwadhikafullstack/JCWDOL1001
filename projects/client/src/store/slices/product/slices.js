import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api.instance";
import { toast } from "react-toastify"

export const getProducts = createAsyncThunk(
  "products/getProducts",
  async (payload, { rejectWithValue }) => {
    try {

      // const {
      //   page,
      //   id_cat,
      //   product_name,
      //   sort_price,
      //   sort_name,
      //   limit
      // } = payload;
      // const PARAMETER = `page=${page}&id_cat=${id_cat}&sort_name=${sort_name}&sort_price=${sort_price}&product_name=${product_name}&limit=${limit}`;
      
      // const { data } = await api.get(`/products?` + encodeURI(PARAMETER));


      const { category_id, page, sort_name, sort_price, product_name, limit, promo} = payload;
      let query = "";

      if(page){
      query += `?page=${page}`;
      }
      if(category_id){
      query += `${query ? '&' : '?'}id_cat=${category_id}`;
      }
      if(sort_name){
      query += `${query ? '&' : '?'}sort_name=${sort_name}`;
      }
      if(sort_price){
      query += `${query ? '&' : '?'}sort_price=${sort_price}`;
      }
      if(product_name){
      query += `${query ? '&' : '?'}product_name=${product_name}`;
      }
      if(limit){
      query += `${query ? '&' : '?'}limit=${limit}`;
      }
      if(promo){
      query += `${query ? '&' : '?'}promo=${promo}`;
      }
      const { data } = await api.get(`/products${query}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const getProductById = createAsyncThunk(
  "products/getProductDiscount",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/products/" + encodeURI(payload));

      return data;
    } catch (error) {
      toast.error(error.response.data.message)
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const getProductDiscount = createAsyncThunk(
  "products/getProductById",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/products/discount");

      return data;
    } catch (error) {
      toast.error(error.response.data.message)
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (payload, { rejectWithValue }) => {
    try {
      await api.post("/products", payload);
    } catch (error) {
      toast.error(error.response.data.message)
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      await api.patch(`/products/${encodeURI(id)}`, formData);
    } catch (error) {
      toast.error(error.response.data.message)
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (payload, { rejectWithValue }) => {
    try {
      await api.patch("/products/delete/" + encodeURI(payload));
    } catch (error) {
      toast.error(error.response.data.message)
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const resetSuccessProduct = () => ({
  type: "products/resetSuccessProduct",
});

export const updateMainStock = createAsyncThunk(
  "products/updateMainStock",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.patch("/products/stock/update", payload);
      return data.message

    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);