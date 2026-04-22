<script setup>
import { useTeacherStore } from '@/store/teacherStore' // Alterado para Teacher
import { useTemplateStore } from '@/store/template'
import appArrow from '../appArrow.vue'
import appButton from '../form/appButton.vue'
import AppInput from '../form/appInput.vue'
import { onMounted, ref } from 'vue'
import stepComponent from '../stepComponent.vue'

const teacherStore = useTeacherStore() // Alterado para Teacher
const templateStore = useTemplateStore()

const previewImage = ref('/img/default2.jpg')
const file = ref(null)

function back() {
  templateStore.sign = 3 // Volta para a etapa dos dados
}

function handleFileChange(e) {
  const selectedFile = e.target.files[0]
  if (selectedFile) {
    file.value = selectedFile
    previewImage.value = URL.createObjectURL(selectedFile)
  }
}

function submit() {
  // Chama o submit do Teacher Store
  teacherStore.submit(file.value)
}

onMounted(() => {
  console.log('Iniciando etapa final do professor')
})
</script>

<template>
  <div class="page">
    <div class="top">
      <div class="arrow">
        <app-arrow @back="back()" />
      </div>

      <img src="/src/assets/gif/digitando.gif" alt="Robo-acenando" class="gif-header" />

      <h2>Quase lá, Professor!</h2>
    </div>

    <form @submit.prevent="submit" class="final">
      <div class="avatar-container">
        <label for="avatar-input" class="avatar-label">
          <img :src="previewImage" alt="Foto de perfil" class="profile-pic" />
          <div class="upload-icon">
            <i class="mdi mdi-camera"></i>
          </div>
        </label>
        <input id="avatar-input" type="file" accept="image/*" @change="handleFileChange" hidden />
        <span>Escolha sua foto de perfil</span>
      </div>

      <AppInput
        placeholder="Nome de usuário (ex: prof_luca)"
        icon="mdi mdi-account-edit"
        v-model="teacherStore.teacher.username"
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
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}
.top {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}
.arrow {
  width: 100%;
  display: flex;
}
.gif-header {
  width: 250px;
  height: auto;
}
h2 {
  font-size: 23px;
  margin: 25px 0 35px;
  text-align: center;
}
.final {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
  max-width: 400px;
}

.avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}
.avatar-label {
  position: relative;
  cursor: pointer;
  transition: transform 0.2s;
}
.avatar-label:active {
  transform: scale(1.05);
}

.profile-pic {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--principal-claro);
  background-color: #f0f0f0;
}

.upload-icon {
  position: absolute;
  bottom: 5px;
  right: 5px;
  background: var(--principal-claro);
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}
.bottom {
  margin-top: 40px;
  width: 100%;
}
</style>
