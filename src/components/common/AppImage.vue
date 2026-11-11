<script setup>
import { computed, ref, watch } from 'vue'
import { getProfileImageUrl } from '@/utils/profileImage'

const props = defineProps({ src: { type: [String, Object], default: '' }, alt: { type: String, default: '' }, placeholder: { type: String, default: 'image' } })
const failed = ref(false)
const source = computed(() => getProfileImageUrl(props.src)?.trim() || '')
watch(source, () => { failed.value = false })
// Material Design Icons: image-outline and account-group.
const imagePath = 'M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2M5 5h14v14H5V5m9.5 6-3.5 4.5-2.5-3L5 17h14l-4.5-6Z'
const teamPath = 'M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8C5.56,8 6.08,8.15 6.53,8.42C6.38,9.85 6.8,11.27 7.66,12.38C7.16,13.34 6.16,14 5,14A3,3 0 0,1 2,11A3,3 0 0,1 5,8M19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14C17.84,14 16.84,13.34 16.34,12.38C17.2,11.27 17.62,9.85 17.47,8.42C17.92,8.15 18.44,8 19,8M5.5,18.25C5.5,16.18 8.41,14.5 12,14.5C15.59,14.5 18.5,16.18 18.5,18.25V20H5.5V18.25M0,20V18.5C0,17.11 1.89,15.94 4.45,15.6C3.86,16.28 3.5,17.22 3.5,18.25V20H0M24,20H20.5V18.25C20.5,17.22 20.14,16.28 19.55,15.6C22.11,15.94 24,17.11 24,18.5V20Z'
const placeholderImage = computed(() => {
  const team = props.placeholder === 'team'
  return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"><rect width="160" height="160" fill="${team ? '#6084b0' : '#dce7f0'}"/><svg x="${team ? 44 : 52}" y="${team ? 44 : 52}" width="${team ? 72 : 56}" height="${team ? 72 : 56}" viewBox="0 0 24 24"><path fill="${team ? '#fff' : '#003d66'}" d="${team ? teamPath : imagePath}"/></svg></svg>`)
})
const missing = computed(() => failed.value || !source.value)
</script>

<template>
  <img :src="missing ? placeholderImage : source" :alt="missing ? `${alt || 'Imagem'} (imagem indisponível)` : alt"
    :class="{ 'app-image-placeholder': missing, 'app-image-placeholder-team': missing && placeholder === 'team' }" @error="failed = true" />
</template>

<style>
img.app-image-placeholder { background-color: #dce7f0 !important; object-fit: contain !important; }
img.app-image-placeholder-team { background-color: var(--destaque-claro) !important; }
</style>
