import { defineStore } from 'pinia'
import authApi from '@/api/authApi'
import api from '@/api/config'
import { computed, ref } from 'vue'
import router from '@/router'
import { jwtDecode } from 'jwt-decode'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref(localStorage.getItem('access_token') || null)
  const refreshToken = ref(localStorage.getItem('refresh_token') || null)
  const user = ref(null)
  const pendingEmail = ref(sessionStorage.getItem('pending_email') || '')
  const pendingType = ref(sessionStorage.getItem('pending_type') || 'aluno')

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

    const cache = localStorage.getItem('user_profile_cache')
    if (cache && user.value) {
      user.value = { ...user.value, ...JSON.parse(cache) }
    }
  }

  function setPendingEmail(email, tipo = 'aluno') {
    pendingEmail.value = email
    pendingType.value = tipo
    sessionStorage.setItem('pending_email', email)
    sessionStorage.setItem('pending_type', tipo)
  }

  function clearPendingVerification() {
    pendingEmail.value = ''
    sessionStorage.removeItem('pending_email')
    sessionStorage.removeItem('pending_type')
  }

  async function verifyEmail(codigo) {
    if (!pendingEmail.value) throw new Error('Informe o e-mail da conta pendente.')
    const { data } = await authApi.verifyEmail(pendingEmail.value, codigo)
    accessToken.value = data.access
    refreshToken.value = data.refresh
    localStorage.removeItem('user_profile_cache')
    localStorage.setItem('access_token', data.access)
    localStorage.setItem('refresh_token', data.refresh)
    setUserFromToken(data.access)
    clearPendingVerification()
    await router.push('/home-page')
  }

  async function resendVerificationCode() {
    if (!pendingEmail.value) throw new Error('Informe o e-mail da conta pendente.')
    return authApi.resendVerificationCode(pendingEmail.value)
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
      if (error.response?.data?.code === 'email_not_verified') {
        setPendingEmail(credentials.email)
        await router.push('/verificar-email')
        return
      }
      console.error('Login failed:', error)
      throw error
    }
  }

  async function refreshAccessToken() {
    try {
      const rToken = localStorage.getItem('refresh_token')
      if (!rToken) {
        console.warn('Nenhum refresh token encontrado no localStorage')
        throw new Error('No refresh token')
      }

      const response = await authApi.refresh({ refresh: rToken })
      const { access } = response.data

      accessToken.value = access
      localStorage.setItem('access_token', access)
      setUserFromToken(access)

      return access
    } catch (e) {
      console.error('Erro ao atualizar token:', e.response?.data || e.message)
      logout()
      throw e
    }
  }

  async function refreshUserSession() {
    return await refreshAccessToken()
  }

  async function updateUserAccount(userId, data) {
    try {
      const response = await api.patch(`/usuarios/${userId}/`, data, {
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
        },
      })
      return response.data
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error)
      throw error
    }
  }

  function updateUserData(newData) {
    if (user.value) {
      user.value = { ...user.value, ...newData }
    }
  }

  function logout() {
    clearPendingVerification()
    accessToken.value = null
    refreshToken.value = null
    user.value = null
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.clear()
    router.push('/')
  }

  return {
    pendingEmail,
    pendingType,
    setPendingEmail,
    clearPendingVerification,
    verifyEmail,
    resendVerificationCode,
    accessToken,
    refreshToken,
    isAuthenticated,
    user,
    login,
    logout,
    refreshAccessToken,
    refreshUserSession,
    updateUserAccount,
    updateUserData,
  }
})
