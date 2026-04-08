import axios from "axios";

const url = import.meta.env.VITE_URL_BACKEND

const api = axios.create({
    baseURL: url
})

export default api;