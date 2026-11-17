<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTemplateStore } from '@/store/template'
import { usePasswordResetStore } from '@/store/passwordResetStore'
import appInput from '../form/appInput.vue'
import { formatApiError } from '@/utils/formValidation'

const emit = defineEmits(['busy'])
const store = useTemplateStore()
const reset = usePasswordResetStore()
const router = useRouter()
const showPassword = ref(false)
const showConfirmation = ref(false)
const password = ref('')
const confirmation = ref('')
const touchedPassword = ref(false)
const touchedConfirmation = ref(false)
const loading = ref(false)
const error = ref('')
const passwordError = ref('')
const confirmationError = ref('')
const expired = ref(false)
const mismatch = computed(
  () =>
    (touchedConfirmation.value || confirmation.value.length > 0) &&
    password.value !== confirmation.value,
)
const shortPassword = computed(() => touchedPassword.value && password.value.length < 8)
const strength = computed(() => {
  if (!password.value) return 0
  return [
    password.value.length >= 8,
    /[a-z]/.test(password.value) && /[A-Z]/.test(password.value),
    /[0-9]/.test(password.value),
    /[^a-zA-Z0-9]/.test(password.value),
  ].filter(Boolean).length
})
const strengthLabel = computed(
  () => ['Muito fraca', 'Fraca', 'Razoável', 'Boa', 'Forte'][strength.value],
)

async function submit() {
  if (loading.value || expired.value) return
  touchedPassword.value = true
  touchedConfirmation.value = true
  if (shortPassword.value || mismatch.value || !confirmation.value) return
  error.value = ''
  passwordError.value = ''
  confirmationError.value = ''
  loading.value = true
  emit('busy', true)
  try {
    await reset.resetPassword(password.value, confirmation.value)
    password.value = ''
    confirmation.value = ''
    await router.replace('/')
  } catch (err) {
    const data = err.response?.data
    passwordError.value = data?.password?.join(' ') || ''
    confirmationError.value = data?.confirm_password?.join(' ') || ''
    expired.value = data?.code === 'password_reset_expired'
    if (!passwordError.value && !confirmationError.value)
      error.value = formatApiError(err, 'Não foi possível redefinir sua senha. Tente novamente.')
  } finally {
    loading.value = false
    emit('busy', false)
  }
}
function requestNewCode() {
  reset.token = ''
  store.changePassword = 1
}
</script>

<template>
  <div v-if="reset.completed" class="success" role="status">
    <span class="mdi mdi-check-circle-outline" aria-hidden="true"></span>
    <RouterLink class="continue-button" to="/">Voltar para entrar</RouterLink>
  </div>
  <form v-else class="reset-form" novalidate @submit.prevent="submit">
    <appInput
      v-model="password"
      :type="showPassword ? 'text' : 'password'"
      name="reset-password"
      autocomplete="new-password"
      placeholder="Digite uma nova senha"
      icon="mdi mdi-lock"
      :disabled="loading"
      :class="{ invalid: shortPassword || passwordError }"
      :aria-invalid="Boolean(shortPassword || passwordError)"
      aria-describedby="password-help password-error"
      @blur="touchedPassword = true"
      @input="passwordError = ''"
    >
      <button
        class="visibility-button"
        type="button"
        :disabled="loading"
        :aria-label="showPassword ? 'Ocultar nova senha' : 'Mostrar nova senha'"
        :aria-pressed="showPassword"
        @click="showPassword = !showPassword"
      >
        <span
          :class="showPassword ? 'mdi mdi-eye-outline' : 'mdi mdi-eye-off-outline'"
          aria-hidden="true"
        ></span>
      </button>
    </appInput>
    <div v-if="password" class="strength" :data-strength="strength">
      <div
        class="strength-track"
        role="meter"
        aria-label="Força da senha"
        aria-valuemin="0"
        aria-valuemax="4"
        :aria-valuenow="strength"
        :aria-valuetext="strengthLabel"
      >
        <span :style="{ width: `${Math.max(1, strength) * 25}%` }"></span>
      </div>
      <p>Força da senha: {{ strengthLabel }}</p>
    </div>
    <p id="password-help" class="password-help">
      Use pelo menos 8 caracteres. Combine letras, números e símbolos; evite senhas comuns e dados
      pessoais.
    </p>
    <p v-if="shortPassword || passwordError" id="password-error" class="error" role="alert">
      {{ passwordError || 'A senha deve ter pelo menos 8 caracteres.' }}
    </p>
    <appInput
      v-model="confirmation"
      :type="showConfirmation ? 'text' : 'password'"
      name="reset-confirm-password"
      autocomplete="new-password"
      class="confirmation-field"
      placeholder="Confirme a nova senha"
      icon="mdi mdi-lock"
      :disabled="loading"
      :class="{ invalid: mismatch || confirmationError }"
      :aria-invalid="Boolean(mismatch || confirmationError)"
      :aria-describedby="mismatch || confirmationError ? 'password-match-error' : undefined"
      @blur="touchedConfirmation = true"
      @input="confirmationError = ''"
    >
      <button
        class="visibility-button"
        type="button"
        :disabled="loading"
        :aria-label="
          showConfirmation ? 'Ocultar confirmação de senha' : 'Mostrar confirmação de senha'
        "
        :aria-pressed="showConfirmation"
        @click="showConfirmation = !showConfirmation"
      >
        <span
          :class="showConfirmation ? 'mdi mdi-eye-outline' : 'mdi mdi-eye-off-outline'"
          aria-hidden="true"
        ></span>
      </button>
    </appInput>
    <p v-if="mismatch || confirmationError" id="password-match-error" class="error" role="alert">
      {{ confirmationError || 'As senhas não coincidem.' }}
    </p>
    <p v-else-if="confirmation && password === confirmation" class="password-match" role="status">
      As senhas coincidem.
    </p>
    <p v-if="error" class="error" role="alert">{{ error }}</p>
    <button v-if="expired" class="continue-button" type="button" @click="requestNewCode">
      Solicitar novo código
    </button>
    <button v-else class="continue-button" type="submit" :disabled="loading">
      {{ loading ? 'Redefinindo senha...' : 'Continuar' }}
    </button>
  </form>
</template>

<style scoped src="./passwordResetForm.css"></style>
<style scoped src="./resetPasswordComponent.css"></style>
