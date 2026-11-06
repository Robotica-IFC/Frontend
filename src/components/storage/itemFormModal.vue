<script setup>
import UploadHint from '@/components/form/UploadHint.vue'
import { useItemFormModal } from '@/composables/useItemFormModal'
import { ITEM_CATEGORIES } from '@/constants/itemCategories'
import appButton from '../form/appButton.vue'
import appInput from '../form/appInput.vue'
import imagesourcesheet from '../imagesourcesheet.vue'
import FieldHint from '@/components/form/FieldHint.vue'
import { useFormLimits } from '@/composables/useFormLimits'

const limits = useFormLimits()

const props = defineProps({
  estoqueId: { type: [Number, String], required: true },
  item: { type: Object, default: null },
})
const emit = defineEmits(['close', 'created', 'updated', 'deleted'])
const {
  isEdit,
  loading,
  deleting,
  errorMessage,
  imagePreview,
  form,
  showImageSheet,
  handleFileSelected,
  removeImage,
  handleSubmit,
  handleDelete,
} = useItemFormModal(props, emit)
</script>
<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-container">
      <div class="modal-header">
        <h2>{{ isEdit ? 'Editar Item' : 'Adicionar Item' }}</h2>
        <button class="close-btn" @click="$emit('close')">&times;</button>
      </div>
      <form @submit.prevent="handleSubmit" class="modal-body">
        <p v-if="errorMessage" role="alert" class="error-msg">{{ errorMessage }}</p>
        <div class="form-group align-center">
          <label>Imagem do Item</label>
          <UploadHint />
          <div class="image-upload-wrapper">
            <button type="button" class="image-preview-container" @click="showImageSheet = true">
              <img
                v-if="imagePreview"
                :src="imagePreview"
                alt="Preview do Item"
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
        <imagesourcesheet
          v-if="showImageSheet"
          facing-mode="environment"
          @select="handleFileSelected"
          @close="showImageSheet = false"
        />
        <div class="form-group">
          <label>Nome *</label>
          <appInput resource="item" field="nome"
            placeholder="Nome do item"
            icon="mdi mdi-format-title"
            v-model="form.nome"
            required
          />
        </div>
        <div class="form-group">
          <label>Quantidade *</label>
          <input
            v-bind="limits.attrs('item', 'quantidade')"
            type="number"
            min="0"
            step="1"
            v-model.number="form.quantidade"
            class="custom-input"
            required
          />
          <FieldHint resource="item" field="quantidade" :value="form.quantidade" />
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
          <textarea v-model="form.descricao" v-bind="limits.attrs('item', 'descricao')" rows="4" placeholder="Descrição do item..."></textarea>
          <FieldHint resource="item" field="descricao" :value="form.descricao" />
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
<style scoped src="./itemFormModal.css"></style>
