<script setup>
import appInput from '@/components/form/appInput.vue'
import AuthLayout from '@/components/layout/AuthLayout.vue'
import appButton from '@/components/form/appButton.vue'
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '@/store/authStore'
import { usePasswordResetStore } from '@/store/passwordResetStore'
import router from '@/router'

const authStore = useAuthStore()
const showPassword = ref(false)
const loading = ref(false)
const passwordReset = usePasswordResetStore()
const passwordResetSuccess = ref(passwordReset.completed)
passwordReset.completed = false

const credentials = reactive({
  email: '',
  password: '',
})

const handleLogin = async () => {
  if (loading.value) return
  loading.value = true
  try {
    await authStore.login(credentials)
  } catch (error) {
    alert('Email ou senha inválidos.')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (authStore.isAuthenticated) {
    loading.value = true
    try {
      await authStore.refreshUserSession()

      await router.push('/home-page')
    } catch (error) {
      console.warn('Sessão expirada. Permanecendo na tela de login.')
    } finally {
      loading.value = false
    }
  }
})
</script>

<template>
  <AuthLayout
    title="Acesse sua conta"
    subtitle="Entre para continuar sua jornada."
    icon="mdi-login"
    :back="false"
    :busy="loading"
    loading-message="Entrando na sua conta..."
  >
    <form class="login-form" @submit.prevent="handleLogin">
      <p v-if="passwordResetSuccess" class="password-reset-success" role="status">
        Senha redefinida com sucesso. Entre com sua nova senha.
      </p>
      <appInput
        v-model="credentials.email"
        name="email"
        type="email"
        autocomplete="email"
        placeholder="E-mail"
        icon="mdi mdi-email-outline"
        required
      />
      <appInput
        v-model="credentials.password"
        :type="showPassword ? 'text' : 'password'"
        name="password"
        autocomplete="current-password"
        placeholder="Senha"
        icon="mdi mdi-lock-open"
        required
      >
        <button
          class="visibility-button"
          type="button"
          :aria-label="showPassword ? 'Ocultar senha' : 'Mostrar senha'"
          :aria-pressed="showPassword"
          @click="showPassword = !showPassword"
        >
          <span
            :class="showPassword ? 'mdi mdi-eye-off-outline' : 'mdi mdi-eye-outline'"
            aria-hidden="true"
          ></span>
        </button>
      </appInput>
      <div class="forgot">
        <appButton
          @click="router.push('/change-password')"
          variant="secondary"
          label="Esqueceu a senha?"
          width="auto"
        />
      </div>
      <appButton
        type="submit"
        variant="primary"
        :disabled="loading"
        :label="loading ? 'Entrando...' : 'Entrar'"
      />
    </form>
    <template #footer>
      <p v-if="authStore.pendingRegistrationToken" class="pending-registration">
        Cadastro aguardando confirmação.
        <RouterLink to="/verificar-email">Verificar e-mail</RouterLink>
      </p>
      <div class="signup">
        <span>Não possui um cadastro?</span>
        <appButton
          @click="router.push('/sign')"
          variant="secondary"
          label="Cadastre-se"
          width="auto"
        />
      </div>
    </template>
  </AuthLayout>
</template>

<style scoped src="./welcomeView.css"></style>
