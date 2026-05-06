import { defineStore } from 'pinia'
import authApi from '@/api/authApi'
import { computed, ref } from 'vue'
import router from '@/router'
import { jwtDecode } from "jwt-decode"

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref(localStorage.getItem('access_token') || null)
  const refreshToken = ref(localStorage.getItem('refresh_token') || null)
  const user = ref(JSON.parse(localStorage.getItem('user_data')) || null)

  const isAuthenticated = computed(() => !!accessToken.value)

  async function login(credentials) {
    try {
      const response = await authApi.login(credentials)
      const { access, refresh } = response.data

      const payload = jwtDecode(access)

      const userData = {
        id: payload.user_id,
        name: payload.name,
        username: payload.username,
        email: payload.email,
        tipo: payload.tipo,
        cpf: payload.cpf,
        telefone: payload.telefone,
        descricao: payload.descricao,
        imagem_perfil: payload.imagem_perfil,
        instituicao: payload.instituicao
      }

      accessToken.value = access
      refreshToken.value = refresh
      user.value = userData

      localStorage.setItem('access_token', access)
      localStorage.setItem('refresh_token', refresh)
      localStorage.setItem('user_data', JSON.stringify(userData))

      router.push('/test')
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  function logout() {
    accessToken.value = null
    refreshToken.value = null
    user.value = null
    localStorage.clear()
    router.push('/')
  }

  return {
    accessToken,
    isAuthenticated,
    user,
    login,
    logout,
  }
})