<script setup>
import { useStudentStore } from '@/store/studentStore'
import { useTemplateStore } from '@/store/template'
import appArrow from '../appArrow.vue'
import appButton from '../form/appButton.vue'
import appInput from '../form/appInput.vue'
import AppInput from '../form/appInput.vue'

const studentStore = useStudentStore()
const templateStore = useTemplateStore()

function back() {
  templateStore.sign = templateStore.teacherOrStudent ? 3 : 3
}

async function handleImage(event) {
  const file = event.target.files[0]

  if (!file) return

  const image = await studentStore.uploadImage(file)

  // salvar chave para enviar ao backend
  studentStore.state.student.imagem_perfil = image.attachment_key

  // salvar url para preview
  studentStore.state.student.imagem_preview = image.url
}
</script>
<template>
  <div class="page">
    <div class="top">
      <!--Div que separa a parte do topo, ASS: Lucas-->
      <div class="arrow">
        <!--Seta que retorna, ASS: Lucas-->
        <app-arrow @back="back()" />
      </div>

      <img src="/src/assets/gif/digitando.gif" alt="Robo-acenando" />

      <h2>Informe seus dados:</h2>
    </div>
    <form @submit.prevent="studentStore.createStudent()" class="final">
      <appInput variant="signImage" type="file" name="imagem_perfil" @change="handleImage">
        <img
          v-if="studentStore.student.imagem_preview"
          :src="studentStore.student.imagem_preview"
          class="preview"
        />

        <span v-else class="mdi mdi-account"></span>

        <span class="mdi mdi-camera camera"></span>
      </appInput>
    </form>
  </div>
</template>
<style scoped>
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

img {
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
  justify-content: center;
}
</style>
