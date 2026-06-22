<script setup>
import appButton from '../form/appButton.vue';
</script>

<template>

    <div class="page">
        <h1>Crie, teste e tranforme ideias em <span>algo real.</span> </h1>

        <div class="btn">
                <appButton variant="primary" label="Saiba mais"></appButton>
        </div>

        <p>A Robótica IFC é uma plataforma que conecta aprendizado, projetos e colaboração em um só lugar. Explore
            conteúdos, acompanhe projetos e interaja com a comunidade de forma simples e dinâmica. </p>

        <img src="/img/home/Home-robo.png" alt="robo">
        
    </div>

</template>

<style scoped>
div{
    text-align: center;
}
h1{
    font-size: 23px;
    text-align: center;
}
span{
    color: var( --destaque-claro);
}
.btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 90%;
    margin-top: 10px;
    margin-left: 13px;
    margin-bottom: 15px;
}
p{
    line-height: 130%;
    font-size: 16px;
    text-align: center;
}
img{
    margin-left: 26px;
    position: relative;
    margin-top: -30px;
    border-bottom: 1px solid var(--principal-claro);
}
</style>    