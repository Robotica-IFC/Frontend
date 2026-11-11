<script setup>
import { ref } from 'vue'
import { useTeamStore } from '@/store/teamStore'
import { useConfirmation } from '@/composables/useConfirmation'

const teamStore = useTeamStore()
const { confirm } = useConfirmation()
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

async function confirmExit() {
  await confirm({
    title: 'Sair da equipe?',
    message: 'Você perderá o acesso às ações e ao estoque da equipe. Para voltar, será necessário aceitar um novo convite. Se você é o OWNER, transfira a responsabilidade antes de sair.',
    confirmLabel: 'Sair da equipe',
    onConfirm: exitTeam,
  })
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
    throw error
  } finally {
    isLeaving.value = false
  }
}
</script>
<template>
  <div class="exit-team">
    <button type="button" :disabled="isLeaving" @click="confirmExit">
      <span class="mdi mdi-account-remove-outline"></span>
      {{ isLeaving ? 'Saindo...' : 'Sair da equipe' }}
    </button>
    <p v-if="errorMessage" class="error-message" role="alert">{{ errorMessage }}</p>
  </div>
</template>
<style scoped src="./exitTeamComponent.css"></style>
