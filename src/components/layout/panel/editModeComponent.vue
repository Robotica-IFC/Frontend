<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/store/authStore'
import { useStudentStore } from '@/store/studentStore'
import { useTeacherStore } from '@/store/teacherStore'
import { useInstituteStore } from '@/store/instituteStore' // 🟢 Adicionado
import appArrow from '@/components/appArrow.vue'
import appButton from '@/components/form/appButton.vue'
import appInput from '@/components/form/appInput.vue' // 🟢 Adicionado para o form interno
import { useTemplateStore } from '@/store/template'
import api from '@/api/config'
import imageApi from '@/api/imageApi'

const authStore = useAuthStore()
const studentStore = useStudentStore()
const teacherStore = useTeacherStore()
const instituteStore = useInstituteStore() // 🟢 Adicionado

const { user } = storeToRefs(authStore)
const loading = ref(false)
const imageFile = ref(null)

// Estados para controle do fluxo do Instituto (Igual ao de criação)
const newInstitute = ref(false)
const mostrarDropdown = ref(false)
const buscaInstituicao = ref('')
const fileInstitute = ref(null)
const previewImageInstitute = ref('/img/default2.jpg')

const formData = ref({
  name: user.value?.name || '',
  username: user.value?.username || '',
  descricao: user.value?.descricao || '',
  telefone: user.value?.telefone || '',
  instituicao: user.value?.instituicao || '', // Irá armazenar o ID ou Objeto completo
})

const imagePreview = ref(user.value?.imagem_perfil || '')

onMounted(async () => {
  // Carrega a lista global de institutos ao abrir a edição
  await instituteStore.getInstitutes()
  
  // Inicializa o texto de busca caso o professor já tenha uma instituição vinculada
  if (user.value?.tipo === 'professor' && user.value?.instituicao) {
    buscaInstituicao.value = typeof user.value.instituicao === 'object'
      ? user.value.instituicao.nome
      : user.value.instituicao
  }
})

// --- LÓGICA DE BUSCA E FILTRO DE INSTITUTOS ---
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

// Garante que o ID no formData seja limpo ou atualizado com base no texto digitado
watch(instituicaoExata, (val) => {
  if (user.value?.tipo === 'professor') {
    if (val) {
      formData.value.instituicao = val.id
    } else if (!newInstitute.value) {
      formData.value.instituicao = ''
    }
  }
})

function handleSearchInput() {
  mostrarDropdown.value = true
  newInstitute.value = false
}

function selecionarInstituicao(inst) {
  buscaInstituicao.value = inst.nome
  formData.value.instituicao = inst.id
  mostrarDropdown.value = false
}

function handleFileInstituteChange(e) {
  const selectedFile = e.target.files[0]
  if (selectedFile) {
    fileInstitute.value = selectedFile
    previewImageInstitute.value = URL.createObjectURL(selectedFile)
  }
}

function prepararNovoCadastro() {
  instituteStore.state.institute.nome = buscaInstituicao.value
  newInstitute.value = true
  mostrarDropdown.value = false
}

async function handleCreateInstitute() {
  try {
    loading.value = true
    const novoInst = await instituteStore.createInstitute(fileInstitute.value)
    formData.value.instituicao = novoInst.id
    buscaInstituicao.value = novoInst.nome
    newInstitute.value = false
    alert("Nova instituição cadastrada e vinculada!")
  } catch (error) {
    console.error("Erro ao criar instituto:", error)
    alert("Falha ao cadastrar instituição.")
  } finally {
    loading.value = false
  }
}

function handleFile(event) {
  const file = event.target.files[0]
  if (file) {
    imageFile.value = file
    if (imagePreview.value.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview.value)
    }
    imagePreview.value = URL.createObjectURL(file)
  }
}

