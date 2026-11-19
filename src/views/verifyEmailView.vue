<script setup>
import { onUnmounted, ref } from 'vue'
import verifyCodeComponent from '@/components/verifyCodeComponent.vue'
import stepComponent from '@/components/stepComponent.vue'
import AuthLayout from '@/components/layout/AuthLayout.vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/authStore'
import { useTemplateStore } from '@/store/template'
const auth = useAuthStore()
const router = useRouter()
const email = ref(auth.pendingEmail)
const codigo = ref('')
const loading = ref(false)
const loadingAction = ref('')
const remainingSeconds = ref(0)
let cooldownDeadline = 0
const cooldownKey = () => `verification_resend_until:${email.value.trim().toLowerCase()}`

function updateCountdown() {
  remainingSeconds.value = Math.max(0, Math.ceil((cooldownDeadline - Date.now()) / 1000))
}

function startCooldown() {
  cooldownDeadline = Date.now() + 60000
  sessionStorage.setItem(cooldownKey(), String(cooldownDeadline))
  updateCountdown()
}

if (email.value) {
  const savedDeadline = Number(sessionStorage.getItem(cooldownKey()))
  if (Number.isFinite(savedDeadline) && savedDeadline > 0) {
    cooldownDeadline = savedDeadline
    updateCountdown()
  } else {
    startCooldown()
  }
}
const countdownInterval = setInterval(updateCountdown, 250)
onUnmounted(() => clearInterval(countdownInterval))
const error = ref('')
const message = ref('')
const expired = ref(false)

function restartRegistration() {
  auth.clearPendingVerification()
  useTemplateStore().sign = 0
  router.push('/sign')
}

async function run(action) {
  if (loading.value || (action === 'resend' && remainingSeconds.value > 0)) return
  error.value = ''
  message.value = ''
  if (!email.value.trim()) {
    error.value = 'Informe seu e-mail.'
    return
  }
  auth.setPendingEmail(email.value.trim(), auth.pendingType)
  loading.value = true
  loadingAction.value = action
  try {
    if (action === 'verify') {
      if (!/^[0-9]{6}$/.test(codigo.value)) {
        error.value = 'Digite os seis números do código.'
        return
      }
      await auth.verifyEmail(codigo.value)
    } else {
      const response = await auth.resendVerificationCode()
      startCooldown()
      codigo.value = ''
      message.value =
        response.data.detail || 'Enviamos um novo código para seu e-mail. Confira também o spam.'
    }
  } catch (err) {
    const data = err.response?.data
    expired.value = data?.code === 'registration_expired'
    if (
      action === 'resend' &&
      err.response?.status === 429 &&
      data?.detail?.includes('60 segundos')
    ) {
      startCooldown()
    }
    error.value =
      data?.detail ||
      (data ? Object.values(data).flat().join(' ') : err.message) ||
      'Não foi possível concluir. Tente novamente.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AuthLayout
    title="Verifique o código"
    :subtitle="
      auth.pendingRegistrationToken
        ? 'Confirme seu e-mail para concluir o cadastro.'
        : 'Digite o código que enviamos para seu e-mail.'
    "
    icon="mdi-email-check-outline"
    :busy="loading"
    :loading-message="
      loadingAction === 'resend' ? 'Enviando seu código...' : 'Verificando seu código...'
    "
    @back="router.push('/')"
  >
    <form class="verification-form" :inert="loading" @submit.prevent="!expired && run('verify')">
      <div v-if="!auth.pendingEmail" class="email-field">
        <label for="verification-email">E-mail da conta</label>
        <input
          id="verification-email"
          v-model="email"
          type="email"
          autocomplete="email"
          required
          :disabled="loading"
        />
      </div>
      <verifyCodeComponent
        v-model="codigo"
        :disabled="loading"
        :invalid="Boolean(error)"
        :describedby="error ? 'verification-error' : undefined"
        @update:model-value="error = ''"
      />
      <p class="feedback">
        Se o e-mail com o código não chegar à caixa de entrada principal, verifique a pasta de spam.
      </p>
      <p v-if="auth.pendingRegistrationToken" class="feedback">
        Sua conta só será criada após a confirmação do código.
      </p>
      <p v-if="error" id="verification-error" role="alert" class="feedback error">{{ error }}</p>
      <p v-if="message" role="status" class="feedback">{{ message }}</p>
      <div class="actions">
        <button
          class="resend-button"
          type="button"
          :disabled="loading || expired || remainingSeconds > 0"
          @click="run('resend')"
        >
          {{ remainingSeconds > 0 ? `Reenviar em ${remainingSeconds}s` : 'Reenviar Código' }}
        </button>
        <button v-if="expired" type="button" @click="restartRegistration">
          Iniciar novo cadastro
        </button>
        <button v-else type="submit" :disabled="loading">
          {{
            loading
              ? 'Aguarde...'
              : auth.pendingRegistrationToken
                ? 'Confirmar e criar conta'
                : 'Continuar'
          }}
        </button>
      </div>
    </form>

    <template #progress>
      <stepComponent
        :step="3"
        first="Inserir dados"
        second="Perfil"
        third="Verificação de e-mail"
      />
    </template>
  </AuthLayout>
</template>

<style scoped src="./verifyEmailView.css"></style>
