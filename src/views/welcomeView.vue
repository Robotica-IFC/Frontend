<script setup>
import appInput from '@/components/form/appInput.vue';
</script>
<template>
    <div class="page">
        <img src="/src/assets/gif/acenar.gif" alt="">
        <form>
            <appInput :placeholder="'E-Mail'" :icon="'mdi mdi-email-outline'"></appInput>
            <appInput :placeholder="'Senha'" :icon="'mdi mdi-lock-open'"></appInput>
        </form>
    </div>
</template>
<style scoped>
div.page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
}
</style>