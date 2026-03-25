<script setup>
    import appArrow from '../appArrow.vue';
    import router from '@/router';
    import { useTemplateStore } from '@/store/template';
    import appInput from '../form/appInput.vue';

    const templateStore = useTemplateStore()
</script>
<template>
  <div class="page">
    <div class="top"><!--Div que separa a parte do topo, ASS: Lucas-->
      <div class="arrow"><!--Seta que retorna, ASS: Lucas-->
        <app-arrow @back="templateStore.sign = 0" />
      </div>

      <img src="/src/assets/gif/digitando.gif" alt="Robo-acenando" />

      <h2>Informe seus dados:</h2>
    </div>
    <form action="" class="mid"><!--Div que separa a parte do meio, ASS: Lucas-->
        <appInput placeholder="Nome" icon="mdi mdi-account"></appInput>
        <appInput placeholder="Data de nascimento" icon="mdi mdi-account" type="date"></appInput>
        <appInput placeholder="CPF" icon="mdi mdi-account" type="number"></appInput>
        <appInput placeholder="Nome" icon="mdi mdi-account"></appInput>
        <appInput placeholder="Nome" icon="mdi mdi-account"></appInput>
        <appInput placeholder="Nome" icon="mdi mdi-account"></appInput>
        <appInput placeholder="Nome" icon="mdi mdi-account"></appInput>
    </form>
    <div class="bottom"><!--Div que separa a parte de baixo, ASS: Lucas-->
    
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
</style>
