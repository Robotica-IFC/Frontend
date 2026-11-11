import { defineStore } from 'pinia'
import authApi from '@/api/authApi'
import api from '@/api/config'
import { computed, ref } from 'vue'
import router from '@/router'
import { jwtDecode } from 'jwt-decode'
import { useInvitesStore } from './invitesStore'
import { useNotificationsStore } from './notificationsStore'
import { useFormLimits } from '@/composables/useFormLimits'
import { getProfileImageUrl } from '@/utils/profileImage'
import { clearSessionTokens, getSessionToken, saveSessionToken } from '@/utils/authSession'


export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref(getSessionToken('access_token') || null)
  const refreshToken = ref(getSessionToken('refresh_token') || null)
  const user = ref(null)
  const pendingEmail = ref(sessionStorage.getItem('pending_email') || '')
  const pendingType = ref(sessionStorage.getItem('pending_type') || 'aluno')

  const isAuthenticated = computed(() => !!accessToken.value)

  function readCachedProfile() {
    try {
      const profile = JSON.parse(sessionStorage.getItem('user_profile_cache') || '{}')
      if (!profile || typeof profile !== 'object' || Array.isArray(profile)) return {}
      const imageUrl = getProfileImageUrl(profile.imagem_perfil)
      if (/^(blob:|data:)/.test(imageUrl)) delete profile.imagem_perfil
      return profile
    } catch {
      sessionStorage.removeItem('user_profile_cache')
      return {}
    }
  }

  function setUserFromToken(token) {
    try {
      const payload = jwtDecode(token)
      if (user.value?.user_id !== payload.user_id) useNotificationsStore().clear()
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
        ...readCachedProfile(),
      }
    } catch {
      user.value = null
    }
  }

  if (accessToken.value) {
    setUserFromToken(accessToken.value)
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
    sessionStorage.removeItem('user_profile_cache')
    saveSessionToken('access_token', data.access)
    saveSessionToken('refresh_token', data.refresh)
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
      sessionStorage.removeItem('user_profile_cache')
      setUserFromToken(access)
      saveSessionToken('access_token', access)
      saveSessionToken('refresh_token', refresh)
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
      const rToken = getSessionToken('refresh_token')
      if (!rToken) {
        console.warn('Nenhum refresh token encontrado no localStorage')
        throw new Error('No refresh token')
      }

      const response = await authApi.refresh({ refresh: rToken })
      const { access } = response.data

      accessToken.value = access
      saveSessionToken('access_token', access)
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
      await useFormLimits().assertValid('usuario', data)
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
      const profileData = { ...newData }
      if ('imagem_perfil' in profileData) {
        const imageUrl = getProfileImageUrl(profileData.imagem_perfil)
        if (/^(blob:|data:)/.test(imageUrl)) delete profileData.imagem_perfil
        else profileData.imagem_perfil = imageUrl
      }
      user.value = { ...user.value, ...profileData }
      const cachedProfile = readCachedProfile()
      sessionStorage.setItem(
        'user_profile_cache',
        JSON.stringify({ ...cachedProfile, ...profileData }),
      )
    }
  }

  async function refreshUserProfile() {
    const account = user.value
    const endpoint = { aluno: 'alunos', professor: 'professores' }[account?.tipo]
    if (!endpoint || !account.id) return null

    const { data } = await api.get(`${endpoint}/${account.id}/`)
    if (user.value?.user_id !== account.user_id) return null
    updateUserData({
      name: data.user?.name ?? account.name,
      username: data.user?.username ?? account.username,
      descricao: data.descricao,
      telefone: data.telefone,
      instituicao: data.instituicao,
      imagem_perfil: getProfileImageUrl(data.imagem_perfil),
    })
    return data
  }

  function logout() {
    useInvitesStore().clear()
    useNotificationsStore().clear()
    clearPendingVerification()
    accessToken.value = null
    refreshToken.value = null
    user.value = null
    clearSessionTokens()
    sessionStorage.removeItem('user_profile_cache')
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
    refreshUserProfile,
  }
})
