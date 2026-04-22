<script setup>
import { useTemplateStore } from '@/store/template';
import appArrow from '../appArrow.vue';
import verifyCodeComponent from '../verifyCodeComponent.vue';
import stepComponent from '../stepComponent.vue';
import appButton from '../form/appButton.vue';
//import { useStudentStore } from '@/store/studentStore';
//import { onMounted } from 'vue';

const templateStore = useTemplateStore();
//const studentStore = useStudentStore();

function back() {
  templateStore.sign = templateStore.teacherOrStudent ? 1 : 2
}
</script>
<template>
  <div class="page">
    <div class="flex">
      <div class="top">
        <!--Div que separa a parte do topo, ASS: Lucas-->
        <div class="arrow">
          <!--Seta que retorna, ASS: Lucas-->
          <app-arrow @back="back()" />
        </div>

        <img src="/src/assets/gif/digitando.gif" alt="Robo-acenando" />

        <h2>Confirme seu E-Mail</h2>
      </div>
      <div class="mid">
        <verifyCodeComponent></verifyCodeComponent>
        <div class="btns">
          <appButton>Reenviar código</appButton>
          <appButton @click="templateStore.sign = 4">Continuar</appButton>
        </div>
      </div>
    </div>
    <div class="bottom">
      <stepComponent first="Informações " second="Confirme seu E-Mail" third="Dados finais" step=2></stepComponent>

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

.page {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>