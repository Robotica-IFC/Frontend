import axios from "axios";

const url = import.meta.env.VITE_URL_BACKEND

const api = axios.create({
    baseURL: url ?? 'http://127.0.0.1:8000/api/'
})

export default api;