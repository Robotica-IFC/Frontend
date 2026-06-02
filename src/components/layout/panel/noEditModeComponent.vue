<script setup>
import { storeToRefs } from 'pinia'
import appArrow from '@/components/appArrow.vue'
import { useTemplateStore } from '@/store/template'
import router from '@/router'
import { useAuthStore } from '@/store/authStore'
import appButton from '@/components/form/appButton.vue'

const templateStore = useTemplateStore()
const authStore = useAuthStore()

const { user } = storeToRefs(authStore)
</script>

<template>
  <div class="top">
    <appArrow @back="router.back"></appArrow>
    <span class="mdi mdi-square-edit-outline" @click="templateStore.panel = false"></span>
  </div>
  <div class="page">
    <div class="data">
      <div class="first-data">
        <div class="name-image">
          <img
            class="profile-image"
            :src="user?.imagem_perfil ? `${user.imagem_perfil}?t=${Date.now()}` : ''"
            :alt="user?.name"
          />
          <div>
            <h1>{{ user?.username }}</h1>
            <h2>{{ user?.email }}</h2>
            <h3>{{ user?.name }}</h3>
          </div>
        </div>
        <p class="desc">{{ user?.descricao || 'Sem descrição 😢' }}</p>
      </div>
    </div>
    <div class="equipe-card">
      <span class="mdi mdi-account-multiple-outline"></span>
      <div class="info-team">
        <h1>Envie solicitações para entrar nas equipes</h1>
        <p>Explore as equipes da Robótica IFC e envie uma solicitação para participar</p>
        <appButton font="13px">Explorar equipes</appButton>
      </div>
    </div>
    <div class="logout">
      <button class="danger" @click="authStore.logout()">
        <span class="mdi mdi-logout"></span> <span>Sair da conta</span>
      </button>
      <button class="danger">
        <span class="mdi mdi-trash-can-outline"></span> <span>Excluir conta</span>
      </button>
    </div>
  </div>
</template>
<style scoped>
.page {
  margin-top: -20px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}
.total {
  width: 100%;
  min-height: 100dvh;
  z-index: 999;
}

.top {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 15px;
}

.mdi {
  font-size: 25px;
}

div.first-data {
  padding: 10px;
}

img.profile-image {
  width: 32%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border: solid gray 1px;
  border-radius: 50%;
}

.name-image {
  display: flex;
  align-items: center;
  gap: 15px;

  & div {
    width: 50%;

    & h1 {
      font-size: 25px;
    }

    & h2,
    h3 {
      font-size: 12.5px;
      font-weight: 400;
    }
  }
}

.desc {
  margin-top: 10px;
  font-size: 13.5px;
  text-align: justify;
  white-space: pre-line;
  word-wrap: break-word;
}

.logout {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: left;
}

.danger {
  background-color: transparent;
  border: none;
  color: var(--danger-claro);
  display: flex;
  align-items: center;

  & span:last-child {
    margin-left: 5px;
    font-size: 16px;
  }

  & span.mdi {
    font-size: 25px;
  }

  &:active {
    transform: scale(0.95);
  }
}
.equipe-card {
  display: flex;
  align-items: start;
  width: 100%;
  border-radius: 10px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
  padding: 15px;

  & h1 {
    font-size: 17px;
    color: var(--principal-claro);
  }
  & span.mdi {
    font-size: 25px;
    color: var(--principal-claro);
    margin-right: 15px;
  }
  & p {
    font-size: 13px;
    margin-top: 5px;
  }
  & .info-team {
    display: flex;
    flex-direction: column;
    align-items: start;
    width: 100%;
  }
}
.mdi-logout {
  margin-left: 3px;
}
</style>
