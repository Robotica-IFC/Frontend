<script setup>
import { computed, reactive, ref } from 'vue'
import { useItemStore } from '@/store/itemStore'
import { ITEM_CATEGORIES } from '@/constants/itemCategories'
import appButton from '../form/appButton.vue'
import appInput from '../form/appInput.vue'
import imagesourcesheet from '../imagesourcesheet.vue'

const props = defineProps({
  estoqueId: {
    type: [Number, String],
    required: true,
  },
  item: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close', 'created', 'updated', 'deleted'])

const itemStore = useItemStore()

const isEdit = computed(() => !!props.item)

const loading = ref(false)
const deleting = ref(false)
const errorMessage = ref('')
const selectedFile = ref(null)
const imageRemoved = ref(false)
const imagePreview = ref(props.item?.imagem_detail?.file || props.item?.imagem_detail?.url || null)

const form = reactive({
  nome: props.item?.nome || '',
  quantidade: props.item?.quantidade ?? 1,
  descricao: props.item?.descricao || '',
  categoria: props.item?.categoria || ITEM_CATEGORIES[0].value,
  estoque: props.estoqueId,
})

const showImageSheet = ref(false)

function handleFileSelected(file) {
  if (selectedFile.value && imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value)
  }
  selectedFile.value = file
  imagePreview.value = URL.createObjectURL(file)
  imageRemoved.value = false
}

function removeImage() {
  if (selectedFile.value && imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value)
  }
  selectedFile.value = null
  imagePreview.value = null
  imageRemoved.value = true
}

async function handleSubmit() {
  errorMessage.value = ''

  if (!form.nome.trim()) {
    errorMessage.value = 'O nome do item é obrigatório.'
    return
  }

  if (form.nome.length > 40) {
    errorMessage.value = 'O nome deve ter no máximo 40 caracteres.'
    return
  }

  if (form.quantidade === null || form.quantidade === '' || Number(form.quantidade) < 0) {
    errorMessage.value = 'Informe uma quantidade válida.'
    return
  }

  if (!form.categoria) {
    errorMessage.value = 'Selecione uma categoria.'
    return
  }

  if (!form.estoque) {
    errorMessage.value = 'Estoque não informado.'
    return
  }

  try {
    loading.value = true

    const itemData = {
      nome: form.nome.trim(),
      quantidade: Number(form.quantidade),
      descricao: form.descricao.trim(),
      categoria: form.categoria,
      estoque: form.estoque,
    }

    if (isEdit.value) {
      if (imageRemoved.value) {
        itemData.imagem = null
      }
      const updated = await itemStore.updateItem(props.item.id, itemData, selectedFile.value)
      emit('updated', updated)
    } else {
      const created = await itemStore.createItem(itemData, selectedFile.value)
      emit('created', created)
    }

    emit('close')
  } catch (error) {
    console.error('Erro ao salvar item:', error)
    errorMessage.value = error.response?.data?.detail || 'Erro ao salvar o item.'
  } finally {
    loading.value = false
  }
}

async function handleDelete() {
  if (!isEdit.value) return
  if (!confirm('Deseja realmente excluir este item?')) return

  try {
    deleting.value = true
    await itemStore.deleteItem(props.item.id)
    emit('deleted', props.item.id)
    emit('close')
  } catch (error) {
    console.error('Erro ao excluir item:', error)
    errorMessage.value = 'Erro ao excluir o item.'
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-container">
      <div class="modal-header">
        <h2>{{ isEdit ? 'Editar Item' : 'Adicionar Item' }}</h2>
        <button class="close-btn" @click="$emit('close')">&times;</button>
      </div>

      <form @submit.prevent="handleSubmit" class="modal-body">
        <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>

        <div class="form-group align-center">
          <label>Imagem do Item</label>
          <div class="image-upload-wrapper">
            <button type="button" class="image-preview-container" @click="showImageSheet = true">
              <img v-if="imagePreview" :src="imagePreview" alt="Preview do Item" class="preview-img" />
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

        <imagesourcesheet
          v-if="showImageSheet"
          facing-mode="environment"
          @select="handleFileSelected"
          @close="showImageSheet = false"
        />

        <div class="form-group">
          <label>Nome *</label>
          <appInput
            placeholder="Nome do item (Max: 40 caracteres)"
            icon="mdi mdi-format-title"
            v-model="form.nome"
            maxlength="40"
            required
          />
          <small class="char-count" :class="{ danger: form.nome.length > 40 }">
            {{ form.nome.length }}/40 caracteres
          </small>
        </div>

        <div class="form-group">
          <label>Quantidade *</label>
          <input type="number" min="0" step="1" v-model.number="form.quantidade" class="custom-input" required />
        </div>

        <div class="form-group">
          <label>Categoria *</label>
          <select v-model="form.categoria" class="custom-select">
            <option v-for="cat in ITEM_CATEGORIES" :key="cat.value" :value="cat.value">
              {{ cat.label }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>Descrição</label>
          <textarea v-model="form.descricao" rows="4" placeholder="Descrição do item..."></textarea>
        </div>

        <div class="modal-actions">
          <button
            v-if="isEdit"
            type="button"
            class="btn-delete"
            @click="handleDelete"
            :disabled="deleting"
          >
            {{ deleting ? 'Excluindo...' : 'Excluir' }}
          </button>
          <div class="actions-right">
            <button type="button" class="btn-cancel" @click="$emit('close')">Cancelar</button>
            <appButton type="submit" :disabled="loading">
              {{ loading ? 'Salvando...' : 'Salvar Item' }}
            </appButton>
          </div>
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

  & h2 {
    color: var(--h2-titulo);
  }
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--texto-claro);
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

.form-group textarea,
.custom-input {
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.95rem;
  font-family: inherit;
}

.form-group textarea {
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

.image-upload-wrapper {
  position: relative;
  width: 110px;
  height: 110px;
}

.image-preview-container {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  font: inherit;
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
  color: var(--danger-claro);
  font-size: 0.875rem;
}

.modal-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
  flex-wrap: wrap;
}

.actions-right {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.btn-cancel {
  background: transparent;
  border: 1px solid #cbd5e1;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}

.btn-delete {
  margin-right: auto;
  background: transparent;
  border: 1px solid var(--danger-claro);
  color: var(--danger-claro);
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}

.btn-delete:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>