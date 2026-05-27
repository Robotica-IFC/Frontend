<script setup>
import AppHeaderComponent from '@/components/layout/appHeaderComponent.vue';
import HomeStartComponent from '@/components/home-page/HomeStartComponent.vue';
import HomeCardsComponent from '@/components/home-page/HomeCardsComponent.vue';
// import panelcomponent from '@/components/layout/panelcomponent.vue';

// import { useTemplateStore } from '@/store/template';

// const templateStore = useTemplateStore()
</script>

<template>
    <AppHeaderComponent></AppHeaderComponent>
    <HomeStartComponent style="margin-top: 90px;"></HomeStartComponent>
    <HomeCardsComponent></HomeCardsComponent>
</template>