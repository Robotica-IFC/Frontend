import { defineStore } from 'pinia'
import authApi from '@/api/authApi'
import { computed, ref } from 'vue'
import router from '@/router'
import { jwtDecode } from 'jwt-decode'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref(localStorage.getItem('access_token') || null)
  const refreshToken = ref(localStorage.getItem('refresh_token') || null)
  const user = ref(null)

  const isAuthenticated = computed(() => !!accessToken.value)

  function setUserFromToken(token) {
    try {
      const payload = jwtDecode(token)
      user.value = {
        id: payload.aluno_id || payload.professor_id,
        user_id: payload.user_id,
        name: payload.name,
        username: payload.username,
        email: payload.email,
        tipo: payload.tipo,
        cpf: payload.cpf,
        telefone: payload.telefone,
        descricao: payload.descricao,
        imagem_perfil: payload.imagem_perfil,
        instituicao: payload.instituicao,
      }
    } catch (e) {
      user.value = null
    }
  }

  if (accessToken.value) {
    setUserFromToken(accessToken.value)
  }

  async function login(credentials) {
    try {
      const response = await authApi.login(credentials)
      const { access, refresh } = response.data

      accessToken.value = access
      refreshToken.value = refresh

      setUserFromToken(access)

      localStorage.setItem('access_token', access)
      localStorage.setItem('refresh_token', refresh)

      router.push('/home-page')
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  async function refreshAccessToken() {
    try {
      if (!refreshToken.value) throw new Error('No refresh token')

      const response = await authApi.refresh({ refresh: refreshToken.value })
      const { access } = response.data

      accessToken.value = access
      localStorage.setItem('access_token', access)
      setUserFromToken(access)

      return access
    } catch (e) {
      logout()
    }
  }

  function updateUserData(newData) {
    if (user.value) {
      user.value = { ...user.value, ...newData }
    }
  }

  function logout() {
    accessToken.value = null
    refreshToken.value = null
    user.value = null
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    router.push('/')
  }

  return {
    accessToken,
    refreshToken,
    isAuthenticated,
    user,
    login,
    logout,
    refreshAccessToken,
    updateUserData
  }
})