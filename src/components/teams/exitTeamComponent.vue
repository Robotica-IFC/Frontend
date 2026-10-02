<script setup>
import { ref } from 'vue'
import { useTeamStore } from '@/store/teamStore'

const teamStore = useTeamStore()
const errorMessage = ref('')
const isLeaving = ref(false)

const props = defineProps({
  teamId: {
    type: [Number, String],
    required: true,
  },
})

function getErrorMessage(value) {
  if (typeof value === 'string') return value.trim()
  if (Array.isArray(value)) {
    return value.map(getErrorMessage).filter(Boolean).join(' ')
  }
  if (!value || typeof value !== 'object') return ''

  const messageKeys = ['detail', 'message', 'error', 'erro', 'non_field_errors']
  for (const key of messageKeys) {
    const message = getErrorMessage(value[key])
    if (message) return message
  }

  return Object.values(value).map(getErrorMessage).filter(Boolean).join(' ')
}

async function exitTeam() {
  errorMessage.value = ''
  isLeaving.value = true

  try {
    await teamStore.exitTeam(props.teamId)
    window.location.reload()
  } catch (error) {
    const responseData = error.response?.data
    errorMessage.value =
      getErrorMessage(responseData) ||
      error.message ||
      'Não foi possível sair da equipe. Tente novamente.'
  } finally {
    isLeaving.value = false
  }
}
</script>
<template>
  <div class="exit-team">
    <button type="button" :disabled="isLeaving" @click="exitTeam">
      <span class="mdi mdi-account-remove-outline"></span>
      {{ isLeaving ? 'Saindo...' : 'Sair da equipe' }}
    </button>
    <p v-if="errorMessage" class="error-message" role="alert">{{ errorMessage }}</p>
  </div>
</template>
<style scoped>
.exit-team {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

button {
  background-color: transparent;
  border: 1px solid var(--principal-claro);
  padding: 5px;
  border-radius: 10px;
  color: var(--principal-claro);
}

button:disabled {
  cursor: wait;
  opacity: 0.65;
}

.error-message {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: max-content;
  max-width: min(75vw, 320px);
  margin: 0;
  color: #b42318;
  font-size: 13px;
  text-align: right;
}
</style>
