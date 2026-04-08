<script setup>
    import router from '@/router';
    import appButton from '../form/appButton.vue';
    import { useTemplateStore } from '@/store/template';

    const templateStore = useTemplateStore()

    function continuar(){
        templateStore.successful = false
        router.push('/test')
    }
</script>
<template>
    <div class="geral">
        <h1>
            Login bem sucessido
        </h1>
        <appButton @click="continuar()">Continuar</appButton>
    </div>
</template>
<style scoped>
    div.geral{
        border: 2px solid var(--principal-claro);
        border-radius: 20px;
        padding: 20px;
        background-color: white;
        z-index: 10000;
    }
    h1{
        font-size: 25px;
        text-align: center;
    }
</style>