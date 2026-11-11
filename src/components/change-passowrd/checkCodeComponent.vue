<script setup>
import { onUnmounted, ref } from 'vue'
import verifyCodeComponent from '../verifyCodeComponent.vue'
import { useTemplateStore } from '@/store/template'
import { usePasswordResetStore } from '@/store/passwordResetStore'
import { formatApiError } from '@/utils/formValidation'

const emit = defineEmits(['busy'])
const store = useTemplateStore()
const reset = usePasswordResetStore()
const codigo = ref('')
const loading = ref(false)
const action = ref('')
const error = ref('')
const codeError = ref(false)
const message = ref('')
const remainingSeconds = ref(0)
function updateCountdown() {
  remainingSeconds.value = Math.max(0, Math.ceil((reset.cooldownDeadline() - Date.now()) / 1000))
}
updateCountdown()
const interval = setInterval(updateCountdown, 250)
onUnmounted(() => clearInterval(interval))

async function run(nextAction) {
  if (loading.value || (nextAction === 'resend' && remainingSeconds.value > 0)) return
  error.value = ''
  message.value = ''
  codeError.value = false
  if (nextAction === 'verify' && !/^[0-9]{6}$/.test(codigo.value)) {
    error.value = 'Digite os seis números do código.'
    codeError.value = true
    return
  }
  loading.value = true
  action.value = nextAction
  emit('busy', true)
  try {
    if (nextAction === 'verify') {
      await reset.verifyCode(codigo.value)
      store.changePassword = 2
    } else {
      await reset.requestCode()
      codigo.value = ''
      message.value = 'Enviamos um novo código para seu e-mail. Confira também a pasta de spam.'
    }
  } catch (err) {
    codeError.value = nextAction === 'verify'
    error.value = formatApiError(err, 'Não foi possível concluir. Tente novamente.')
  } finally {
    loading.value = false
    emit('busy', false)
    updateCountdown()
  }
}
function editCode() {
  if (codeError.value) error.value = ''
  codeError.value = false
}
function editEmail() {
  if (loading.value) return
  reset.token = ''
  store.changePassword = 0
}
</script>

<template>
  <form class="reset-form" novalidate @submit.prevent="run('verify')">
    <div class="email-destination">
      <span>{{ reset.email }}</span>
      <button
        class="edit-email"
        type="button"
        aria-label="Editar e-mail"
        title="Editar e-mail"
        :disabled="loading"
        @click="editEmail"
      >
        <span class="mdi mdi-pencil-outline" aria-hidden="true"></span>
      </button>
    </div>
    <verifyCodeComponent
      v-model="codigo"
      :invalid="codeError"
      :disabled="loading"
      :describedby="codeError ? 'reset-code-error' : 'reset-code-help'"
      @update:model-value="editCode"
    />
    <p v-if="error" id="reset-code-error" class="error" role="alert">{{ error }}</p>
    <p id="reset-code-help" class="feedback">
      O código expira em 10 minutos. Se não encontrar o e-mail na caixa de entrada, verifique a
      pasta de spam.
    </p>
    <p v-if="message" class="feedback" role="status">{{ message }}</p>
    <button
      class="resend-button"
      type="button"
      :disabled="loading || remainingSeconds > 0"
      @click="run('resend')"
    >
      {{
        loading && action === 'resend'
          ? 'Enviando código...'
          : remainingSeconds > 0
            ? `Reenviar código em ${remainingSeconds}s`
            : 'Reenviar código'
      }}
    </button>
    <button class="continue-button" type="submit" :disabled="loading">
      {{ loading && action === 'verify' ? 'Verificando código...' : 'Continuar' }}
    </button>
  </form>
</template>

<style scoped src="./passwordResetForm.css"></style>
<style scoped src="./checkCodeComponent.css"></style>
