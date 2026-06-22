<script setup>
import { defineProps } from 'vue'
import appHeaderComponent from '@/components/layout/appHeaderComponent.vue'
import studentDetailComponent from '@/components/layout/detailsComponents/studentDetailComponent.vue'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})
</script>
<template>
  <appHeaderComponent></appHeaderComponent>
  <studentDetailComponent :id="props.id"></studentDetailComponent>
</template>
