<script setup>
import { storeToRefs } from 'pinia'
import appArrow from '@/components/appArrow.vue'
import { useTemplateStore } from '@/store/template'
import router from '@/router'
import { useAuthStore } from '@/store/authStore'
import appButton from '@/components/form/appButton.vue'
import { useTeamStore } from '@/store/teamStore'
import { onMounted, ref } from 'vue'

const templateStore = useTemplateStore()
const authStore = useAuthStore()
const teamStore = useTeamStore()

const { user } = storeToRefs(authStore)

const teamsUser = ref(null)

onMounted(async() => {
  teamsUser.value = await teamStore.getTeamByUserId(user.value.user_id)
  console.log(teamsUser)
})

function openTeam(id){
  router.push({name: 'teamDetails', params: { id }})
}
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
            <h3 v-if="user?.tipo === 'professor' && user?.instituicao">
              {{ typeof user.instituicao === 'object' ? user.instituicao?.nome : user.instituicao }}
            </h3>
          </div>
        </div>
        <p class="desc">{{ user?.descricao || 'Sem descrição 😢' }}</p>
      </div>
    </div>
    <div class="team" v-if="teamsUser && teamsUser.length > 0">
      <h1 class="team-title">Minhas equipes:</h1>
      <ul class="teams">
        <li v-for="t in teamsUser" :key="t.id" @click="openTeam(t.id)">
          <img :src="t.image_perfil?.file" :alt="t.nome" />
          <h2>{{ t.nome }}</h2>
        </li>
      </ul>
    </div>
    <div class="no-teams" v-else>
      <h2>{{ user?.name }} não participa de nenhuma equipe</h2>
    </div>
    <div class="equipe-card">
      <span class="mdi mdi-account-multiple-outline"></span>
      <div class="info-team">
        <h1>Envie solicitações para entrar nas equipes</h1>
        <p>Explore as equipes da Robótica IFC e envie uma solicitação para participar</p>
        <appButton font="13px" @click="router.push('/team')">Explorar equipes</appButton>
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
.team {
  margin-top: 30px;
}

ul.teams {
  display: flex;
  flex-wrap: wrap;
  padding-top: 10px;
  gap: 20px;
  align-items: center;
  list-style: none;

  & li {
    width: 15%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 2px;
    cursor: pointer;

    & img {
      width: 100%;
      aspect-ratio: 1 / 1;
      object-fit: cover;
      border-radius: 50%;
    }

    & h2 {
      text-align: center;
      font-size: 10px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

h1.team-title {
  font-size: 25px;
  color: var(--principal-claro);
}

.no-teams {
  margin-top: 30px;
  padding: 20px;
  border: 1px dashed var(--placeholder);
  border-radius: 10px;
  text-align: center;

  & h2 {
    font-size: 14px;
    font-weight: 400;
    color: var(--placeholder);
  }
}
</style>
