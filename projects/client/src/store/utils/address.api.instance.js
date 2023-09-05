import axios from "axios";

const addressApi = axios.create({
    baseURL : process.env.RAJAONGKIR_API_BASE_URL,
    timeout : 5000
})

addressApi.interceptors.request.use(
    (config) => {
        config.headers.key = process.env.RAJAONGKIR_API_KEY;
        return config;
    }
)

export default addressApi;