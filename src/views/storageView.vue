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
  <storageComponent :id="props.id"></storageComponent>
</template>
