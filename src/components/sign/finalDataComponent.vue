<script setup>
import { useStudentStore } from '@/store/studentStore'
import { useTemplateStore } from '@/store/template'
import appArrow from '../appArrow.vue'
import appButton from '../form/appButton.vue'
import appInput from '../form/appInput.vue'
import AppInput from '../form/appInput.vue'
import { onMounted, ref } from 'vue'
import suscefullComponent from './successfulComponent.vue'

const studentStore = useStudentStore()
const templateStore = useTemplateStore()

function back() {
  templateStore.sign = templateStore.teacherOrStudent ? 3 : 3
}

const file = ref(null)

function handleFileChange(e) {
  file.value = e.target.files[0]
}

function submit() {
  studentStore.submit(file.value)
}

onMounted(() => {
  console.log(templateStore.sign)
})
</script>
<template>
  <div class="page" :class="{ page: templateStore.successfull, test: templateStore.successful }">
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
      <input type="file" class="image" @change="handleFileChange">
      <appInput placeholder="Nome de usuario" icon="mdi mdi-account-edit"></appInput>
      <appButton type="submit">Criar conta</appButton>
    </form>
    <suscefullComponent v-if="templateStore.successful" class="continue"></suscefullComponent>
  </div>
</template>
<style scoped>
.top {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}
div.page{
  z-index: 1;
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
.continue{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
div.test::after{
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.629);
  z-index: 500;
}
</style>
