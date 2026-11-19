import api from './config'
import axios from 'axios' // Importe o axios puro para a rota de refresh

const authApi = {
  accountDeletionEligibility() {
    return api.get('usuarios/exclusao/')
  },
  deleteAccount() {
    return api.delete('usuarios/me/')
  },
  requestPasswordReset(email) {
    return api.post('recuperar-senha/', { email })
  },
  verifyPasswordResetCode(email, codigo) {
    return api.post('recuperar-senha/verificar-codigo/', { email, codigo })
  },
  resetPassword(email, token, password, confirm_password) {
    return api.post('redefinir-senha/', { email, token, password, confirm_password })
  },
  verifyEmail(email, codigo, registrationToken) {
    return api.post('verificar-email/', {
      email,
      codigo,
      ...(registrationToken ? { registration_token: registrationToken } : {}),
    })
  },
  resendVerificationCode(email, registrationToken) {
    return api.post('reenviar-codigo/', {
      email,
      ...(registrationToken ? { registration_token: registrationToken } : {}),
    })
  },
  login(credentials) {
    return api.post('token/', credentials)
  },

  refresh(payload) {
    return axios.post(`${api.defaults.baseURL}token/refresh/`, payload, {
      headers: {
        Authorization: undefined,
      },
    })
  },
}

export default authApi
