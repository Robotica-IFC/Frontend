<script setup>
import storageComponent from '@/components/storage/storageComponent.vue'

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
})
</script>
<template>
  <div class="page">
    <storageComponent :id="props.id"></storageComponent>
  </div>
</template>
