import axios from 'axios'

const url = import.meta.env.VITE_URL_BACKEND

const api = axios.create({
  baseURL: `${(url || 'http://127.0.0.1:8000/api/').replace(/\/+$/, '')}/`,
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')

    const publicAuth = ['token/', 'verificar-email/', 'reenviar-codigo/'].includes(config.url)
    if (token && !publicAuth) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && error.config?.url !== 'token/') {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      window.location.href = '/'
    }
    return Promise.reject(error)
  },
)

export default api
