<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import putEmailComponent from '@/components/change-passowrd/putEmailComponent.vue'
import checkCodeComponent from '@/components/change-passowrd/checkCodeComponent.vue'
import resetPasswordComponent from '@/components/change-passowrd/resetPasswordComponent.vue'
import stepComponent from '@/components/stepComponent.vue'
import AuthLayout from '@/components/layout/AuthLayout.vue'
import { useTemplateStore } from '@/store/template'
import { usePasswordResetStore } from '@/store/passwordResetStore'

const store = useTemplateStore()
const reset = usePasswordResetStore()
const router = useRouter()
const emailBusy = ref(false)
const codeBusy = ref(false)
const passwordBusy = ref(false)
const busy = computed(() => emailBusy.value || codeBusy.value || passwordBusy.value)
const loadingMessage = computed(() => {
  if (emailBusy.value) return 'Enviando seu código...'
  if (passwordBusy.value) return 'Redefinindo sua senha...'
  return 'Processando seu código...'
})
reset.completed = false
store.changePassword = reset.token ? 2 : reset.email ? 1 : 0
const headings = [
  ['Confirme seu E-mail', 'Vamos garantir que é você.'],
  ['Verifique o código', 'Digite o código que enviamos para seu e-mail.'],
  ['Resete sua senha', 'Crie uma nova senha para continuar.'],
]
const heading = computed(() =>
  reset.completed
    ? ['Senha redefinida!', 'Agora você pode entrar com sua nova senha.']
    : headings[store.changePassword],
)

function goBack() {
  if (busy.value) return
  if (reset.completed || store.changePassword === 0) router.push('/')
  else {
    reset.token = ''
    store.changePassword = 0
  }
}
</script>

<template>
  <AuthLayout
    :title="heading[0]"
    :subtitle="heading[1]"
    icon="mdi-lock-outline"
    :busy="busy"
    :loading-message="loadingMessage"
    progress-label="Etapas da recuperação de senha"
    @back="goBack"
  >
    <putEmailComponent v-if="store.changePassword === 0" @busy="emailBusy = $event" />
    <checkCodeComponent v-else-if="store.changePassword === 1" @busy="codeBusy = $event" />
    <resetPasswordComponent v-else @busy="passwordBusy = $event" />
    <template #progress>
      <stepComponent :step="store.changePassword + 1" />
    </template>
  </AuthLayout>
</template>
