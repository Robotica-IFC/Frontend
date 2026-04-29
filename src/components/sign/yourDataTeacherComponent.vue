<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import appArrow from '../appArrow.vue'
import appInput from '../form/appInput.vue'
import appButton from '../form/appButton.vue'
import { useTemplateStore } from '@/store/template'
import { useTeacherStore } from '@/store/teacherStore'
import { useInstituteStore } from '@/store/instituteStore'

const templateStore = useTemplateStore()
const teacherStore = useTeacherStore()
const instituteStore = useInstituteStore()

const password = ref(false)
const password2 = ref(false)
const newInstitute = ref(false)
const mostrarDropdown = ref(false)

const buscaInstituicao = ref('')
const passwordValue = ref('')
const passwordValue2 = ref('')
const previewImage = ref('/img/default2.jpg')
const file = ref(null)

onMounted(async () => {
  await instituteStore.getInstitutes()
})

const institutosFiltrados = computed(() => {
  if (!buscaInstituicao.value || instituicaoExata.value) return []
  return instituteStore.institutes.filter((inst) =>
    inst.nome.toLowerCase().includes(buscaInstituicao.value.toLowerCase()),
  )
})

const instituicaoExata = computed(() => {
  return instituteStore.institutes.find(
    (inst) => inst.nome.toLowerCase() === buscaInstituicao.value.toLowerCase(),
  )
})

const mostrarBotaoNovo = computed(() => {
  return (
    buscaInstituicao.value.length > 2 &&
    !instituicaoExata.value &&
    institutosFiltrados.value.length === 0 &&
    !newInstitute.value
  )
})

watch(instituicaoExata, (val) => {
  if (val) {
    teacherStore.teacher.instituicao = val.id
  } else {
    teacherStore.teacher.instituicao = ''
  }
})

function handleSearchInput() {
  mostrarDropdown.value = true
  newInstitute.value = false
}

function selecionarInstituicao(inst) {
  buscaInstituicao.value = inst.nome
  teacherStore.teacher.instituicao = inst.id
  mostrarDropdown.value = false
}

function handleFileChange(e) {
  const selectedFile = e.target.files[0]
  if (selectedFile) {
    file.value = selectedFile
    previewImage.value = URL.createObjectURL(selectedFile)
  }
}

async function handleCreateInstitute() {
  try {
    const novoInst = await instituteStore.createInstitute(file.value)
    teacherStore.teacher.instituicao = novoInst.id
    buscaInstituicao.value = novoInst.nome
    newInstitute.value = false
  } catch (error) {
    console.error(error)
  }
}

function prepararNovoCadastro() {
  instituteStore.state.institute.nome = buscaInstituicao.value
  newInstitute.value = true
  mostrarDropdown.value = false
}

function validacao() {
  if (passwordValue.value !== passwordValue2.value) {
    alert('As senhas não coincidem')
    return
  }
  if (!teacherStore.teacher.instituicao) {
    alert('Selecione ou cadastre um instituto primeiro')
    return
  }
  teacherStore.teacher.password = passwordValue.value
  templateStore.teacherOrStudent = true
  templateStore.sign = 5
}
</script>

<template>
  <div class="page">
    <div class="top">
      <div class="arrow">
        <app-arrow @back="templateStore.sign = 0" />
      </div>
      <img src="/src/assets/gif/digitando.gif" alt="Robo-acenando" />
      <h2>Informe seus dados de Professor:</h2>
    </div>

    <form @submit.prevent="validacao()" class="mid">
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
          placeholder="CPF"
          icon="mdi mdi-card-account-details-outline"
          v-model="teacherStore.teacher.cpf"
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
                <label for="avatar-input" class="avatar-label">
                  <img :src="previewImage" alt="Logo" class="profile-pic" />
                  <div class="upload-icon"><i class="mdi mdi-camera"></i></div>
                </label>
                <input
                  id="avatar-input"
                  type="file"
                  accept="image/*"
                  @change="handleFileChange"
                  hidden
                />
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
              <appButton type="button" @click="handleCreateInstitute">Salvar e selecionar</appButton>
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
      <appButton type="submit">Continuar</appButton>
    </form>
    <div class="bottom"></div>
  </div>
</template>

<style scoped>
.top {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}
.arrow {
  width: 100%;
  display: flex;
}
img {
  width: 250px;
  height: auto;
}
h2 {
  font-size: 23px;
  margin: 25px 0 35px;
  text-align: center;
}
.inputs {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}
.inst-container {
  position: relative;
  margin: 0 auto;
}
.search-box {
  position: relative;
}
.custom-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
  max-height: 200px;
  overflow-y: auto;
  list-style: none;
  padding: 0;
  margin: 0;
}
.custom-dropdown li {
  padding: 10px 15px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: background 0.2s;
  border-bottom: 1px solid #f0f0f0;
  text-align: left;
}
.custom-dropdown li:hover {
  background: #f5f9ff;
}
.custom-dropdown .mdi {
  font-size: 20px;
  color: var(--principal-claro);
}
.inst-info {
  display: flex;
  flex-direction: column;
}
.inst-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}
.inst-loc {
  font-size: 11px;
  color: #777;
}
.new-inst {
  margin-top: 10px;
  padding: 10px;
  border-top: 1px dashed #ccc;
  animation: fadeIn 0.3s ease-in-out;
  border: solid var(--principal-claro) 1px;

}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
}
.avatar-label {
  position: relative;
  cursor: pointer;
}
.profile-pic {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--principal-claro);
  background: #f9f9f9;
}
.upload-icon {
  position: absolute;
  bottom: 0;
  right: 0;
  background: var(--principal-claro);
  color: white;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}
.avatar-container span {
  font-size: 12px;
  color: #888;
}
.input-row {
  border-bottom: 1px solid var(--principal-claro);
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  margin: 15px 0;
  padding: 5px 0;
  border: solid var(--principal-claro) 1px;
  border-radius: 5px;
}
.input-row label .mdi {
  color: #555;
  font-size: 22px;
  margin-left: 5px;
}
.app-select {
  border: none;
  outline: none;
  width: 100%;
  background: transparent;
  font-family: inherit;
  color: #333;
  font-size: 16px;
  cursor: pointer;
}
.not-found-box {
  margin: 10px auto;
  width: 100%;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.05);
  padding: 10px;
  border-radius: 8px;
  border: 1px dashed var(--principal-claro);
}
.btn-novo {
  background: var(--principal-claro);
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}
.selected-msg {
  color: #4caf50;
  font-size: 14px;
  text-align: center;
  margin-top: 5px;
  font-weight: bold;
}
</style>