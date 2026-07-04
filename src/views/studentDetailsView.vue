<script setup>
import { defineProps } from 'vue'
import studentDetailComponent from '@/components/layout/detailsComponents/studentDetailComponent.vue'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})
</script>
<template>
  <studentDetailComponent :id="props.id"></studentDetailComponent>
</template>
