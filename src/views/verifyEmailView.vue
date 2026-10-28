<script setup>
import { computed, nextTick, ref } from 'vue'
import robotImage from '@/assets/gif/acenar.gif'
import { useAuthStore } from '@/store/authStore'
const auth = useAuthStore()
const email = ref(auth.pendingEmail)
const digits = ref(Array(6).fill(''))
const codigo = computed(() => digits.value.join(''))
const inputs = []

function enterDigit(event, index) {
  const numbers = event.target.value.replace(/[^0-9]/g, '')
  if (numbers.length > 1) {
    fillDigits(numbers, index)
    return
  }
  digits.value[index] = numbers
  event.target.value = numbers
  if (numbers && index < 5) inputs[index + 1]?.focus()
}

async function fillDigits(text, index = 0) {
  const numbers = text.replace(/[^0-9]/g, '').slice(0, 6 - index)
  if (!numbers) return
  for (let offset = 0; offset < numbers.length; offset++) {
    digits.value[index + offset] = numbers[offset]
  }
  await nextTick()
  inputs[Math.min(index + numbers.length, 5)]?.focus()
}

function pasteDigits(event, index) {
  event.preventDefault()
  fillDigits(event.clipboardData.getData('text'), index)
}

function handleKey(event, index) {
  if (event.key === 'Backspace' && !digits.value[index] && index > 0) {
    event.preventDefault()
    digits.value[index - 1] = ''
    inputs[index - 1]?.focus()
  } else if (event.key === 'ArrowLeft' && index > 0) {
    event.preventDefault()
    inputs[index - 1]?.focus()
  } else if (event.key === 'ArrowRight' && index < 5) {
    event.preventDefault()
    inputs[index + 1]?.focus()
  }
}
const loading = ref(false)
const error = ref('')
const message = ref('')

async function run(action) {
  error.value = ''
  message.value = ''
  if (!email.value.trim()) {
    error.value = 'Informe seu e-mail.'
    return
  }
  auth.setPendingEmail(email.value.trim(), auth.pendingType)
  loading.value = true
  try {
    if (action === 'verify') {
      if (!/^[0-9]{6}$/.test(codigo.value)) {
        error.value = 'Digite os seis números do código.'
        return
      }
      await auth.verifyEmail(codigo.value)
    } else {
      await auth.resendVerificationCode()
      message.value = 'Se houver uma conta pendente, um código será enviado. Confira também o spam.'
    }
  } catch (err) {
    const data = err.response?.data
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
    <section class="verification-card" aria-labelledby="verification-title">
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
        <fieldset class="code-fields" :disabled="loading">
          <legend class="sr-only">Código de verificação de seis dígitos enviado por e-mail</legend>
          <input
            v-for="(_, index) in digits"
            :key="index"
            :ref="(element) => (inputs[index] = element)"
            :value="digits[index]"
            :aria-label="`Dígito ${index + 1} do código`"
            :autocomplete="index === 0 ? 'one-time-code' : 'off'"
            type="text"
            inputmode="numeric"
            pattern="[0-9]"
            required
            @input="enterDigit($event, index)"
            @paste="pasteDigits($event, index)"
            @keydown="handleKey($event, index)"
            @focus="$event.target.select()"
          />
        </fieldset>
        <p v-if="error" role="alert" class="feedback error">{{ error }}</p>
        <p v-if="message" role="status" class="feedback">{{ message }}</p>
        <div class="actions">
          <button type="button" :disabled="loading" @click="run('resend')">Reenviar Código</button>
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
  </div>
</template>

<style scoped>
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
.code-fields {
  display: flex;
  justify-content: center;
  gap: clamp(8px, 3.3vw, 14px);
  border: 0;
  padding: 0;
  margin: 0;
  min-width: 0;
}
.code-fields input {
  width: 34px;
  height: 35px;
  border: 1px solid #003d66;
  border-radius: 8px;
  background: #fff;
  color: #003d66;
  text-align: center;
  font: inherit;
  font-size: 20px;
  box-shadow: 0 4px 5px #0003;
  padding: 0;
}
.code-fields input:focus-visible {
  outline: 2px solid #6084b0;
  outline-offset: 3px;
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
  cursor: wait;
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
