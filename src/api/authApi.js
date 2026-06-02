import api from "./config"
import axios from "axios" // Importe o axios puro para a rota de refresh

const authApi = {
    login(credentials) {
        return api.post('token/', credentials)
    },
    
    refresh(payload) {
        return axios.post(`${api.defaults.baseURL}token/refresh/`, payload, {
            headers: {
                'Authorization': undefined
            }
        })
    }
}

export default authApi