import { defineStore } from 'pinia'
import authApi from '@/api/authApi'
import { computed, reactive } from 'vue'
import router from '@/router'
import { useStudentStore } from './studentStore'

export const useAuthStore = defineStore('auth', () => {
  const state = reactive({
    accessToken: null,
    refreshToken: null,
    user: null,
  })
  const studentStore = useStudentStore()

  const isAuthenticated = computed(() => !!state.accessToken)
  const user = computed(() => state.user)

  async function login(credentials) {
    try {
      const response = await authApi.login(credentials)
      state.accessToken = response.data.access
      state.refreshToken = response.data.refresh

      // Decodifica o Base64 do meio do Token
      const payload = JSON.parse(atob(state.accessToken.split('.')[1]))
      console.log("CONTEÚDO DO TOKEN:", payload);
      
      // Monta o objeto com os dados injetados pelo MyTokenObtainPairSerializer
      state.user = {
        id: payload.user_id,
        name: payload.name,
        username: payload.username,
        email: payload.email,
        tipo: payload.tipo,
        cpf: payload.cpf,
        telefone: payload.telefone,
        descricao: payload.descricao,
        imagem_perfil: payload.imagem_perfil
      }

      // Sincroniza o usuário logado com o meUser da outra store
      console.log('User logged in:', state.user) // Log para verificar os dados do usuário
      studentStore.state.meUser = state.user

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
    studentStore.state.meUser = null
    router.push('/')
  }

  return {
    isAuthenticated,
    user,
    login,
    logout,
  }
})