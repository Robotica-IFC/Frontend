import api from './config'
import { beginRequest } from '../utils/requestLoading.js'
import axios from 'axios' // Importe o axios puro para a rota de refresh

const authApi = {
  verifyEmail(email, codigo) {
    return api.post('verificar-email/', { email, codigo })
  },
  resendVerificationCode(email) {
    return api.post('reenviar-codigo/', { email })
  },
  login(credentials) {
    return api.post('token/', credentials)
  },

  refresh(payload) {
    const finish = beginRequest()
    return axios.post(`${api.defaults.baseURL}token/refresh/`, payload, {
      timeout: 30000,
      headers: {
        Authorization: undefined,
      },
    }).finally(finish)
  },
}

export default authApi
