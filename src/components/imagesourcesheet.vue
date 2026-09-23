<script setup>
import { ref } from 'vue'

const props = defineProps({
  accept: {
    type: String,
    default: 'image/*',
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  facingMode: {
    type: String,
    default: 'environment',
  },
})

const emit = defineEmits(['select', 'close'])

const cameraInput = ref(null)
const galleryInput = ref(null)

function openCamera() {
  cameraInput.value.click()
}

function openGallery() {
  galleryInput.value.click()
}

function handleCameraChange(event) {
  const file = event.target.files[0]
  event.target.value = ''
  if (!file) return
  emit('select', props.multiple ? [file] : file)
  emit('close')
}

function handleGalleryChange(event) {
  const files = Array.from(event.target.files || [])
  event.target.value = ''
  if (files.length === 0) return
  emit('select', props.multiple ? files : files[0])
  emit('close')
}
</script>

<template>
  <div class="sheet-backdrop" @click.self="$emit('close')">
    <div class="sheet-container">
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

      <input
        ref="cameraInput"
        type="file"
        :accept="accept"
        :capture="facingMode"
        class="hidden-input"
        @change="handleCameraChange"
      />
      <input
        ref="galleryInput"
        type="file"
        :accept="accept"
        :multiple="multiple"
        class="hidden-input"
        @change="handleGalleryChange"
      />
    </div>
  </div>
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
