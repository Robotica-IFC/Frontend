import api from "./config"

const authApi = {
    login(credentials) {
        return api.post('token/', credentials)
    },
    refresh(refreshToken) {
        return api.post('token/refresh/', { refresh: refreshToken })
    }
}

export default authApi