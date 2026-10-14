<script setup>
import appButton from '../form/appButton.vue';
import { useRouter } from "vue-router";

const router = useRouter()
</script>

<template>

    <div class="page">

    <div class="info">
       <h1>Crie, teste e tranforme ideias em <span>algo real.</span> </h1>

        <div class="btn">
                <appButton variant="primary" label="Saiba mais"></appButton>

                <appButton variant="border" class="explorar"
                label="Explorar projetos" @click="router.push('/projects')"></appButton>
        </div>

        <p>A Robótica IFC é uma plataforma que conecta aprendizado, projetos e colaboração em um só lugar. Explore
            conteúdos, acompanhe projetos e interaja com a comunidade de forma simples e dinâmica. </p>
    </div>

        <img src="/img/home/Home-robo.png" alt="robo">

    </div>

</template>

<style scoped src="./homeStartComponent.css"></style>
