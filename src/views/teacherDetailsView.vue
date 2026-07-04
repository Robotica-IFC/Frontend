<script setup>
import { defineProps } from 'vue'
import teacherDetailComponent from '@/components/layout/detailsComponents/teacherDetailComponent.vue'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <teacherDetailComponent :id="props.id"></teacherDetailComponent>
</template>