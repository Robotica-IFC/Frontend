<script setup>
    // import router from '@/router';

    const emits = defineEmits(['back'])
</script>
<template>

<div class="arrow">
    <span @click="emits('back')" class="mdi mdi-arrow-left"></span>
</div>

</template>

<style scoped src="./appArrow.css"></style>