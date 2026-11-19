import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useAuthStore } from './authStore'

export const useTemplateStore = defineStore('template', () => {
  const sign = ref(0)
  const changePassword = ref(0)
  const teacherOrStudent = ref(true)
  const panel = ref(true)
  const sidebar = ref(false)
  const authStore = useAuthStore()
  const themeKey = computed(() => {
    const userId = authStore.isAuthenticated ? authStore.user?.user_id : null
    return userId == null ? null : `robotica:theme:${userId}`
  })
  const darkMode = ref(false)
  watch(themeKey, (key) => {
    darkMode.value = key !== null && localStorage.getItem(key) === 'dark'
  }, { immediate: true, flush: 'sync' })

  function setDarkMode(enabled) {
    if (!themeKey.value) return
    darkMode.value = enabled
    localStorage.setItem(themeKey.value, enabled ? 'dark' : 'light')
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  return {
    sign,
    changePassword,
    teacherOrStudent,
    panel,
    sidebar,
    darkMode,
    setDarkMode,
    formatDate,
  }
})
