<script setup>
import { useStudentStore } from '@/store/studentStore'
import { useTemplateStore } from '@/store/template'
import AuthLayout from '../layout/AuthLayout.vue'
import appButton from '../form/appButton.vue'
import AppInput from '../form/appInput.vue'
import imagesourcesheet from '../imagesourcesheet.vue'
import { ref } from 'vue'
import stepComponent from '../stepComponent.vue'
import RegistrationNotice from './RegistrationNotice.vue'

const studentStore = useStudentStore()
const templateStore = useTemplateStore()

// Imagem padrão (ajuste o caminho conforme sua pasta public)
const previewImage = ref('/img/default2.jpg')
const file = ref(null)
const showImageSheet = ref(false)
const loading = ref(false)
studentStore.registrationFeedback = null

function back() {
  templateStore.sign = 1
}

function handleFileSelected(selectedFile) {
  file.value = selectedFile
  // Cria o link temporário para visualização imediata
  previewImage.value = URL.createObjectURL(selectedFile)
}

async function submit() {
  if (loading.value) return
  loading.value = true
  try {
    await studentStore.submit(file.value)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AuthLayout
    :title="`Quase lá, ${studentStore.state.student.name}!`"
    subtitle="Escolha sua foto e seu nome de usuário. Sua conta será criada após confirmar o e-mail."
    icon="mdi-account-edit-outline"
    :busy="loading"
    loading-message="Enviando código de verificação..."
    @back="back"
  >
    <form @submit.prevent="submit" class="final">
      <RegistrationNotice
        v-if="studentStore.registrationFeedback"
        v-bind="studentStore.registrationFeedback"
        @edit-email="back"
      />
      <div class="avatar-container">
        <button type="button" class="avatar-label" @click="showImageSheet = true">
          <img :src="previewImage" alt="Foto de perfil" class="profile-pic" />
          <div class="upload-icon">
            <i class="mdi mdi-camera"></i>
          </div>
        </button>
        <span>Foto de perfil</span>
      </div>

      <appInput
        placeholder="Nome de usuario"
        icon="mdi mdi-account-edit"
        v-model="studentStore.student.username"
        required=""
      />

      <appButton type="submit" :disabled="loading">{{
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

<style scoped src="./finalDataStudentComponent.css"></style>
<style scoped src="./registrationDataLayout.css"></style>
