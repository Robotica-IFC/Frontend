<script setup>
import AppHeaderComponent from '@/components/layout/appHeaderComponent.vue';
import homeStartComponent from '@/components/home-page/homeStartComponent.vue';
import homeCardsComponent from '@/components/home-page/homeCardsComponent.vue';
// import panelcomponent from '@/components/layout/panelcomponent.vue';

// import { useTemplateStore } from '@/store/template';

// const templateStore = useTemplateStore()
</script>

<template>
    <AppHeaderComponent></AppHeaderComponent>
    <homeStartComponent style="margin-top: 90px;"></homeStartComponent>
    <homeCardsComponent></homeCardsComponent>
</template>