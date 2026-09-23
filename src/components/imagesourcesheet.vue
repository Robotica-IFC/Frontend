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
})

const emit = defineEmits(['select', 'close'])

const isMobile = ref(false)
const fileWasSelected = ref(false)
const cameraFrontInput = ref(null)
const cameraBackInput = ref(null)
const galleryInput = ref(null)

function detectMobile() {
  if (typeof navigator === 'undefined') return false
  const uaMobile = /Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent)
  const coarsePointer = window.matchMedia?.('(pointer: coarse)').matches ?? false
  return uaMobile || coarsePointer
}

function openCameraFront() {
  cameraFrontInput.value.click()
}

function openCameraBack() {
  cameraBackInput.value.click()
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

function handleChange(event) {
  const files = Array.from(event.target.files || [])
  event.target.value = ''
  if (files.length === 0) return
  fileWasSelected.value = true
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
  <div v-if="isMobile" class="sheet-backdrop" @click.self="$emit('close')">
    <div class="sheet-container">
      <div class="sheet-handle"></div>

      <button type="button" class="sheet-option" @click="openCameraFront">
        <span class="mdi mdi-camera-account"></span>
        <span>Tirar Selfie</span>
      </button>

      <button type="button" class="sheet-option" @click="openCameraBack">
        <span class="mdi mdi-camera-outline"></span>
        <span>Tirar Foto</span>
      </button>

      <button type="button" class="sheet-option" @click="openGallery">
        <span class="mdi mdi-image-multiple-outline"></span>
        <span>{{ multiple ? 'Escolher da Galeria' : 'Escolher Arquivo' }}</span>
      </button>

      <button type="button" class="sheet-cancel" @click="$emit('close')">Cancelar</button>
    </div>
  </div>

  <input
    ref="cameraFrontInput"
    type="file"
    :accept="accept"
    capture="user"
    class="hidden-input"
    @change="handleChange"
  />
  <input
    ref="cameraBackInput"
    type="file"
    :accept="accept"
    capture="environment"
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

<style scoped>
.sheet-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 1100;
}

.sheet-container {
  width: 100%;
  max-width: 500px;
  background: #ffffff;
  border-radius: 16px 16px 0 0;
  padding: 12px 16px calc(16px + env(safe-area-inset-bottom, 0px));
  display: flex;
  flex-direction: column;
  gap: 8px;
  animation: slideUp 0.2s ease-out;
}

.sheet-handle {
  width: 40px;
  height: 4px;
  border-radius: 2px;
  background: #cbd5e1;
  margin: 4px auto 8px;
}

.sheet-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 12px;
  background: #f8fafc;
  border: none;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--texto-claro, #141414);
  cursor: pointer;
  text-align: left;
  font-family: inherit;

  & .mdi {
    font-size: 1.3rem;
    color: var(--principal-claro, #003d66);
  }
}

.sheet-cancel {
  margin-top: 4px;
  padding: 14px 12px;
  background: transparent;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  font-family: inherit;
}

.hidden-input {
  display: none;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}
</style>