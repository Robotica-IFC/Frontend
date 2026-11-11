<script setup>
import { ref, watch } from 'vue'
import api from '@/api/config'

const props = defineProps({
  teamId: { type: String, required: true },
})
const status = ref(null)
const loading = ref(false)
const error = ref('')
const success = ref('')

watch(() => props.teamId, async (teamId, _old, onCleanup) => {
  if (!teamId) return
  let active = true
  onCleanup(() => { active = false })
  status.value = null
  error.value = ''
  try {
    const { data } = await api.get(`/equipes/${teamId}/minha-solicitacao/`)
    if (active) status.value = data.status
  } catch {
    if (active) error.value = 'Não foi possível consultar sua solicitação.'
  }
}, { immediate: true })

async function requestEntry() {
  if (loading.value || status.value === 'P') return
  loading.value = true
  error.value = ''
  success.value = ''
  try {
    await api.post(`/equipes/${props.teamId}/solicitar/`)
    status.value = 'P'
    success.value = 'Solicitação enviada aos professores da equipe.'
  } catch (err) {
    error.value = err.response?.data?.detail || err.response?.data?.non_field_errors?.[0] || 'Não foi possível enviar a solicitação.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="request-entry">
    <button type="button" :disabled="loading || status === 'P'" @click="requestEntry">
      <span class="mdi mdi-account-plus-outline" aria-hidden="true"></span>
      {{ loading ? 'Enviando...' : status === 'P' ? 'Solicitação pendente' : 'Pedir para participar' }}
    </button>
    <p v-if="error" role="alert" class="request-error">{{ error }}</p>
    <p v-if="success" role="status" class="request-success">{{ success }}</p>
  </div>
</template>

<style scoped src="./requestToParticipateComponent.css"></style>
<style scoped>
.request-entry { display: grid; gap: 6px; }
.request-entry button { cursor: pointer; }
.request-entry button:disabled { opacity: .65; cursor: not-allowed; }
.request-entry p { margin: 0; font-size: 12px; }
.request-error { color: #b42318; }
.request-success { color: #187442; }
</style>
