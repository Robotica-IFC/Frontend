import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTemplateStore = defineStore('template', () => {
  const sign = ref(0)
  const changePassword = ref(0)
  const teacherOrStudent = ref(true)
  const panel = ref(true)
  const sidebar = ref(false)

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
    formatDate,
  }
})
