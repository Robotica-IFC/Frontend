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

<style scoped src="./checkCodeComponent.css"></style>