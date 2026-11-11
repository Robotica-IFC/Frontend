import axios from 'axios'
import { beginRequest } from '../utils/requestLoading.js'
import { clearSessionTokens, getSessionToken } from '../utils/authSession.js'

const url = import.meta.env?.VITE_URL_BACKEND

const api = axios.create({
  timeout: 30000,
  baseURL: `${(url || 'http://127.0.0.1:8000/api/').replace(/\/+$/, '')}/`,
})

api.interceptors.request.use(
  (config) => {
    const token = getSessionToken('access_token')

    const publicAuth = ['token/', 'verificar-email/', 'reenviar-codigo/'].includes(config.url)
    if (token && !publicAuth) {
      config.headers.Authorization = `Bearer ${token}`
    }

    config.finishLoading = beginRequest()
    return config
  },
  (error) => {
    error.config?.finishLoading?.()
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response) => {
    response.config.finishLoading?.()
    return response
  },
  (error) => {
    error.config?.finishLoading?.()
    if (error.response?.status === 401 && error.config?.url !== 'token/') {
      clearSessionTokens()
      window.location.href = '/'
    }
    return Promise.reject(error)
  },
)

export default api
