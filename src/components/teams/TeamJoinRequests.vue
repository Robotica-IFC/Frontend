<script setup>
import { ref, watch } from 'vue'
import api from '@/api/config'

const props = defineProps({
  teamId: { type: String, required: true },
})
const emit = defineEmits(['accepted'])
const requests = ref([])
const loading = ref(false)
const responding = ref(null)
const error = ref('')
const feedback = ref('')

async function refresh() {
  if (!props.teamId) return
  loading.value = true
  error.value = ''
  try {
    const { data } = await api.get(`/equipes/${props.teamId}/solicitacoes/`)
    requests.value = data
  } catch {
    error.value = 'Não foi possível carregar as solicitações.'
  } finally {
    loading.value = false
  }
}

async function respond(item, accept) {
  responding.value = item.id
  error.value = ''
  feedback.value = ''
  try {
    await api.post(`/equipes/${props.teamId}/solicitacoes/${item.id}/responder/`, { aceitar: accept })
    requests.value = requests.value.filter((request) => request.id !== item.id)
    feedback.value = accept ? 'Participante aceito na equipe.' : 'Solicitação recusada.'
    if (accept) emit('accepted')
  } catch (err) {
    error.value = err.response?.data?.detail || 'Não foi possível responder à solicitação.'
  } finally {
    responding.value = null
  }
}
watch(() => props.teamId, refresh, { immediate: true })
</script>

<template>
  <section class="entry-requests" aria-label="Solicitações de entrada">
    <div class="request-heading">
      <h3>Solicitações para entrar na equipe</h3>
      <button type="button" :disabled="loading" @click="refresh">
        <i class="mdi mdi-refresh" aria-hidden="true"></i> Atualizar
      </button>
    </div>
    <p v-if="loading" role="status">Carregando...</p>
    <p v-if="error" role="alert" class="error">{{ error }}</p>
    <p v-if="feedback" role="status">{{ feedback }}</p>
    <p v-if="!loading && !requests.length && !error">Nenhuma solicitação pendente.</p>
    <ul>
      <li v-for="item in requests" :key="item.id">
        <span>{{ item.nome }}</span>
        <div class="actions">
          <button type="button" :disabled="responding !== null" @click="respond(item, false)">Recusar</button>
          <button type="button" :disabled="responding !== null" @click="respond(item, true)">Aceitar</button>
        </div>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.entry-requests { margin: 18px 0 24px; border: 1px solid #d2e2eb; border-radius: 12px; padding: 16px; }
.request-heading, li, .actions { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
.request-heading h3 { margin: 0; color: #004369; font-size: 17px; }
ul { list-style: none; margin: 12px 0 0; padding: 0; }
li { padding: 12px 0; border-top: 1px solid #e1ebf0; }
button { background: #004369; color: white; border: none; border-radius: 7px; padding: 9px 12px; cursor: pointer; }
button:disabled { opacity: .6; cursor: not-allowed; }
.error { color: #b42318; }
</style>
