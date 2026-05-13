<script setup>
  import noEditModeComponent from './noEditModeComponent.vue';
  import editModeComponent from './editModeComponent.vue';
  import { useTemplateStore } from '@/store/template';

  const templateStore = useTemplateStore()
</script>
<template>
  <noEditModeComponent v-if="templateStore.panel" />
  <editModeComponent></editModeComponent>
</template>
