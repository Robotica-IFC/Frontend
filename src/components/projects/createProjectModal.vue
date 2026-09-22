<script setup>
import { ref, reactive } from 'vue'
import { useProjectStore } from '@/store/projectsStore.js'
import { useTeamStore } from '@/store/teamStore'
import appButton from '../form/appButton.vue'
import appInput from '../form/appInput.vue'

const emit = defineEmits(['close', 'created'])
const projectStore = useProjectStore()
const teamStore = useTeamStore()

const loading = ref(false)
const errorMessage = ref('')
const selectedFile = ref(null)
const imagePreview = ref(null)

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

// Upload e Preview de Imagem
function handleFileUpload(event) {
  const file = event.target.files[0]
  if (file) {
    if (imagePreview.value) {
      URL.revokeObjectURL(imagePreview.value)
    }
    selectedFile.value = file
    imagePreview.value = URL.createObjectURL(file)
  }
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
      sugestao: form.sugestao,
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
</script>

<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-container">
      <div class="modal-header">
        <h2>Criar Novo Projeto</h2>
        <button class="close-btn" @click="$emit('close')">&times;</button>
      </div>

      <form @submit.prevent="handleSubmit" class="modal-body">
        <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>

        <!-- Upload da Imagem de Perfil do Projeto -->
        <div class="form-group align-center">
          <label>Imagem do Projeto</label>
          <div class="image-upload-wrapper">
            <label for="project-image-input" class="image-preview-container">
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
            </label>
            <input
              id="project-image-input"
              type="file"
              accept="image/*"
              class="hidden-file-input"
              @change="handleFileUpload"
            />
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
            placeholder="Título do projeto (Max: 20 caracteres)"
            icon="mdi mdi-format-title"
            v-model="form.titulo"
            maxlength="30"
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
            maxlength="60"
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
  </div>
</template>

<style scoped>
.char-count {
  font-size: 0.75rem;
  color: #64748b;
  text-align: right;
  margin-top: 2px;
}

.char-count.danger {
  color: #ef4444;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  background: #ffffff;
  width: 90%;
  max-width: 500px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #e2e8f0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.modal-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.align-center {
  align-items: center;
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #334155;
}

.form-group textarea {
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.95rem;
  font-family: inherit;
  resize: vertical;
}

.custom-select {
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.95rem;
  background-color: white;
  color: #334155;
  outline: none;
  cursor: pointer;
}

.checkbox-group {
  flex-direction: row;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  user-select: none;
}

.checkbox-label input[type='checkbox'] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.image-upload-wrapper {
  position: relative;
  width: 110px;
  height: 110px;
}

.image-preview-container {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px dashed #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;
  background: #f8fafc;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #64748b;
  font-size: 0.75rem;
  gap: 4px;
}

.hidden-file-input {
  display: none;
}

.btn-remove-image {
  position: absolute;
  top: 2px;
  right: 2px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.error-msg {
  color: #ef4444;
  font-size: 0.875rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
}

.btn-cancel {
  background: transparent;
  border: 1px solid #cbd5e1;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}
</style>