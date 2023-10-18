import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api.instance";
import { toast } from "react-toastify"

export const getAddress = createAsyncThunk(
    "address/getAddress",
    async (payload, { rejectWithValue }) => {
        try {
            const {page, name} = payload

            let PARAMETER = "?"

            if(page) PARAMETER += `page=${page ? page : 1 }&`
            
            if(name) PARAMETER += `name=${name}&`

            const { data } = await api.get("/address" + encodeURI(PARAMETER))

            return data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message)
        }
    }
)

export const addAddress = createAsyncThunk(
    "address/addAddress",
    async (payload, { rejectWithValue }) => {
        try {

            await api.post("/address/", payload)
            toast.success("Yay! Alamat berhasil ditambahkan!")

        } catch (error) {
            toast.error(error.response.data.message)
            return rejectWithValue(error.response?.data?.message)
        }
    }
)

export const updateAddress = createAsyncThunk(
    "address/updateAddress",
    async (payload, { rejectWithValue }) => {
        try {
            const { addressId, inputAddressData } = payload

            await api.patch(`/address/${addressId}`, inputAddressData)
            toast.success("Yay! Alamat berhasil diubah!")

        } catch (error) {
            toast.error(error.response.data.message)
            return rejectWithValue(error.response?.data?.message)
        }
    }
)

export const updatePrimaryAddress = createAsyncThunk(
    "address/updatePrimaryAddress",
    async (payload, { rejectWithValue }) => {
        try {

            await api.patch("/address/update-primary/" + payload)
            toast.success("Yay! Alamat utama berhasil diubah!")

        } catch (error) {
            toast.error(error.response.data.message)
            return rejectWithValue(error.response?.data?.message)
        }
    }
)

export const deleteAddress = createAsyncThunk(
    "address/deleteAddress",
    async (payload, { rejectWithValue }) => {
        try {

            await api.patch("/address/delete/" + payload)
            toast.success("Yay! Alamat berhasil dihapus!")

        } catch (error) {
            toast.error(error.response.data.message)
            return rejectWithValue(error.response?.data?.message)
        }
    }
)

export const listProvince = createAsyncThunk(
    "address/province",

    async (payload, { rejectWithValue }) => {
        try {

          const response = await api.get("/address/province")

            const {data} = response

            return data
        } catch (error) {
            alert(error.response?.data?.message)

            return rejectWithValue(error.response?.data?.message)
        }
    }
)

export const listCity = createAsyncThunk(
    "address/city",

    async (payload, { rejectWithValue }) => {
        try {
            const response = await api.get(`/address/city?province=${payload?.province}`)

            const {data} = response

            return data
            
        } catch (error) {
            alert(error.response?.data?.message)

            return rejectWithValue(error.response?.data?.message)
        }
    }
)

export const getShippingCost= createAsyncThunk(
    "address/cost",
    async (payload, { rejectWithValue }) => {
        try {
            const {data} = await api.post("/address/shipping-cost", payload)
            
            return data

        } catch (error) {
            toast.error(error.response?.data?.message)

            return rejectWithValue(error.response?.data?.message)
        }
    }
)

export const resetSuccessAddress = () => ({
    type: "address/resetSuccessAddress",
});
