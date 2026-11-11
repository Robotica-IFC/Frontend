<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import putEmailComponent from '@/components/change-passowrd/putEmailComponent.vue'
import checkCodeComponent from '@/components/change-passowrd/checkCodeComponent.vue'
import resetPasswordComponent from '@/components/change-passowrd/resetPasswordComponent.vue'
import stepComponent from '@/components/stepComponent.vue'
import robotImage from '@/assets/gif/acenar.gif'
import { useTemplateStore } from '@/store/template'
import { usePasswordResetStore } from '@/store/passwordResetStore'

const store = useTemplateStore()
const reset = usePasswordResetStore()
const router = useRouter()
const emailBusy = ref(false)
const codeBusy = ref(false)
const passwordBusy = ref(false)
const busy = computed(() => emailBusy.value || codeBusy.value || passwordBusy.value)
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
  <div class="password-reset-page">
    <button class="reset-back" type="button" aria-label="Voltar" :disabled="busy" @click="goBack">
      <span class="mdi mdi-arrow-left" aria-hidden="true"></span>
    </button>
    <div class="reset-content">
      <section class="reset-hero" aria-label="Bem-vindo à Robótica">
        <h1>Bem vindo(a)<br />a <span>Robótica</span></h1>
        <p>Sua plataforma para aprender, criar e transformar ideias em inovação.</p>
        <img :src="robotImage" alt="Robô acenando" />
      </section>
      <section class="reset-card" aria-labelledby="reset-title" :aria-busy="busy">
        <div class="reset-card-icon" aria-hidden="true">
          <span class="mdi mdi-lock-outline"></span>
        </div>
        <h2 id="reset-title" tabindex="-1">{{ heading[0] }}</h2>
        <p class="reset-subtitle">{{ heading[1] }}</p>
        <putEmailComponent v-if="store.changePassword === 0" @busy="emailBusy = $event" />
        <checkCodeComponent v-else-if="store.changePassword === 1" @busy="codeBusy = $event" />
        <resetPasswordComponent v-else @busy="passwordBusy = $event" />
      </section>
    </div>
    <nav class="reset-progress" aria-label="Etapas da recuperação de senha">
      <stepComponent :step="store.changePassword + 1" />
    </nav>
  </div>
</template>

<style scoped src="./changePasswordView.css"></style>
