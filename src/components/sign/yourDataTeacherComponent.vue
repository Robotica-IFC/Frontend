<script setup>
import { useYourDataTeacher } from '@/composables/useYourDataTeacher'
import AuthLayout from '../layout/AuthLayout.vue'
import appInput from '../form/appInput.vue'
import appButton from '../form/appButton.vue'
import imagesourcesheet from '../imagesourcesheet.vue'
import stepComponent from '../stepComponent.vue'

const {
  templateStore,
  teacherStore,
  instituteStore,
  password,
  password2,
  newInstitute,
  mostrarDropdown,
  buscaInstituicao,
  passwordValue,
  passwordValue2,
  previewImage,
  showImageSheet,
  busy,
  loadingMessage,
  institutosFiltrados,
  instituicaoExata,
  mostrarBotaoNovo,
  handleSearchInput,
  selecionarInstituicao,
  handleFileSelected,
  handleCreateInstitute,
  prepararNovoCadastro,
  validacao,
} = useYourDataTeacher()
</script>
<template>
  <AuthLayout
    title="Informe seus dados de Professor"
    subtitle="Crie sua conta para ensinar e transformar ideias."
    icon="mdi-human-male-board-poll"
    :busy="busy"
    :loading-message="loadingMessage"
    @back="templateStore.sign = 0"
  >
    <form @submit.prevent="validacao()" class="mid teacher-data">
      <div class="inputs">
        <appInput
          placeholder="Nome completo"
          icon="mdi mdi-account"
          v-model="teacherStore.teacher.name"
          required
        />
        <appInput
          placeholder="Data de nascimento"
          icon="mdi mdi-calendar-multiselect"
          type="date"
          v-model="teacherStore.teacher.data_nascimento"
          required
        />
        <appInput
          placeholder="Telefone"
          icon="mdi mdi-phone"
          v-model="teacherStore.teacher.telefone"
          type="tel"
        />
        <appInput
          placeholder="E-Mail"
          icon="mdi mdi-email-outline"
          v-model="teacherStore.teacher.email"
          type="email"
          required
        />
        <div class="inst-container">
          <div class="search-box">
            <appInput
              placeholder="Pesquisar Instituto / Escola"
              icon="mdi mdi-town-hall"
              v-model="buscaInstituicao"
              @focus="mostrarDropdown = true"
              @input="handleSearchInput"
              required
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
                <button type="button" class="avatar-label" @click="showImageSheet = true">
                  <img :src="previewImage" alt="Logo" class="profile-pic" />
                  <div class="upload-icon"><i class="mdi mdi-camera"></i></div>
                </button>
                <span>Logo do instituto</span>
              </div>
              <appInput
                placeholder="Nome do instituto"
                icon="mdi mdi-town-hall"
                v-model="instituteStore.state.institute.nome"
              />
              <appInput
                placeholder="Sigla (Ex: USP)"
                icon="mdi mdi-label-outline"
                v-model="instituteStore.state.institute.sigla"
              />
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
              <appInput
                placeholder="Cidade"
                icon="mdi mdi-city"
                v-model="instituteStore.state.institute.cidade"
              />
              <appButton type="button" :disabled="busy" @click="handleCreateInstitute">{{
                busy ? 'Salvando...' : 'Salvar e selecionar'
              }}</appButton>
            </div>
          </div>
          <p v-if="instituicaoExata && !newInstitute" class="selected-msg">
            <i class="mdi mdi-check-circle"></i> Instituição vinculada
          </p>
        </div>
        <appInput
          placeholder="Senha"
          icon="mdi mdi-lock-open"
          v-model="passwordValue"
          :type="password ? 'text' : 'password'"
          required
        >
          <span
            @click="password = !password"
            :class="password ? 'mdi mdi-eye-off-outline' : 'mdi mdi-eye-outline'"
          ></span>
        </appInput>
        <appInput
          placeholder="Confirme a senha"
          icon="mdi mdi-lock-open"
          v-model="passwordValue2"
          :type="password2 ? 'text' : 'password'"
          required
        >
          <span
            @click="password2 = !password2"
            :class="password2 ? 'mdi mdi-eye-off-outline' : 'mdi mdi-eye-outline'"
          ></span>
        </appInput>
      </div>
      <appButton type="submit" :disabled="busy">Continuar</appButton>
    </form>
    <template #progress>
      <stepComponent
        :step="1"
        first="Inserir dados"
        second="Perfil"
        third="Verificação de e-mail"
      />
    </template>
  </AuthLayout>
  <imagesourcesheet
    v-if="showImageSheet"
    facing-mode="environment"
    @select="handleFileSelected"
    @close="showImageSheet = false"
  />
</template>
<style scoped src="./yourDataTeacherComponent.css"></style>
<style scoped src="./registrationDataLayout.css"></style>
