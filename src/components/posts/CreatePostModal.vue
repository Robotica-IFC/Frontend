<script setup>
import UploadHint from '@/components/form/UploadHint.vue'
import { ref, defineProps, defineEmits } from 'vue'
import { usePostStore } from '@/store/postsStore'
import appButton from '@/components/form/appButton.vue'
import imagesourcesheet from '../imagesourcesheet.vue'
import FieldHint from '@/components/form/FieldHint.vue'
import { useFormLimits } from '@/composables/useFormLimits'
import { formatApiError } from '@/utils/formValidation'

const limits = useFormLimits()
const errorMessage = ref('')

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
const formatoImagem = ref('RETANGULAR')
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
  formatoImagem.value = 'RETANGULAR'
  selectedFiles.value = []
  previewUrls.value.forEach(url => URL.revokeObjectURL(url))
  previewUrls.value = []
  emit('close')
}

const handleSubmit = async () => {
  if (postStore.loading) return
  errorMessage.value = ''
  if (!legenda.value.trim() && selectedFiles.value.length === 0) {
    errorMessage.value = 'Adicione uma legenda ou pelo menos uma imagem.'
    return
  }

  try {
    await postStore.createPost({
      legenda: legenda.value,
      formato_imagem: formatoImagem.value,
      projeto: props.projectId,
      files: selectedFiles.value
    })
    closeModal()
    emit('created')
  } catch (error) {
    errorMessage.value = formatApiError(error, 'Erro ao publicar post. Tente novamente.')
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
          v-bind="limits.attrs('post', 'legenda')"
          v-model="legenda"
          placeholder="Escreva a legenda do post..."
          rows="4"
        ></textarea>
        <FieldHint resource="post" field="legenda" :value="legenda" />
        <p v-if="errorMessage" role="alert">{{ errorMessage }}</p>

        <fieldset class="format-selector">
          <legend>Formato da publicação</legend>
          <label :class="{ active: formatoImagem === 'QUADRADO' }">
            <input v-model="formatoImagem" type="radio" value="QUADRADO" name="formato-post"/>
            <i class="mdi mdi-crop-square" aria-hidden="true"></i> Quadrado (1:1)
          </label>
          <label :class="{ active: formatoImagem === 'RETANGULAR' }">
            <input v-model="formatoImagem" type="radio" value="RETANGULAR" name="formato-post"/>
            <i class="mdi mdi-crop-landscape" aria-hidden="true"></i> Retangular (16:9)
          </label>
        </fieldset>
        <p class="format-tip">As imagens manterão suas proporções originais dentro do formato escolhido.</p>
        <div v-if="previewUrls.length" class="post-format-preview" :class="formatoImagem === 'QUADRADO' ? 'is-square' : 'is-wide'">
          <AppImage :src="previewUrls[0]" alt="Prévia do formato da publicação" />
        </div>
        <div v-if="previewUrls.length" class="previews-container">
          <div v-for="(url, index) in previewUrls" :key="index" class="preview-item">
            <AppImage :src="url" alt="Pré-visualização" />
            <button class="remove-btn" @click="removeImage(index)">✕</button>
          </div>
        </div>

        <button type="button" class="add-image-btn" @click="showImageSheet = true">
          <i class="mdi mdi-image-plus-outline" aria-hidden="true"></i> Adicionar imagens
        </button>
        <UploadHint />
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
