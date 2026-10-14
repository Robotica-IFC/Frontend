<script setup>
import { useCreateTeamModal } from '@/composables/useCreateTeamModal'
import appButton from '../form/appButton.vue'
import appInput from '../form/appInput.vue'
import imagesourcesheet from '../imagesourcesheet.vue'

const emit = defineEmits(['close', 'created'])

const {
  loading,
  errorMessage,
  imagePreview,
  showImageSheet,
  buscaCategoria,
  mostrarDropdown,
  newCategory,
  selectedCategories,
  form,
  categoriasFiltradas,
  mostrarBotaoNovo,
  handleSearchInput,
  adicionarCategoria,
  removerCategoria,
  prepararNovoCadastro,
  handleCreateCategory,
  handleFileSelected,
  removeImage,
  handleSubmit,
} = useCreateTeamModal(emit)
</script>

<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-container">
      <div class="modal-header">
        <h2>Criar Nova Equipe</h2>
        <button class="close-btn" @click="$emit('close')">&times;</button>
      </div>

      <form @submit.prevent="handleSubmit" class="modal-body">
        <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>

        <!-- Upload de Imagem Personalizado com Preview -->
        <div class="form-group align-center">
          <label>Imagem da Equipe *</label>
          <div class="image-upload-wrapper">
            <button type="button" class="image-preview-container" @click="showImageSheet = true">
              <img
                v-if="imagePreview"
                :src="imagePreview"
                alt="Preview da Equipe"
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

        <div class="form-group">
          <label>Nome da Equipe *</label>
          <appInput
            placeholder="Nome da equipe"
            icon="mdi mdi-account-group"
            v-model="form.nome"
            required
          />
        </div>

        <!-- Autocomplete de Múltiplas Categorias -->
        <div class="form-group cat-container">
          <label>Categorias *</label>

          <!-- Badges de Categorias Selecionadas -->
          <div v-if="selectedCategories.length > 0" class="selected-tags-container">
            <div v-for="cat in selectedCategories" :key="cat.id" class="category-tag">
              <span>{{ cat.nome }}</span>
              <button type="button" class="btn-remove-tag" @click="removerCategoria(cat.id)">
                &times;
              </button>
            </div>
          </div>

          <div class="search-box">
            <appInput
              placeholder="Pesquisar ou criar Categoria"
              icon="mdi mdi-tag-outline"
              v-model="buscaCategoria"
              @focus="mostrarDropdown = true"
              @input="handleSearchInput"
            />

            <ul v-if="mostrarDropdown && categoriasFiltradas.length > 0" class="custom-dropdown">
              <li v-for="cat in categoriasFiltradas" :key="cat.id" @click="adicionarCategoria(cat)">
                <span class="mdi mdi-tag-text-outline"></span>
                <span class="cat-name">{{ cat.nome }}</span>
              </li>
            </ul>
          </div>

          <!-- Caixa de "Não encontrou?" -->
          <div v-if="mostrarBotaoNovo" class="not-found-box">
            <p>Não encontrou a categoria?</p>
            <button type="button" @click="prepararNovoCadastro" class="btn-novo">
              + Cadastrar Nova
            </button>
          </div>

          <!-- Cadastro Rápido de Categoria -->
          <div class="new-cat" v-if="newCategory">
            <div class="form-interno">
              <appInput
                placeholder="Nome da Categoria"
                icon="mdi mdi-tag-plus"
                v-model="buscaCategoria"
              />
              <small class="hint">A categoria será salva em caixa alta.</small>
              <appButton type="button" @click="handleCreateCategory" class="btn-salvar-cat">
                Salvar e Adicionar
              </appButton>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label>Descrição</label>
          <textarea
            v-model="form.descricao"
            rows="3"
            placeholder="Descrição da equipe..."
          ></textarea>
        </div>

        <div class="modal-actions">
          <button type="button" class="btn-cancel" @click="$emit('close')">Cancelar</button>
          <appButton type="submit" :disabled="loading">
            {{ loading ? 'Salvando...' : 'Salvar Equipe' }}
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

<style scoped src="./createTeamModal.css"></style>