// --- SALVAMENTO FINAL DO PERFIL ---
const handleSave = async () => {
  if (user.value?.tipo === 'professor' && !formData.value.instituicao) {
    alert('Por favor, selecione ou cadastre uma instituição primeiro!');
    return;
  }

  loading.value = true;
  const profileId = authStore.user?.id;
  const userId = authStore.user?.user_id;

  try {
    const profilePayload = {
      descricao: formData.value.descricao,
      telefone: formData.value.telefone,
      instituicao: formData.value.instituicao, // Envia estritamente a String do UUID resolvida
    };

    const userPayload = {
      name: formData.value.name,
      username: formData.value.username,
    };

    let uploadedImageKey = null;
    let backendImageUrl = null;

    if (imageFile.value) {
      try {
        const imageFormData = new FormData();
        imageFormData.append('file', imageFile.value); 

        const imageResponse = await imageApi.uploadImage(imageFormData);
        uploadedImageKey = imageResponse.data?.id || imageResponse.data?.attachment_key;
        backendImageUrl = imageResponse.data?.url || imageResponse.data?.image || imageResponse.data?.file;
        
        if (uploadedImageKey) {
          profilePayload.imagem_perfil = uploadedImageKey; 
        }
      } catch (imgError) {
        console.error("Erro no upload da imagem:", imgError);
      }
    }

    if (authStore.user?.tipo === 'aluno') {
      await studentStore.updateStudent(profileId, profilePayload);
    } else {
      await teacherStore.updateTeacher(profileId, profilePayload);
    }

    await api.patch(`/usuarios/${userId}/`, userPayload, {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`
      }
    });

    const userTypeRoute = authStore.user?.tipo === 'aluno' ? 'alunos' : 'professores';
    const responseFreshData = await api.get(`/${userTypeRoute}/${profileId}/`, {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`
      }
    });

    const freshProfile = responseFreshData.data;
    const finalImageUrl = backendImageUrl || imagePreview.value;

    const updatedDataForStore = {
      name: freshProfile.usuario?.name || formData.value.name,
      username: freshProfile.usuario?.username || formData.value.username,
      descricao: freshProfile.descricao,
      telefone: freshProfile.telefone,
      instituicao: freshProfile.instituicao, // Agora virá atualizado como objeto do backend pelo GET depth=2
      imagem_perfil: finalImageUrl
    };

    authStore.updateUserData(updatedDataForStore);
    localStorage.setItem('user_profile_cache', JSON.stringify(updatedDataForStore));

    imageFile.value = null;
    alert("Perfil e usuário atualizados com sucesso!");
    useTemplateStore().panel = true;

  } catch (error) {
    console.error("Erro detalhado no salvamento:", error.response?.data || error.message);
    const backendErrors = error.response?.data;
    if (backendErrors && backendErrors.username) {
      alert("Este nome de usuário já está em uso. Escolha outro!");
    } else if (backendErrors && backendErrors.refresh) {
      alert("Sua sessão expirou. Por favor, faça login novamente.");
      authStore.logout();
    } else if (backendErrors) {
      const mensagens = Object.values(backendErrors).flat().join('\n');
      alert("Erro na validação:\n" + mensagens);
    } else {
      alert("Erro ao salvar as alterações. Verifique os dados.");
    }
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="page">
    <div class="top">
      <appArrow @back="useTemplateStore().panel = true"></appArrow>
    </div>
    
    <div class="edit-header">
      <div class="image-upload-container">
        <label for="file-input" class="image-label">
          <img :src="imagePreview" class="profile-image-edit" />
          <div class="upload-icon-main">
            <span class="mdi mdi-camera"></span>
          </div>
        </label>
        <input id="file-input" type="file" @change="handleFile" accept="image/*" hidden />
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
              <label for="avatar-input" class="avatar-label">
                <img :src="previewImageInstitute" alt="Logo" class="profile-pic-inst" />
                <div class="upload-icon-inst"><i class="mdi mdi-camera"></i></div>
              </label>
              <input
                id="avatar-input"
                type="file"
                accept="image/*"
                @change="handleFileInstituteChange"
                hidden
              />
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
            <appButton type="button" @click="handleCreateInstitute">Salvar e selecionar</appButton>
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
    <appButton width="65%" @click="useTemplateStore().panel = true" variant="danger">Cancelar</appButton>
  </div>
</template>

<style scoped>
/* Mantendo seus estilos originais intactos */
.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
}
.save-btn {
  background: var(--principal-claro, #007bff);
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 20px;
  font-weight: bold;
  width: 65%;
  margin: 0 auto -13px auto;
}
.page {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 25px;
}
.edit-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.image-upload-container {
  position: relative;
  width: 120px;
  height: 120px;
  cursor: pointer;
}
.image-label {
  cursor: pointer;
  display: block;
  width: 100%;
  height: 100%;
}
.profile-image-edit {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ddd;
  transition: opacity 0.2s;
}
.image-upload-container:hover .profile-image-edit {
  opacity: 0.8;
}
.upload-icon-main {
  position: absolute;
  bottom: 5px;
  right: 5px;
  background: white;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  pointer-events: none;
}
.edit-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.input-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.input-group label {
  font-size: 14px;
  font-weight: bold;
  color: #666;
}
.input-group input,
.input-group textarea {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  background: #f9f9f9;
}
.input-group textarea {
  resize: none;
}

/* 🟢 ESTILOS INJETADOS DA BUSCA E DO MINI-FORM DE INSTITUTOS */
.inst-container {
  position: relative;
}
.search-box {
  position: relative;
  width: 100%;
}
.search-box input {
  width: 100%;
  box-sizing: border-box;
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
  max-height: 180px;
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
}
.custom-dropdown li:hover {
  background: #f5f9ff;
}
.custom-dropdown .mdi {
  font-size: 20px;
  color: var(--principal-claro, #007bff);
}
.inst-info {
  display: flex;
  flex-direction: column;
  text-align: left;
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
.not-found-box {
  margin: 10px 0;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.03);
  padding: 10px;
  border-radius: 8px;
  border: 1px dashed var(--principal-claro, #007bff);
}
.btn-novo {
  background: var(--principal-claro, #007bff);
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  font-size: 13px;
  margin-top: 5px;
}
.new-inst {
  margin-top: 10px;
  padding: 15px;
  border-radius: 8px;
  background: #fff;
  border: solid var(--principal-claro, #007bff) 1px;
  animation: fadeIn 0.3s ease-in-out;
}
.sub-input-group {
  margin-bottom: 8px;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  margin-bottom: 15px;
}
.avatar-label {
  position: relative;
  cursor: pointer;
}
.profile-pic-inst {
  width: 65px;
  height: 65px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--principal-claro, #007bff);
}
.upload-icon-inst {
  position: absolute;
  bottom: 0;
  right: 0;
  background: var(--principal-claro, #007bff);
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
}
.logo-subtext {
  font-size: 12px;
  color: #888;
}
.input-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 12px 0;
  padding: 6px;
  border: solid var(--principal-claro, #007bff) 1px;
  border-radius: 5px;
  background: #f9f9f9;
}
.input-row label .mdi {
  color: #555;
  font-size: 20px;
  margin-left: 5px;
}
.app-select {
  border: none;
  outline: none;
  width: 100%;
  background: transparent;
  font-family: inherit;
  color: #333;
  font-size: 15px;
  cursor: pointer;
}
.selected-msg {
  color: #4caf50;
  font-size: 13px;
  text-align: center;
  margin-top: 5px;
  font-weight: bold;
}
</style>