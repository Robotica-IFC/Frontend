<script setup>
import { useTeacherStore } from '@/store/teacherStore' // Alterado para Teacher
import { useTemplateStore } from '@/store/template'
import appArrow from '../appArrow.vue'
import appButton from '../form/appButton.vue'
import AppInput from '../form/appInput.vue'
import imagesourcesheet from '../imagesourcesheet.vue'
import { ref } from 'vue'
import stepComponent from '../stepComponent.vue'

const teacherStore = useTeacherStore() // Alterado para Teacher
const templateStore = useTemplateStore()

const previewImage = ref('/img/default2.jpg')
const file = ref(null)
const showImageSheet = ref(false)

function back() {
  templateStore.sign = 3 // Volta para a etapa dos dados
}

function handleFileSelected(selectedFile) {
  file.value = selectedFile
  previewImage.value = URL.createObjectURL(selectedFile)
}

function submit() {
  // Chama o submit do Teacher Store
  teacherStore.submit(file.value)
}

</script>

<template>
  <div class="page">
    <div class="top">
      <div class="arrow">
        <app-arrow @back="back()" />
      </div>

      <img src="/src/assets/gif/digitando.gif" alt="Robo-acenando" class="gif-header" />

      <h2>Quase lá, {{ teacherStore.state.teacher.name }}!</h2>
    </div>

    <form @submit.prevent="submit" class="final">
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

      <appButton type="submit">Finalizar Cadastro</appButton>
    </form>

    <div class="bottom">
      <stepComponent
        :step="3"
        first="Informações"
        second="Confirme seu E-Mail"
        third="Dados finais"
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

<style scoped src="./finalDataTeacherComponent.css"></style>