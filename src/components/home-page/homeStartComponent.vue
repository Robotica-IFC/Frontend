<script setup>
import appButton from '../form/appButton.vue';
import { useRouter } from "vue-router";
import { useTemplateStore } from '@/store/template'

const router = useRouter()
const templateStore = useTemplateStore()
</script>

<template>

    <div class="page">

    <div class="info">
       <h1>Crie, teste e tranforme ideias em <span>algo real.</span> </h1>

        <div class="btn">
                <appButton variant="primary" label="Saiba mais" @click="router.push('/team')"></appButton>

                <appButton variant="border" class="explorar"
                label="Explorar projetos" @click="router.push('/projects')"></appButton>
        </div>

        <p>A Robótica IFC é uma plataforma que conecta aprendizado, projetos e colaboração em um só lugar. Explore
            conteúdos, acompanhe projetos e interaja com a comunidade de forma simples e dinâmica. </p>
    </div>

        <img
            :src="templateStore.darkMode ? '/img/home/Home-robo-dark.png' : '/img/home/home-introducao-robotica.png'"
            alt="Robô processando dados e exibindo gráficos"
        >

    </div>

</template>

<style scoped src="./homeStartComponent.css"></style>
