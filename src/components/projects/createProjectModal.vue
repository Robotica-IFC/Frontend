<script setup>
import UploadHint from '@/components/form/UploadHint.vue'
import { ref, reactive } from 'vue'
import { useProjectStore } from '@/store/projectsStore.js'
import appButton from '../form/appButton.vue'
import appInput from '../form/appInput.vue'
import imagesourcesheet from '../imagesourcesheet.vue'
import FieldHint from '@/components/form/FieldHint.vue'
import { useFormLimits } from '@/composables/useFormLimits'
import { formatApiError } from '@/utils/formValidation'

const limits = useFormLimits()
const emit = defineEmits(['close', 'created'])
const projectStore = useProjectStore()
const loading = ref(false)
const errorMessage = ref('')
const selectedFile = ref(null)
const imagePreview = ref(null)
const showImageSheet = ref(false)
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})
const form = reactive({
  titulo: '',
  desc_curta: '',
  descricao: '',
  sugestao: false,
  status: 'EM_ANDAMENTO',
  equipe: props.id,
})
function handleFileSelected(file) {
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value)
  }
  selectedFile.value = file
  imagePreview.value = URL.createObjectURL(file)
}
function removeImage() {
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value)
  }
  selectedFile.value = null
  imagePreview.value = null
}
async function handleSubmit() {
  errorMessage.value = ''
  // Validações de obrigatoriedade e limites de caracteres
  if (!form.titulo.trim()) {
    errorMessage.value = 'O título do projeto é obrigatório.'
    return
  }
  if (!form.desc_curta.trim()) {
    errorMessage.value = 'A descrição curta é obrigatória.'
    return
  }
  if (!form.descricao.trim()) {
    errorMessage.value = 'A descrição completa é obrigatória.'
    return
  }
  if (!form.equipe) {
    errorMessage.value = 'Equipe não informada.'
    return
  }
  try {
    loading.value = true
    const projectData = {
      titulo: form.titulo.trim(),
      desc_curta: form.desc_curta.trim(),
      descricao: form.descricao.trim(),
      sugestao: form.sugestao,
      status: form.status,
      equipe: form.equipe,
    }
    await projectStore.createProject(projectData, selectedFile.value)
    emit('created')
    emit('close')
  } catch (error) {
    console.error('Erro ao criar projeto:', error)
    errorMessage.value = formatApiError(error, 'Erro ao criar o projeto.')
  } finally {
    loading.value = false
  }
}
</script>
<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-container">
      <div class="modal-header">
        <h2>Criar Novo Projeto</h2>
        <button class="close-btn" @click="$emit('close')">&times;</button>
      </div>
      <form @submit.prevent="handleSubmit" class="modal-body">
        <p v-if="errorMessage" role="alert" class="error-msg">{{ errorMessage }}</p>
        <!-- Upload da Imagem de Perfil do Projeto -->
        <div class="form-group align-center">
          <label>Imagem do Projeto</label>
          <UploadHint />
          <div class="image-upload-wrapper">
            <button type="button" class="image-preview-container" @click="showImageSheet = true">
              <img
                v-if="imagePreview"
                :src="imagePreview"
                alt="Preview do Projeto"
                class="preview-img"
              />
              <div v-else class="upload-placeholder">
                <i class="mdi mdi-camera-plus-outline"></i>
                <span>Adicionar Foto</span>
              </div>
            </button>
            <button
              v-if="imagePreview"
              type="button"
              class="btn-remove-image"
              @click="removeImage"
              title="Remover imagem"
            >
              <i class="mdi mdi-close"></i>
            </button>
          </div>
        </div>
        <!-- Título -->
        <div class="form-group">
          <label>Título *</label>
          <appInput resource="projeto" field="titulo"
            placeholder="Título do projeto"
            icon="mdi mdi-format-title"
            v-model="form.titulo"
            required
          />
        </div>
        <!-- Descrição Curta -->
        <div class="form-group">
          <label>Descrição curta *</label>
          <appInput resource="projeto" field="desc_curta"
            placeholder="Resumo do projeto"
            icon="mdi mdi-text-short"
            v-model="form.desc_curta"
            required
          />
        </div>
        <!-- Descrição Completa -->
        <div class="form-group">
          <label>Descrição Completa *</label>
          <textarea
            v-bind="limits.attrs('projeto', 'descricao')"
            v-model="form.descricao"
            rows="4"
            placeholder="Descrição detalhada do projeto..."
            required
          ></textarea>
          <FieldHint resource="projeto" field="descricao" :value="form.descricao" />
        </div>
        <!-- Status -->
        <div class="form-group">
          <label>Status</label>
          <select v-model="form.status" class="custom-select">
            <option value="EM_ANDAMENTO">Em Andamento</option>
            <option value="CONCLUIDO">Concluído</option>
          </select>
        </div>
        <!-- Sugestão (Checkbox) -->
        <div class="form-group checkbox-group">
          <label class="checkbox-label">
            <input type="checkbox" v-model="form.sugestao" />
            <span>É uma sugestão?</span>
          </label>
        </div>
        <!-- Ações do Modal -->
        <div class="modal-actions">
          <button type="button" class="btn-cancel" @click="$emit('close')">Cancelar</button>
          <appButton type="submit" :disabled="loading">
            {{ loading ? 'Salvando...' : 'Salvar Projeto' }}
          </appButton>
        </div>
      </form>
    </div>
    <imagesourcesheet
      v-if="showImageSheet"
      @select="handleFileSelected"
      @close="showImageSheet = false"
    />
  </div>
</template>
<style scoped src="./createProjectModal.css"></style>
