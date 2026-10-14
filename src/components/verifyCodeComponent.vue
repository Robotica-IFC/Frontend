<script setup>
    import appInput from './form/appInput.vue';
</script>
<template>
    <div class="inputs">
        <appInput variant="terciary" type="number" maxlength="1"></appInput>
        <appInput variant="terciary" type="number" maxlength="1"></appInput>
        <appInput variant="terciary" type="number" maxlength="1"></appInput>
        <appInput variant="terciary" type="number" maxlength="1"></appInput>
        <appInput variant="terciary" type="number" maxlength="1"></appInput>
        <appInput v-if="this" variant="terciary" type="number" maxlength="1"></appInput>
    </div>
</template>
<style scoped src="./verifyCodeComponent.css"></style>