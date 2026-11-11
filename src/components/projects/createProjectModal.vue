
<script setup>
import { onBeforeUnmount, reactive, ref } from 'vue'

import { useProjectStore } from '@/store/projectsStore.js'
import { useFormLimits } from '@/composables/useFormLimits'
import { formatApiError } from '@/utils/formValidation'

import appInput from '../form/appInput.vue'
import imagesourcesheet from '../imagesourcesheet.vue'
import FieldHint from '@/components/form/FieldHint.vue'
import UploadHint from '@/components/form/UploadHint.vue'

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

const emit = defineEmits(['close', 'created'])

const projectStore = useProjectStore()
const limits = useFormLimits()

const loading = ref(false)
const errorMessage = ref('')
const selectedFile = ref(null)
const imagePreview = ref(null)
const showImageSheet = ref(false)

const form = reactive({
  titulo: props.suggestion?.titulo || '',
  desc_curta:
    props.suggestion?.descricao
      ?.trim()
      .replace(/\s+/g, ' ')
      .slice(0, 60) || '',
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
      sugestao: Boolean(props.suggestion) || form.sugestao,
      status: form.status,
      equipe: form.equipe,
    }

    await projectStore.createProject(
      projectData,
      selectedFile.value,
    )

    emit('created')
    emit('close')
  } catch (error) {
    console.error('Erro ao criar projeto:', error)

    errorMessage.value = formatApiError(
      error,
      'Erro ao criar o projeto.',
    )
  } finally {
    loading.value = false
  }
}

onBeforeUnmount(() => {
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value)
  }
})
</script>

<template>
  <div
    class="modal-backdrop"
    @click.self="$emit('close')"
  >
    <div
      class="modal-container"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-project-heading"
    >
      <div class="modal-header">
        <h2 id="create-project-heading">
          Criar Novo Projeto
        </h2>

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

      <form
        class="modal-body"
        @submit.prevent="handleSubmit"
      >
        <p
          v-if="errorMessage"
          role="alert"
          class="error-msg"
        >
          {{ errorMessage }}
        </p>

        <aside
          v-if="props.suggestion"
          class="source-suggestion"
        >
          <h3>
            A partir da sugestão:
            {{ props.suggestion.titulo }}
          </h3>

          <p>
            Você pode editar os dados antes de criar o projeto.
          </p>

          <ul
            v-if="props.suggestion.anexos?.length"
            aria-label="Anexos da sugestão"
          >
            <li
              v-for="(attachment, index) in props.suggestion.anexos"
              :key="attachment.attachment_key || index"
            >
              <a
                :href="attachment.url"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span
                  class="mdi mdi-file-pdf-box"
                  aria-hidden="true"
                ></span>

                {{
                  attachment.description ||
                  `Anexo ${index + 1} (PDF)`
                }}
              </a>
            </li>
          </ul>
        </aside>

        <!-- Imagem do projeto -->
        <div class="form-group align-center">
          <label>Imagem do Projeto</label>

          <UploadHint />

          <div class="image-upload-wrapper">
            <button
              type="button"
              class="image-preview-container"
              @click="showImageSheet = true"
            >
              <img
                v-if="imagePreview"
                :src="imagePreview"
                alt="Prévia da imagem do projeto"
                class="preview-img"
              />

              <div
                v-else
                class="upload-placeholder"
              >
                <i class="mdi mdi-camera-plus-outline"></i>
                <span>Adicionar Foto</span>
              </div>
            </button>

            <button
              v-if="imagePreview"
              type="button"
              class="btn-remove-image"
              title="Remover imagem"
              aria-label="Remover imagem"
              @click="removeImage"
            >
              <i class="mdi mdi-close"></i>
            </button>
          </div>
        </div>

        <!-- Título -->
        <div class="form-group">
          <label>Título *</label>

          <appInput
            v-model="form.titulo"
            resource="projeto"
            field="titulo"
            placeholder="Título do projeto"
            icon="mdi mdi-format-title"
            required
          />
        </div>

        <!-- Descrição curta -->
        <div class="form-group">
          <label>Descrição curta *</label>

          <appInput
            v-model="form.desc_curta"
            resource="projeto"
            field="desc_curta"
            placeholder="Resumo do projeto"
            icon="mdi mdi-text-short"
            required
          />
        </div>

        <!-- Descrição completa -->
        <div class="form-group">
          <label>Descrição Completa *</label>

          <textarea
            v-model="form.descricao"
            v-bind="limits.attrs('projeto', 'descricao')"
            rows="4"
            placeholder="Descrição detalhada do projeto..."
            required
          ></textarea>

          <FieldHint
            resource="projeto"
            field="descricao"
            :value="form.descricao"
          />
        </div>

        <!-- Status -->
        <div class="form-group">
          <label>Status</label>

          <select
            v-model="form.status"
            class="custom-select"
          >
            <option value="EM_ANDAMENTO">
              Em Andamento
            </option>

            <option value="CONCLUIDO">
              Concluído
            </option>
          </select>
        </div>

        <!-- Sugestão -->
        <div class="form-group checkbox-group">
          <label class="checkbox-label">
            <input
              v-model="form.sugestao"
              type="checkbox"
              :disabled="Boolean(props.suggestion)"
            />

            <span>
              Criado a partir de uma sugestão
            </span>
          </label>
        </div>

        <!-- Ações -->
        <div class="modal-actions">
          <button
            type="button"
            class="btn-cancel"
            :disabled="loading"
            @click="$emit('close')"
          >
            Cancelar
          </button>

          <button
            type="submit"
            class="btn-save"
            :disabled="loading"
          >
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
