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
                label="Explorar projetos" @click="router.push('/team')"></appButton>
        </div>

        <p>A Robótica IFC é uma plataforma que conecta aprendizado, projetos e colaboração em um só lugar. Explore
            conteúdos, acompanhe projetos e interaja com a comunidade de forma simples e dinâmica. </p>
    </div>

        <img src="/img/home/Home-robo.png" alt="robo">

    </div>

</template>

<style scoped>
div {
    text-align: center;
}

h1 {
    font-size: 23px;
    text-align: center;
}

span {
    color: var(--destaque-claro);
}

.btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 90%;
    margin-top: 10px;
    margin-left: 5%;
    margin-bottom: 15px;
}

p {
    line-height: 130%;
    font-size: 16px;
    text-align: center;
}

img {
    margin-left: 5%;
    position: relative;
    margin-top: -30px;
    width: 90%;
    max-width: 500px;
    height: auto;
    border-bottom: 1px solid var(--principal-claro);
}

.explorar {
    display: none;
}

@media (min-width: 950px) {
    .page {
        max-width: none;
        width: 100%;
        min-height: 50vh;
        padding: 20px 5%;
        box-sizing: border-box;

        display: flex;
        align-items: center;
        justify-content: space-between;

        position: relative;

    }

      .page::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 15%;
        width: 70%;
        height: 2px;
        background-color: var(--principal-claro);
    }

    .info {
        width: 50%;
        text-align: left;

        display: flex;
        flex-direction: column;
    }

    h1 {
        order: 1;
        font-size: 1.7rem;
        text-align: left;
        margin-bottom: 20px;
    }

    p {
        order: 2;
        text-align: left;
        font-size: 1.1rem;
        margin-bottom: 20px;
    }

    .btn {
        order: 3;

        display: flex;
        justify-content: flex-start;
        align-items: center;

        width: 100%;
        margin-top: 10px;
        margin-left: 0;
        margin-bottom: 15px;

        gap: 10px;
    }

    img {
        border: none;
        width: 40%;
        max-width: 500px;
        margin-left: 0;
        margin-right: 5%;
        margin-top: 0;
    }

    .explorar {
        display: block;
    }
}
</style>
