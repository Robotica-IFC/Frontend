<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import { usePostStore } from '@/store/postsStore'
import appButton from '@/components/form/appButton.vue'
import imagesourcesheet from '../imagesourcesheet.vue'

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
const showImageSheet = ref(false)

const handleFilesSelected = (files) => {
  files.forEach((file) => {
    selectedFiles.value.push(file)
    previewUrls.value.push(URL.createObjectURL(file))
  })
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

        <button type="button" class="add-image-btn" @click="showImageSheet = true">
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

    <imagesourcesheet
      v-if="showImageSheet"
      multiple
      @select="handleFilesSelected"
      @close="showImageSheet = false"
    />
  </div>
</template>

<style scoped src="./CreatePostModal.css"></style>