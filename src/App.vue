<script setup>
import { RouterView, useRoute } from 'vue-router';
import appHeaderComponent from "@/components/layout/appHeaderComponent.vue";

// Pega as informações da página que está ativa no momento
const route = useRoute();
</script>

<template>
  <appHeaderComponent v-if="!route.meta.hideHeader" />

  <main :class="{ 'no-header': route.meta.hideHeader }">
    <RouterView />
  </main>
</template>

<style scoped>
@import url('../src/assets/css/global.css');

.no-header {
  margin-top: 0;
}
</style>