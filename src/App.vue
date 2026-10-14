<script setup>
import { RouterView, useRoute } from 'vue-router';
import appHeaderComponent from "@/components/layout/appHeaderComponent.vue";
import appFooterComponent from "@/components/layout/appFooterComponent.vue"

// Pega as informações da página que está ativa no momento
const route = useRoute();
</script>

<template>
  <appHeaderComponent v-if="!route.meta.hideHeader" />

  <main :class="{ 'no-header': route.meta.hideHeader }">
    <RouterView />
  </main>

  <appFooterComponent v-if="!route.meta.hideFooter"></appFooterComponent>
</template>

<style scoped src="./App.css"></style>
