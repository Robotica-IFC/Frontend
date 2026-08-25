<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import { usePostStore } from '@/store/postsStore'
import appButton from '@/components/form/appButton.vue'

const props = defineProps({
  projectId: {
    type: [String, Number],
    required: true
  },
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'created'])
const postStore = usePostStore()

const legenda = ref('')
const selectedFiles = ref([])
const previewUrls = ref([])
const fileInput = ref(null)

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileChange = (event) => {
  const files = Array.from(event.target.files)
  if (!files.length) return

  files.forEach(file => {
    selectedFiles.value.push(file)
    previewUrls.value.push(URL.createObjectURL(file))
  })
  
  event.target.value = ''
}

const removeImage = (index) => {
  URL.revokeObjectURL(previewUrls.value[index])
  selectedFiles.value.splice(index, 1)
  previewUrls.value.splice(index, 1)
}

const closeModal = () => {
  legenda.value = ''
  selectedFiles.value = []
  previewUrls.value.forEach(url => URL.revokeObjectURL(url))
  previewUrls.value = []
  emit('close')
}

const handleSubmit = async () => {
  if (!legenda.value.trim() && selectedFiles.value.length === 0) return

  try {
    await postStore.createPost({
      legenda: legenda.value,
      projeto: props.projectId,
      files: selectedFiles.value
    })
    closeModal()
    emit('created')
  } catch (error) {
    alert('Erro ao publicar post. Tente novamente.')
  }
}
</script>

<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Criar Publicação</h2>
        <button class="close-btn" @click="closeModal">✕</button>
      </div>

      <div class="modal-body">
        <textarea
          v-model="legenda"
          placeholder="Escreva a legenda do post..."
          rows="4"
        ></textarea>

        <div v-if="previewUrls.length" class="previews-container">
          <div v-for="(url, index) in previewUrls" :key="index" class="preview-item">
            <img :src="url" alt="Pré-visualização" />
            <button class="remove-btn" @click="removeImage(index)">✕</button>
          </div>
        </div>

        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          multiple
          class="hidden-input"
          @change="handleFileChange"
        />

        <button class="add-image-btn" @click="triggerFileInput">
          📷 Adicionar Imagens
        </button>
      </div>

      <div class="modal-footer">
        <appButton 
          :font="'14px'" 
          :disabled="postStore.loading" 
          @click="handleSubmit"
        >
          {{ postStore.loading ? 'Publicando...' : 'Publicar' }}
        </appButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center; /* Centraliza verticalmente no mobile e desktop */
  z-index: 999;
  padding: 16px; /* Evita que o modal encoste nas bordas em telas pequenas */
}

.modal-content {
  background: #ffffff;
  width: 100%;
  max-width: 500px;
  border-radius: 12px; /* Arredonda todos os cantos */
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-height: 90vh;
  overflow-y: auto;
}

@media (min-width: 600px) {
  .modal-overlay {
    align-items: center;
  }
  .modal-content {
    border-radius: 12px;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--principal-claro);
  padding-bottom: 10px;

  & h2 {
    font-size: 18px;
    color: var(--principal-claro);
  }

  & .close-btn {
    background: transparent;
    border: none;
    font-size: 20px;
    cursor: pointer;
  }
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 15px;

  & textarea {
    width: 100%;
    border: 1px solid var(--principal-claro);
    border-radius: 8px;
    padding: 10px;
    font-family: inherit;
    font-size: 14px;
    resize: none;
    outline: none;
  }

  & .hidden-input {
    display: none;
  }

  & .add-image-btn {
    background: transparent;
    border: 1px dashed var(--principal-claro);
    padding: 10px;
    border-radius: 8px;
    color: var(--principal-claro);
    cursor: pointer;
    font-weight: 500;
  }
}

.previews-container {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 5px;

  & .preview-item {
    position: relative;
    flex: 0 0 80px;
    height: 80px;

    & img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 8px;
    }

    & .remove-btn {
      position: absolute;
      top: 2px;
      right: 2px;
      background: rgba(0, 0, 0, 0.6);
      color: white;
      border: none;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      font-size: 10px;
      cursor: pointer;
    }
  }
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
}
</style>