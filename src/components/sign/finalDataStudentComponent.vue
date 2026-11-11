<script setup>
import { useStudentStore } from '@/store/studentStore'
import { useTemplateStore } from '@/store/template'
import appArrow from '../appArrow.vue'
import appButton from '../form/appButton.vue'
import AppInput from '../form/appInput.vue'
import imagesourcesheet from '../imagesourcesheet.vue'
import { ref } from 'vue'
import stepComponent from '../stepComponent.vue'

const studentStore = useStudentStore()
const templateStore = useTemplateStore()

// Imagem padrão (ajuste o caminho conforme sua pasta public)
const previewImage = ref('/img/default2.jpg')
const file = ref(null)
const showImageSheet = ref(false)

function back() {
  templateStore.sign = 1
}

function handleFileSelected(selectedFile) {
  file.value = selectedFile
  // Cria o link temporário para visualização imediata
  previewImage.value = URL.createObjectURL(selectedFile)
}

function submit() {
  studentStore.submit(file.value)
}
</script>

<template>
  <div class="page">
    <div class="top">
      <div class="arrow">
        <app-arrow @back="back()" />
      </div>

      <img src="/src/assets/gif/digitando.gif" alt="Robo-acenando" class="gif-header" />

      <h2>Quase lá, {{ studentStore.state.student.name }}!</h2>
    </div>

    <form @submit.prevent="submit" class="final">
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

      <appButton type="submit">Criar conta</appButton>
    </form>

    <div class="bottom">
      <stepComponent
        :step="2"
        first="Informações"
        second="Dados finais"
        third="Confirme seu e-mail"
      />
    </div>

    <imagesourcesheet
      v-if="showImageSheet"
      facing-mode="user"
      @select="handleFileSelected"
      @close="showImageSheet = false"
    />
  </div>
</template>

<style scoped src="./finalDataStudentComponent.css"></style>
