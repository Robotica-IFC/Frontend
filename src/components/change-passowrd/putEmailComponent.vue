<script setup>
import { onMounted, ref } from 'vue'
import appInput from '../form/appInput.vue'
import { useTemplateStore } from '@/store/template'
import { usePasswordResetStore } from '@/store/passwordResetStore'
import { formatApiError } from '@/utils/formValidation'

const emit = defineEmits(['busy'])
const store = useTemplateStore()
const reset = usePasswordResetStore()
const email = ref(reset.email)
const loading = ref(false)
const error = ref('')

onMounted(() => {
  if (reset.email) {
    const input = document.getElementById('reset-email')
    input?.focus()
    input?.select()
  }
})

async function submit() {
  if (loading.value) return
  error.value = ''
  const address = email.value.trim()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) {
    error.value = 'Informe um e-mail válido.'
    return
  }
  loading.value = true
  emit('busy', true)
  try {
    await reset.requestCode(address)
    store.changePassword = 1
  } catch (err) {
    if (
      err.response?.status === 429 &&
      err.response.data?.retry_after &&
      address.toLowerCase() === reset.email
    ) {
      store.changePassword = 1
    } else {
      error.value = formatApiError(err, 'Não foi possível enviar o código. Tente novamente.')
    }
  } finally {
    loading.value = false
    emit('busy', false)
  }
}
</script>

<template>
  <form class="reset-form" novalidate @submit.prevent="submit">
    <appInput
      v-model="email"
      name="reset-email"
      type="email"
      autocomplete="email"
      placeholder="Digite seu E-mail"
      icon="mdi mdi-email-outline"
      :class="{ invalid: error }"
      :disabled="loading"
      :aria-invalid="Boolean(error)"
      :aria-describedby="error ? 'reset-email-error' : undefined"
      @input="error = ''"
    />
    <p v-if="error" id="reset-email-error" class="error" role="alert">{{ error }}</p>
    <button class="continue-button" type="submit" :disabled="loading">
      {{ loading ? 'Enviando código...' : 'Continuar' }}
    </button>
  </form>
</template>

<style scoped src="./passwordResetForm.css"></style>
<style scoped src="./putEmailComponent.css"></style>
