<script setup>
import { useEditProfile } from '@/composables/useEditProfile'
import appArrow from '@/components/appArrow.vue'
import appButton from '@/components/form/appButton.vue'
import appInput from '@/components/form/appInput.vue'
import imagesourcesheet from '@/components/imagesourcesheet.vue'

const {
  instituteStore,
  user,
  loading,
  formData,
  imagePreview,
  newInstitute,
  mostrarDropdown,
  buscaInstituicao,
  previewImageInstitute,
  showProfileSheet,
  showInstituteSheet,
  instituicaoExata,
  institutosFiltrados,
  mostrarBotaoNovo,
  closeEdit,
  handleSearchInput,
  selecionarInstituicao,
  handleFileInstituteSelected,
  prepararNovoCadastro,
  handleCreateInstitute,
  handleFileSelected,
  handleSave,
} = useEditProfile()
</script>

<template>
  <div class="modal-backdrop" @click.self="closeEdit()">
    <div class="page">
      <!-- X de fechar: aparece só no desktop -->
      <button type="button" class="close-btn" @click="closeEdit()">&times;</button>

      <div class="top">
        <appArrow @back="closeEdit"></appArrow>
      </div>

      <div class="edit-header">
        <div class="image-upload-container">
          <button type="button" class="image-label" @click="showProfileSheet = true">
            <img v-if="imagePreview" :src="imagePreview" class="profile-image-edit" />
            <div v-else class="profile-image-edit placeholder">
              <span class="mdi mdi-account-circle"></span>
            </div>
            <div class="upload-icon-main">
              <span class="mdi mdi-camera"></span>
            </div>
          </button>
        </div>
        <p>Toque na foto para alterar</p>
      </div>

      <form class="edit-form" @submit.prevent>
        <div class="input-group">
          <label>Nome Completo</label>
          <input v-model="formData.name" type="text" placeholder="Seu nome" />
        </div>

        <div class="input-group">
          <label>Username</label>
          <input v-model="formData.username" type="text" placeholder="@usuario" />
        </div>

        <div class="input-group">
          <label>Telefone</label>
          <input v-model="formData.telefone" type="text" placeholder="Apenas números" />
        </div>

        <div v-if="user?.tipo === 'professor'" class="input-group inst-container">
          <label>Instituição</label>
          <div class="search-box">
            <input
              v-model="buscaInstituicao"
              type="text"
              placeholder="Pesquisar Instituto / Escola"
              @focus="mostrarDropdown = true"
              @input="handleSearchInput"
            />

            <ul v-if="mostrarDropdown && institutosFiltrados.length > 0" class="custom-dropdown">
              <li
                v-for="inst in institutosFiltrados"
                :key="inst.id"
                @click="selecionarInstituicao(inst)"
              >
                <span class="mdi mdi-school-outline"></span>
                <div class="inst-info">
                  <span class="inst-name">{{ inst.nome }}</span>
                  <span class="inst-loc">{{ inst.cidade }} - {{ inst.estado }}</span>
                </div>
              </li>
            </ul>
          </div>

          <div v-if="mostrarBotaoNovo" class="not-found-box">
            <p>Não encontrou sua escola?</p>
            <button type="button" @click="prepararNovoCadastro" class="btn-novo">
              + Cadastrar Nova
            </button>
          </div>

          <div class="new-inst" v-if="newInstitute">
            <div class="form-interno">
              <div class="avatar-container">
                <button type="button" class="avatar-label" @click="showInstituteSheet = true">
                  <img :src="previewImageInstitute" alt="Logo" class="profile-pic-inst" />
                  <div class="upload-icon-inst"><i class="mdi mdi-camera"></i></div>
                </button>
                <span class="logo-subtext">Logo do instituto</span>
              </div>

              <div class="sub-input-group">
                <appInput
                  placeholder="Nome do instituto"
                  icon="mdi mdi-town-hall"
                  v-model="instituteStore.state.institute.nome"
                />
              </div>
              <div class="sub-input-group">
                <appInput
                  placeholder="Sigla (Ex: USP)"
                  icon="mdi mdi-label-outline"
                  v-model="instituteStore.state.institute.sigla"
                />
              </div>

              <div class="input-row">
                <label><span class="mdi mdi-map-marker-radius"></span></label>
                <select v-model="instituteStore.state.institute.estado" class="app-select">
                  <option value="" disabled selected>Estado</option>
                  <option
                    v-for="estado in instituteStore.state.estadosBrasil"
                    :key="estado"
                    :value="estado"
                  >
                    {{ estado }}
                  </option>
                </select>
              </div>

              <div class="sub-input-group">
                <appInput
                  placeholder="Cidade"
                  icon="mdi mdi-city"
                  v-model="instituteStore.state.institute.cidade"
                />
              </div>
              <appButton type="button" @click="handleCreateInstitute"
                >Salvar e selecionar</appButton
              >
            </div>
          </div>

          <p v-if="instituicaoExata && !newInstitute" class="selected-msg">
            <i class="mdi mdi-check-circle"></i> Instituição vinculada
          </p>
        </div>

        <div class="input-group">
          <label>Descrição (Bio)</label>
          <textarea
            v-model="formData.descricao"
            rows="4"
            placeholder="Conte um pouco sobre você..."
          ></textarea>
        </div>
      </form>

      <button class="save-btn" @click="handleSave" :disabled="loading">
        {{ loading ? 'Salvando...' : 'Salvar' }}
      </button>
      <appButton width="65%" @click="closeEdit" variant="danger">Cancelar</appButton>

      <imagesourcesheet
        v-if="showProfileSheet"
        facing-mode="user"
        @select="handleFileSelected"
        @close="showProfileSheet = false"
      />
      <imagesourcesheet
        v-if="showInstituteSheet"
        facing-mode="environment"
        @select="handleFileInstituteSelected"
        @close="showInstituteSheet = false"
      />
    </div>
  </div>
</template>

<style scoped src="./editModeComponent.css"></style>
