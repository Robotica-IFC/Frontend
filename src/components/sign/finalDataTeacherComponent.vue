<script setup>
import { useTeacherStore } from '@/store/teacherStore' // Alterado para Teacher
import { useTemplateStore } from '@/store/template'
import AuthLayout from '../layout/AuthLayout.vue'
import appButton from '../form/appButton.vue'
import AppInput from '../form/appInput.vue'
import imagesourcesheet from '../imagesourcesheet.vue'
import { ref } from 'vue'
import stepComponent from '../stepComponent.vue'
import RegistrationNotice from './RegistrationNotice.vue'
import LegalAcceptance from './LegalAcceptance.vue'

const teacherStore = useTeacherStore() // Alterado para Teacher
const templateStore = useTemplateStore()

const previewImage = ref('/img/default2.jpg')
const file = ref(null)
const showImageSheet = ref(false)
const loading = ref(false)
const termsAccepted = ref(false)
const privacyAcknowledged = ref(false)
teacherStore.registrationFeedback = null

function back() {
  templateStore.sign = 2 // Volta para a etapa dos dados
}

function handleFileSelected(selectedFile) {
  file.value = selectedFile
  previewImage.value = URL.createObjectURL(selectedFile)
}

async function submit() {
  if (loading.value || !termsAccepted.value || !privacyAcknowledged.value) return
  loading.value = true
  try {
    await teacherStore.submit(file.value)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AuthLayout
    :title="`Quase lá, ${teacherStore.state.teacher.name}!`"
    subtitle="Escolha sua foto e seu nome de usuário. Sua conta será criada após confirmar o e-mail."
    icon="mdi-account-edit-outline"
    :busy="loading"
    loading-message="Enviando código de verificação..."
    @back="back"
  >
    <form @submit.prevent="submit" class="final">
      <RegistrationNotice
        v-if="teacherStore.registrationFeedback"
        v-bind="teacherStore.registrationFeedback"
        @edit-email="back"
      />
      <div class="avatar-container">
        <button type="button" class="avatar-label" @click="showImageSheet = true">
          <img :src="previewImage" alt="Foto de perfil" class="profile-pic" />
          <div class="upload-icon">
            <i class="mdi mdi-camera"></i>
          </div>
        </button>
        <span>Escolha sua foto de perfil</span>
      </div>

      <AppInput
        placeholder="Nome de usuário (ex: prof_luca)"
        icon="mdi mdi-account-edit"
        v-model="teacherStore.teacher.username"
        required=""
      />

      <LegalAcceptance
        v-model:termsAccepted="termsAccepted"
        v-model:privacyAcknowledged="privacyAcknowledged"
      />
      <appButton type="submit" :disabled="loading || !termsAccepted || !privacyAcknowledged">{{
        loading ? 'Enviando código...' : 'Verificar e-mail'
      }}</appButton>
    </form>

    <template #progress>
      <stepComponent
        :step="2"
        first="Inserir dados"
        second="Perfil"
        third="Verificação de e-mail"
      />
    </template>
  </AuthLayout>

  <imagesourcesheet
    v-if="showImageSheet"
    facing-mode="user"
    @select="handleFileSelected"
    @close="showImageSheet = false"
  />
</template>

<style scoped src="./finalDataTeacherComponent.css"></style>
<style scoped src="./registrationDataLayout.css"></style>
