<script setup>
import { useTemplateStore } from '@/store/template';
import appArrow from '../appArrow.vue';
import appButton from '../form/appButton.vue';

const store = useTemplateStore()
</script>

<template>
    <div class="page">
    <div class="arrow"> <!--Botão para voltar à página anterior Ass: Laura-->
            <appArrow @click="store.changePassword = 0"></appArrow>
        </div>

        <img src="/src/assets/gif/acenar.gif" alt="Robo-acenando" /> 
        <h2>Verifique o código:</h2> 

        <div class="btn">
         <appButton variant="primary" label="Reenvia código" ></appButton>
         <appButton variant="primary" label="Continuar" @click="store.changePassword = 2"></appButton>
        </div>
    </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  width: 100%;
}

.arrow {
  width: 100%;
  display: flex;
  justify-content: flex-start;
}

img {
  width: 260px;
  height: auto;
}

h2 {
    text-align: center;
    margin: 15px 0;
    font-size: 23px;
}
    
</style>