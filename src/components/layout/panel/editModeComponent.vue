<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/store/authStore'
import { useStudentStore } from '@/store/studentStore'
import { useTeacherStore } from '@/store/teacherStore'
import appArrow from '@/components/appArrow.vue'
import router from '@/router'
import { useTemplateStore } from '@/store/template'
import api from '@/api/config'

const authStore = useAuthStore()
const studentStore = useStudentStore()
const teacherStore = useTeacherStore()

const user = authStore.user
const loading = ref(false)
const imageFile = ref(null)

// Estado reativo para o formulário
const formData = ref({
  name: user.name || '',
  username: user.username || '',
  descricao: user.descricao || '',
  telefone: user.telefone || '',
  instituicao: user.instituicao || '', // Apenas para professor
})

// Preview da imagem
const imagePreview = ref(user.imagem_perfil || '')

function handleFile(event) {
  const file = event.target.files[0]
  if (file) {
    imageFile.value = file
    imagePreview.ref = URL.createObjectURL(file)
  }
}

const handleSave = async () => {
  loading.value = true;
  const profileId = authStore.user.id;
  const userId = authStore.user.user.id;

  try {
    // 1. Dados do Perfil (Aluno/Professor)
    const profilePayload = {
      descricao: formData.value.descricao,
      telefone: formData.value.telefone,
    };

    // 2. Dados do Usuário (User)
    const userPayload = {
      name: formData.value.name,
      username: formData.value.username,
    };

    // ATUALIZAÇÃO DO ALUNO (Já funciona)
    if (authStore.user.tipo === 'aluno') {
      await studentStore.updateStudent(profileId, profilePayload);
    } else {
      await teacherStore.updateTeacher(profileId, profilePayload);
    }

    // ATUALIZAÇÃO DO USUÁRIO (Onde deu erro de credenciais)
    // Forçamos o header de autorização caso o interceptor falhe
    await api.patch(`/usuarios/${userId}/`, userPayload, {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`
      }
    });

    // 3. Atualiza o Pinia
    authStore.updateUserData({
      ...profilePayload,
      ...userPayload
    });

    alert("Perfil e usuário atualizados!");
    useTemplateStore().panel = true;

  } catch (error) {
  console.error("Erro detalhado:", error.response?.data);
  
  const backendErrors = error.response?.data;
  if (backendErrors && backendErrors.username) {
    alert("Este nome de usuário já está em uso. Escolha outro!");
  } else if (backendErrors) {
    // Lista outros erros (ex: email inválido, telefone curto)
    const mensagens = Object.values(backendErrors).flat().join('\n');
    alert("Erro na validação:\n" + mensagens);
  } else {
    alert("Erro de conexão ou autenticação.");
  }
} finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="top">
    <appArrow @back="useTemplateStore().panel = true"></appArrow>
    <button class="save-btn" @click="handleSave" :disabled="loading">
      {{ loading ? 'Salvando...' : 'Salvar' }}
    </button>
  </div>

  <div class="page">
    <div class="edit-header">
      <div class="image-upload-container">
        <img :src="imagePreview" class="profile-image-edit" />
        <label for="file-input" class="upload-icon">
          <span class="mdi mdi-camera"></span>
        </label>
        <input id="file-input" type="file" @change="handleFile" accept="image/*" hidden />
      </div>
      <p>Toque na câmera para alterar a foto</p>
    </div>

    <form class="edit-form" @submit.prevent>
      <div class="input-group">
        <label>Nome Completo</label>
        <input v-model="formData.name" type="text" placeholder="Seu nome">
      </div>

      <div class="input-group">
        <label>Username</label>
        <input v-model="formData.username" type="text" placeholder="@usuario">
      </div>

      <div class="input-group">
        <label>Telefone</label>
        <input v-model="formData.telefone" type="text" placeholder="Apenas números">
      </div>

      <div v-if="user.tipo === 'professor'" class="input-group">
        <label>Instituição</label>
        <input v-model="formData.instituicao" type="text" placeholder="Sua escola/faculdade">
      </div>

      <div class="input-group">
        <label>Descrição (Bio)</label>
        <textarea v-model="formData.descricao" rows="4" placeholder="Conte um pouco sobre você..."></textarea>
      </div>
    </form>
  </div>
</template>

<style scoped>
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
}

.profile-image-edit {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ddd;
}

.upload-icon {
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
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  cursor: pointer;
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

.input-group input, .input-group textarea {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  background: #f9f9f9;
}

.input-group textarea {
  resize: none;
}
</style>