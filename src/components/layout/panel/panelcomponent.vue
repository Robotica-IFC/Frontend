<script setup>
  import noEditModeComponent from './noEditModeComponent.vue';
  import editModeComponent from './editModeComponent.vue';
  import { useTemplateStore } from '@/store/template';

  const templateStore = useTemplateStore()
</script>
<template>
  <div v-if="templateStore.panel">
    <noEditModeComponent />
  </div>
  <div v-else>
    <editModeComponent></editModeComponent>
  </div>
</template>
