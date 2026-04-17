<script setup>
import { useStudentStore } from '@/store/studentStore'
import { useTemplateStore } from '@/store/template'
import appArrow from '../appArrow.vue'
import appButton from '../form/appButton.vue'
import AppInput from '../form/appInput.vue'
import { onMounted, ref } from 'vue'
import stepComponent from '../stepComponent.vue'

const studentStore = useStudentStore()
const templateStore = useTemplateStore()

function back() {
  templateStore.sign = templateStore.teacherOrStudent ? 3 : 3
}

const file = ref(null)

// function handleFileChange(e) {
//   file.value = e.target.files[0]
// }

function submit() {
  studentStore.submit(file.value)
}

onMounted(() => {
  console.log(templateStore.sign)
})
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
    <form @submit.prevent="submit" class="final">
      <!-- <input type="file" class="image" @change="handleFileChange"> -->
      <appInput placeholder="Nome de usuario" icon="mdi mdi-account-edit" v-model="studentStore.student.nome"></appInput>
      <appButton type="submit">Criar conta</appButton>
    </form>
    <div class="bottom">
        <stepComponent :step=3 first="Informações" second="Confirme seu E-Mail" third="Dados finais"></stepComponent>
    </div>
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

form{
  display: flex;
  flex-direction: column ;
}
</style>
