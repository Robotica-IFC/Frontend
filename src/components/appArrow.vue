<script setup>
    import router from '@/router';
</script>
<template>

<div class="arrow">
    <span @click="router.back" class="mdi mdi-arrow-left"></span>
</div>

</template>

<style scoped>
div.arrow{
    color: var(--principal-secundario-claro);
    font-size: 25px;
}

div.arrow span:active{
    display:inline-block;
    transform: scale(0.9);
    color: var(--principal-claro);
}
</style>

