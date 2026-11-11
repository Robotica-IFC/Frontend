<script setup>
import { computed, onMounted } from 'vue'
import { useFormLimits } from '@/composables/useFormLimits'

const limits = useFormLimits()
const names = { 'image/jpeg': 'JPG', 'image/png': 'PNG', 'image/webp': 'WebP', 'image/gif': 'GIF', 'image/x-icon': 'ICO' }
const formats = computed(() => (limits.uploads.value.image_types || []).map(type => names[type] || type).join(', '))
onMounted(limits.load)
</script>
<template>
  <small class="upload-hint">{{ formats ? `Formatos aceitos: ${formats}.` : 'O formato da imagem será verificado ao enviar.' }}</small>
</template>
<style scoped>
.upload-hint { display:block; margin:6px 0; color:#526b7e; font-size:12px; line-height:1.5; font-weight:400; overflow-wrap:anywhere; }
</style>
