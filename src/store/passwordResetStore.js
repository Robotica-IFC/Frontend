import { defineStore } from 'pinia'
import { ref } from 'vue'
import authApi from '@/api/authApi'

export const usePasswordResetStore = defineStore('passwordReset', () => {
  const email = ref(sessionStorage.getItem('password_reset_email') || '')
  // A autorização fica apenas em memória; a senha nunca é armazenada.
  const token = ref('')
  const completed = ref(false)
  const cooldownKey = (address) => `password_reset_resend_until:${address.trim().toLowerCase()}`

  function cooldownDeadline(address = email.value) {
    return Number(sessionStorage.getItem(cooldownKey(address))) || 0
  }

  function startCooldown(seconds = 60, address = email.value) {
    sessionStorage.setItem(cooldownKey(address), String(Date.now() + seconds * 1000))
  }

  async function requestCode(address = email.value) {
    const normalized = address.trim().toLowerCase()
    try {
      await authApi.requestPasswordReset(normalized)
    } catch (error) {
      const remaining = error.response?.data?.retry_after
      if (error.response?.status === 429 && remaining) startCooldown(remaining, normalized)
      throw error
    }
    email.value = normalized
    token.value = ''
    completed.value = false
    sessionStorage.setItem('password_reset_email', normalized)
    startCooldown()
  }

  async function verifyCode(codigo) {
    const { data } = await authApi.verifyPasswordResetCode(email.value, codigo)
    token.value = data.token
  }

  async function resetPassword(password, confirmation) {
    await authApi.resetPassword(email.value, token.value, password, confirmation)
    token.value = ''
    completed.value = true
    sessionStorage.removeItem('password_reset_email')
    sessionStorage.removeItem(cooldownKey(email.value))
    email.value = ''
  }

  return { email, token, completed, cooldownDeadline, requestCode, verifyCode, resetPassword }
})
