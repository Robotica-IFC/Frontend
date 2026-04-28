import { defineStore } from 'pinia'
import authApi from '@/api/authApi'
import { computed, reactive } from 'vue'
import router from '@/router'
import { useStudentStore } from './studentStore'

export const useAuthStore = defineStore('auth', () => {
  const state = reactive({
    accessToken: localStorage.getItem('access_token') || null,
    refreshToken: localStorage.getItem('refresh_token') || null,
    user: null, // Adicionar quando subir para o vercel JSON.parse(localStorage.getItem('user_data')) || null,
  })

  const isAuthenticated = computed(() => !!state.accessToken)
  const user = computed(() => state.user)

  async function login(credentials) {
    try {
      const response = await authApi.login(credentials)
      const access = response.data.access
      const refresh = response.data.refresh

      const payload = JSON.parse(decodeURIComponent(escape(atob(access.split('.')[1]))))

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
      }
      console.log(userData)

      // Salva no State
      state.accessToken = access
      state.refreshToken = refresh
      state.user = userData

      // Salva no LocalStorage para não deslogar no F5
      // localStorage.setItem('access_token', access)
      // localStorage.setItem('refresh_token', refresh)
      // localStorage.setItem('user_data', JSON.stringify(userData))

      router.push('/test')
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  function logout() {
    state.accessToken = null
    state.refreshToken = null
    state.user = null

    // localStorage.removeItem('access_token')
    // localStorage.removeItem('refresh_token')
    // localStorage.removeItem('user_data')

    router.push('/')
  }

  return {
    state, // Exportar o state caso precise de acesso direto
    isAuthenticated,
    user,
    login,
    logout,
  }
})
