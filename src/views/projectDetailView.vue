<script setup>
import { defineProps } from 'vue'
import projectDetailComponent from '@/components/layout/detailsComponents/projectDetailComponent.vue'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})
</script>
<template>
    <projectDetailComponent :id="props.id"></projectDetailComponent>
</template>
