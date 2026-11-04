<script setup>
import { onBeforeUnmount, ref, reactive } from 'vue'
import { useProjectStore } from '@/store/projectsStore.js'
import appInput from '../form/appInput.vue'
import imagesourcesheet from '../imagesourcesheet.vue'
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
  suggestion: {
    type: Object,
    default: null,
  },
})
const form = reactive({
  titulo: props.suggestion?.titulo || '',
  desc_curta: props.suggestion?.descricao?.trim().replace(/\s+/g, ' ').slice(0, 60) || '',
  descricao: props.suggestion?.descricao || '',
  sugestao: Boolean(props.suggestion),
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
  if (loading.value) return
  errorMessage.value = ''
  // Validações de obrigatoriedade e limites de caracteres
  if (!form.titulo.trim()) {
    errorMessage.value = 'O título do projeto é obrigatório.'
    return
  }
  if (form.titulo.length > 30) {
    errorMessage.value = 'O título deve ter no máximo 30 caracteres.'
    return
  }
  if (form.desc_curta && form.desc_curta.length > 60) {
    errorMessage.value = 'A descrição curta deve ter no máximo 60 caracteres.'
    return
  }
  if (!form.descricao || form.descricao.trim().length < 150) {
    errorMessage.value = 'A descrição completa deve ter no mínimo 150 caracteres.'
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
      sugestao: Boolean(props.suggestion) || form.sugestao,
      status: form.status,
      equipe: form.equipe,
    }
    await projectStore.createProject(projectData, selectedFile.value)
    emit('created')
    emit('close')
  } catch (error) {
    console.error('Erro ao criar projeto:', error)
    errorMessage.value = error.response?.data?.detail || 'Erro ao criar o projeto.'
  } finally {
    loading.value = false
  }
}

onBeforeUnmount(() => {
  if (imagePreview.value) URL.revokeObjectURL(imagePreview.value)
})
</script>
<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div
      class="modal-container"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-project-heading"
    >
      <div class="modal-header">
        <h2 id="create-project-heading">Criar Novo Projeto</h2>
        <button
          type="button"
          class="close-btn"
          aria-label="Fechar criação de projeto"
          :disabled="loading"
          @click="$emit('close')"
        >
          &times;
        </button>
      </div>
      <form @submit.prevent="handleSubmit" class="modal-body">
        <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>
        <aside v-if="props.suggestion" class="source-suggestion">
          <h3>A partir da sugestão: {{ props.suggestion.titulo }}</h3>
          <p>Você pode editar os dados antes de criar o projeto.</p>
          <ul v-if="props.suggestion.anexos?.length" aria-label="Anexos da sugestão">
            <li
              v-for="(attachment, index) in props.suggestion.anexos"
              :key="attachment.attachment_key"
            >
              <a :href="attachment.url" target="_blank" rel="noopener noreferrer">
                <span class="mdi mdi-file-pdf-box" aria-hidden="true"></span>
                {{ attachment.description || `Anexo ${index + 1} (PDF)` }}
              </a>
            </li>
          </ul>
        </aside>
        <!-- Upload da Imagem de Perfil do Projeto -->
        <div class="form-group align-center">
          <label>Imagem do Projeto</label>
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
          <appInput
            placeholder="Título do projeto (Max: 30 caracteres)"
            icon="mdi mdi-format-title"
            v-model="form.titulo"
            :maxlength="30"
            required
          />
          <small class="char-count" :class="{ danger: form.titulo.length > 30 }">
            {{ form.titulo.length }}/30 caracteres
          </small>
        </div>
        <!-- Descrição Curta -->
        <div class="form-group">
          <label>Descrição Curta</label>
          <appInput
            placeholder="Resumo do projeto (Max: 60 caracteres)"
            icon="mdi mdi-text-short"
            v-model="form.desc_curta"
            :maxlength="60"
          />
          <small class="char-count" :class="{ danger: form.desc_curta.length > 60 }">
            {{ form.desc_curta.length }}/60 caracteres
          </small>
        </div>
        <!-- Descrição Completa -->
        <div class="form-group">
          <label>Descrição Completa *</label>
          <textarea
            v-model="form.descricao"
            rows="4"
            placeholder="Descrição detalhada do projeto (Mínimo de 150 caracteres)..."
            required
          ></textarea>
          <small class="char-count" :class="{ danger: form.descricao.trim().length < 150 }">
            {{ form.descricao.trim().length }}/150 caracteres mínimos
          </small>
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
            <input type="checkbox" v-model="form.sugestao" :disabled="Boolean(props.suggestion)" />
            <span>Criado a partir de uma sugestão</span>
          </label>
        </div>
        <!-- Ações do Modal -->
        <div class="modal-actions">
          <button type="button" class="btn-cancel" :disabled="loading" @click="$emit('close')">
            Cancelar
          </button>
          <button type="submit" class="btn-save" :disabled="loading">
            {{ loading ? 'Salvando...' : 'Salvar Projeto' }}
          </button>
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
