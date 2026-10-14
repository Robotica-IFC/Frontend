<script setup>
import { onMounted, ref } from 'vue'

const props = defineProps({
  accept: {
    type: String,
    default: 'image/*',
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  maxDimension: {
    type: Number,
    default: 1920,
  },
  quality: {
    type: Number,
    default: 0.85,
  },
})

const emit = defineEmits(['select', 'close'])

const isMobile = ref(false)
const processing = ref(false)
const fileWasSelected = ref(false)
const cameraInput = ref(null)
const galleryInput = ref(null)

function detectMobile() {
  if (typeof navigator === 'undefined') return false
  const uaMobile = /Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent)
  const coarsePointer = window.matchMedia?.('(pointer: coarse)').matches ?? false
  return uaMobile || coarsePointer
}

function openCamera() {
  cameraInput.value.click()
}

function openGallery() {
  galleryInput.value.click()
}

function openGalleryDesktop() {
  const handleWindowFocus = () => {
    window.removeEventListener('focus', handleWindowFocus)
    setTimeout(() => {
      if (!fileWasSelected.value) {
        emit('close')
      }
    }, 300)
  }
  window.addEventListener('focus', handleWindowFocus)
  galleryInput.value.click()
}

async function loadBitmap(file) {
  try {
    return await createImageBitmap(file, { imageOrientation: 'from-image' })
  } catch (error) {
    return await createImageBitmap(file)
  }
}

async function normalizeImage(file) {
  try {
    const bitmap = await loadBitmap(file)
    const scale = Math.min(1, props.maxDimension / Math.max(bitmap.width, bitmap.height))
    const width = Math.round(bitmap.width * scale)
    const height = Math.round(bitmap.height * scale)

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height

    const ctx = canvas.getContext('2d')
    ctx.drawImage(bitmap, 0, 0, width, height)
    bitmap.close?.()

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', props.quality))
    if (!blob) return file

    const baseName = file.name ? file.name.replace(/\.[^.]+$/, '') : 'foto'
    return new File([blob], `${baseName}.jpg`, { type: 'image/jpeg', lastModified: Date.now() })
  } catch (error) {
    console.error('Erro ao processar imagem:', error)
    return file
  }
}

async function handleChange(event) {
  const rawFiles = Array.from(event.target.files || [])
  event.target.value = ''
  if (rawFiles.length === 0) return

  fileWasSelected.value = true
  processing.value = true

  const files = await Promise.all(rawFiles.map((rawFile) => normalizeImage(rawFile)))

  processing.value = false
  emit('select', props.multiple ? files : files[0])
  emit('close')
}

onMounted(() => {
  isMobile.value = detectMobile()
  if (!isMobile.value) {
    openGalleryDesktop()
  }
})
</script>

<template>
  <div v-if="isMobile" class="sheet-backdrop" @click.self="!processing && $emit('close')">
    <div class="sheet-container">
      <div v-if="processing" class="sheet-processing">
        <span class="mdi mdi-loading spin"></span>
        <span>Preparando imagem...</span>
      </div>

      <template v-else>
        <div class="sheet-handle"></div>

        <button type="button" class="sheet-option" @click="openCamera">
          <span class="mdi mdi-camera-outline"></span>
          <span>Tirar Foto</span>
        </button>

        <button type="button" class="sheet-option" @click="openGallery">
          <span class="mdi mdi-image-multiple-outline"></span>
          <span>{{ multiple ? 'Escolher da Galeria' : 'Escolher Arquivo' }}</span>
        </button>

        <button type="button" class="sheet-cancel" @click="$emit('close')">Cancelar</button>
      </template>
    </div>
  </div>

  <input
    ref="cameraInput"
    type="file"
    :accept="accept"
    capture="user"
    class="hidden-input"
    @change="handleChange"
  />
  <input
    ref="galleryInput"
    type="file"
    :accept="accept"
    :multiple="multiple"
    class="hidden-input"
    @change="handleChange"
  />
</template>

<style scoped src="./imagesourcesheet.css"></style>