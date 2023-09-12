import { createAsyncThunk } from "@reduxjs/toolkit"
import api from "../../../utils/api.instance"
import { DeleteProductUnitValidationSchema, MakeConvertionProductUnitValidationSchema, ProductUnitValidationSchema, ReactivateProductUnitValidationSchema } from "./validation";

export const getUnits = createAsyncThunk(
  "units/getUnits",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/products/unit")

      return data
    } catch (error) {
      alert(error.response.data.message)
      return rejectWithValue(error.response.data.message)
    }
  }
);

export const deleteUnit = createAsyncThunk(
  "units/deleteUnit",
  async (payload, { rejectWithValue }) => {
    try {
      await DeleteProductUnitValidationSchema.validate(payload)
      
      const { data } = await api.patch("/products/unit/delete/" + encodeURI(payload.productId),payload)

      return data
      
    } catch (error) {
      alert(error.response.data.message)
      return rejectWithValue(error.response.data.message)
    }
  }
);

export const updateUnit = createAsyncThunk(
  "units/updateUnit",
  async (payload, { rejectWithValue }) => {
    try {
      await ProductUnitValidationSchema.validate(payload.data)

      const { data } = await api.patch("/products/unit/update/" + encodeURI(payload.productId),payload.data)

      return data

    } catch (error) {
      alert(error.response.data.message)
      return rejectWithValue(error.response.data.message)
    }
  }
);

export const resetUnit = createAsyncThunk(
  "units/resetSuccessUnit",
  async (payload, { rejectWithValue }) => {
    try {
    
    } catch (error) {
    
    }
  }
);

export const addUnit = createAsyncThunk(
  "units/addUnit",
  async (payload, { rejectWithValue }) => {
    try {
      await ProductUnitValidationSchema.validate(payload.data)
      
      const { data } = await api.post("/products/unit/" + encodeURI(payload.productId),payload.data)

      return data
    } catch (error) {
      alert(error.response.data.message)
      return rejectWithValue(error.response.data.message)
    }
  }
);

export const reactivateUnit = createAsyncThunk(
  "units/reactivateUnit",
  async (payload, { rejectWithValue }) => {
    try {
      await ReactivateProductUnitValidationSchema.validate(payload)

      const { data } = await api.patch("/products/unit/reactivate/" ,payload)

      return data
      
    } catch (error) {
      alert(error.response.data.message)
      return rejectWithValue(error.response.data.message)
    }
  }
);

export const convertUnit = createAsyncThunk(
  "units/convertUnit",
  async (payload, { rejectWithValue }) => {
    try {
      await MakeConvertionProductUnitValidationSchema.validate(payload)

      const { data } = await api.patch("/products/unit/make-convertion/" ,payload)

      return data
      
    } catch (error) {
      alert(error.response.data.message)
      return rejectWithValue(error.response.data.message)
    }
  }
);

