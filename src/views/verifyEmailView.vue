<script setup>
import { onUnmounted, ref } from 'vue'
import verifyCodeComponent from '@/components/verifyCodeComponent.vue'
import robotImage from '@/assets/gif/acenar.gif'
import { useAuthStore } from '@/store/authStore'
const auth = useAuthStore()
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
      await auth.resendVerificationCode()
      startCooldown()
      codigo.value = ''
      message.value = 'Se houver uma conta pendente, um código será enviado. Confira também o spam.'
    }
  } catch (err) {
    const data = err.response?.data
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
  <div class="verification">
    <section
      class="verification-card"
      aria-labelledby="verification-title"
      :aria-busy="loading"
      :inert="loading"
    >
      <RouterLink class="back-link" to="/" aria-label="Voltar para entrar">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M19 12H5m7-7-7 7 7 7"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </RouterLink>

      <img class="robot" :src="robotImage" alt="Robô acenando" />
      <h1 id="verification-title">Verifique o código:</h1>

      <form class="verification-form" @submit.prevent="run('verify')">
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
          Se o e-mail com o código não chegar à caixa de entrada principal, verifique a pasta de
          spam.
        </p>
        <p v-if="error" id="verification-error" role="alert" class="feedback error">{{ error }}</p>
        <p v-if="message" role="status" class="feedback">{{ message }}</p>
        <div class="actions">
          <button type="button" :disabled="loading || remainingSeconds > 0" @click="run('resend')">
            {{ remainingSeconds > 0 ? `Reenviar em ${remainingSeconds}s` : 'Reenviar Código' }}
          </button>
          <button type="submit" :disabled="loading">
            {{ loading ? 'Aguarde...' : 'Continuar' }}
          </button>
        </div>
      </form>

      <ol class="progress" aria-label="Etapas do cadastro">
        <li class="completed">
          <span class="dot" aria-hidden="true">✓</span><span>Informações</span>
        </li>
        <li class="current" aria-current="step">
          <span class="dot" aria-hidden="true"></span><span>Verificar código</span>
        </li>
        <li><span class="dot" aria-hidden="true"></span><span>Dados finais</span></li>
      </ol>
    </section>
    <div v-if="loading" class="loading-overlay" role="status" aria-live="polite">
      <div class="loading-card">
        <span class="loading-spinner" aria-hidden="true"></span>
        <p>
          {{ loadingAction === 'resend' ? 'Enviando seu código...' : 'Verificando seu código...' }}
        </p>
        <span>Aguarde um instante.</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.loading-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  padding: 20px;
  background: #003d6670;
}
.loading-card {
  width: 100%;
  max-width: 320px;
  padding: 32px 24px;
  border-radius: 20px;
  background: #fff;
  color: #003d66;
  text-align: center;
  box-shadow: 0 12px 40px #0002;
}
.loading-card p {
  margin: 20px 0 8px;
  font-weight: 600;
}
.loading-card > span:last-child {
  font-size: 14px;
}
.loading-spinner {
  display: inline-block;
  width: 44px;
  height: 44px;
  border: 4px solid #dbe7ef;
  border-top-color: #003d66;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
@media (prefers-reduced-motion: reduce) {
  .loading-spinner {
    animation: none;
  }
}
.verification {
  min-height: 100dvh;
  display: flex;
  justify-content: center;
  background: #fff;
  color: #171717;
}
.verification-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 420px;
  min-height: max(625px, 100dvh);
  padding: 38px 20px 24px;
}
.back-link {
  position: absolute;
  top: 20px;
  left: 20px;
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  color: #003d66;
  border-radius: 50%;
}
.back-link svg {
  width: 24px;
  height: 24px;
}
.robot {
  width: 250px;
  height: 250px;
  object-fit: contain;
  margin-bottom: 14px;
}
h1 {
  font-size: 22px;
  line-height: 1.4;
  font-weight: 600;
  text-align: center;
  margin: 0 0 24px;
}
.verification-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
:deep(.code-fields) {
  gap: clamp(8px, 3.3vw, 14px);
}
:deep(.code-fields input) {
  width: 34px;
  height: 35px;
  font-size: 20px;
}
.actions {
  display: grid;
  gap: 16px;
  width: 188px;
  margin-top: 32px;
}
.actions button {
  min-height: 34px;
  padding: 5px 10px;
  border: 0;
  border-radius: 3px;
  background: #003d66;
  color: #fff;
  font: inherit;
  font-size: 17px;
  font-weight: 500;
  cursor: pointer;
}
.actions button:hover:not(:disabled) {
  background: #00538a;
}
.actions button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.actions button:focus-visible,
.back-link:focus-visible {
  outline: 2px solid #6084b0;
  outline-offset: 4px;
}
.feedback {
  width: 100%;
  max-width: 310px;
  text-align: center;
  font-size: 13px;
  line-height: 1.5;
  margin-top: 16px;
  color: #003d66;
}
.error {
  color: #a71919;
}
.email-field {
  width: 100%;
  max-width: 274px;
  display: grid;
  gap: 8px;
  margin-bottom: 20px;
  font-size: 14px;
}
.email-field input {
  width: 100%;
  padding: 10px;
  border: 1px solid #003d66;
  border-radius: 8px;
  font: inherit;
}
.progress {
  position: relative;
  display: flex;
  justify-content: space-between;
  width: 100%;
  list-style: none;
  padding: 0;
  margin: auto 0 0;
  padding-top: 42px;
}
.progress::before {
  content: '';
  position: absolute;
  top: 52px;
  left: 33px;
  right: 33px;
  height: 2px;
  background: #dedede;
}
.progress li {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 19px;
  font-size: 11px;
  color: #6e6969;
  text-align: center;
}
.dot {
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #d9d9d9;
  font-size: 18px;
  line-height: 1;
}
.completed .dot {
  background: #003d66;
  color: #fff;
}
.current {
  color: #003d66 !important;
}
.current .dot {
  background: #003d66;
  border: 3px solid #d0d9dd;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
@media (min-width: 700px) {
  .verification {
    background: #f4f7f9;
    padding: 24px;
    align-items: center;
  }
  .verification-card {
    min-height: 625px;
    background: #fff;
    border-radius: 24px;
    box-shadow: 0 8px 32px #003d6610;
  }
}
</style>
