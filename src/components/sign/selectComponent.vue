<script setup>
import { ref } from 'vue'
import stepComponent from '../stepComponent.vue'
import appButton from '../form/appButton.vue'

const step = ref(1)

const nextStep = () => {
  if (step.value < 3) {
    step.value++
  }
}
</script>

<template>
  <div class="page">
    
    <img src="/src/assets/gif/acenar.gif" alt="Robo-acenando" />

     <appButton 
      label="Continuar" 
      @click="nextStep" 
    />
    
    <stepComponent :step="step" />


  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 20px;
}
</style>