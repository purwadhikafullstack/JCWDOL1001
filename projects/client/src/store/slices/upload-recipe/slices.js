import { createAsyncThunk } from "@reduxjs/toolkit"
import api from "../../utils/api.instance"
import { toast } from 'react-toastify';


export const uploadRecipe = createAsyncThunk(
  "upload-recipe",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/upload-recipe",payload)

      toast.success(data?.message, 
          {
              position: "top-center",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true,
              progress: undefined,
              theme: "light",
          }
      )

      return data
    } catch (error) {
      toast.error(error.response.data.message, 
          {
              position: "top-center",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true,
              progress: undefined,
              theme: "light",
          }
      )
      return rejectWithValue(error.response.data.message)
    }
  }
);