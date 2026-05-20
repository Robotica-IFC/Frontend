<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/store/authStore'
import { useStudentStore } from '@/store/studentStore'
import { useTeacherStore } from '@/store/teacherStore'
import appArrow from '@/components/appArrow.vue'
import appButton from '@/components/form/appButton.vue'
import { useTemplateStore } from '@/store/template'
import api from '@/api/config'
import imageApi from '@/api/imageApi'

const authStore = useAuthStore()
const studentStore = useStudentStore()
const teacherStore = useTeacherStore()

const { user } = storeToRefs(authStore)
const loading = ref(false)
const imageFile = ref(null)

const formData = ref({
  name: user.value?.name || '',
  username: user.value?.username || '',
  descricao: user.value?.descricao || '',
  telefone: user.value?.telefone || '',
  instituicao: user.value?.instituicao || '',
})

const imagePreview = ref(user.value?.imagem_perfil || '')

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

const handleSave = async () => {
  loading.value = true;
  const profileId = authStore.user?.id;
  const userId = authStore.user?.user_id;

  try {
    const profilePayload = {
      descricao: formData.value.descricao,
      telefone: formData.value.telefone,
      instituicao: formData.value.instituicao,
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

    // Correção estratégica: Se uma nova imagem foi upada, usamos a URL dela.
    // Se não, mantemos o preview atual da tela (que contém a URL que já funcionava).
    const finalImageUrl = backendImageUrl || imagePreview.value;

    const updatedDataForStore = {
      name: freshProfile.usuario?.name || formData.value.name,
      username: freshProfile.usuario?.username || formData.value.username,
      descricao: freshProfile.descricao,
      telefone: freshProfile.telefone,
      instituicao: freshProfile.instituicao,
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
  <div class="top">
    <appArrow @back="useTemplateStore().panel = true"></appArrow>
  </div>

  <div class="page">
    <div class="edit-header">
      <div class="image-upload-container">
        <label for="file-input" class="image-label">
          <img :src="imagePreview" class="profile-image-edit" />
          <div class="upload-icon">
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

      <div v-if="user?.tipo === 'professor'" class="input-group">
        <label>Instituição</label>
        <input v-model="formData.instituicao" type="text" placeholder="Sua escola/faculdade" />
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
    <appButton @click="useTemplateStore().panel = true" variant="danger">Cancelar</appButton>
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
  margin-bottom: -13px;
}

.page {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 25px;
  width: 100%;
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
</style>
