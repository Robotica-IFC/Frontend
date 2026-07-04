<script setup>
import { computed, defineProps, onMounted } from 'vue'
import { useStudentStore } from '@/store/studentStore'
import appArrow from '@/components/appArrow.vue'
import router from '@/router'

const studentStore = useStudentStore()

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

function openTeam(id){
  router.push({name: 'teamDetails', params: { id }})
}

onMounted(async () => {
    await studentStore.getStudentById(props.id)
})

const student = computed(() => studentStore.actualStudent)
</script>

<template>
  <div class="page" v-if="student && student.user">
    <div class="top">
      <appArrow @back="router.back"></appArrow>
    </div>
    
    <div class="data">
      <div class="first-data">
        <div class="name-image">
          <img
            class="profile-image"
            :src="student.imagem_perfil?.file ? `${student.imagem_perfil.file}?t=${Date.now()}` : ''"
            :alt="student.user?.name"
          />
          <div>
            <h1>{{ student.user?.username }}</h1>
            <h3>{{ student.user?.name }}</h3>
          </div>
        </div>
        <p class="desc">{{ student.descricao || 'Sem descrição 😢' }}</p>
      </div>
    </div>
    
    <div class="team" v-if="student.teams && student.teams.length > 0">
      <h1 class="team-title">Equipes:</h1>
      <ul class="teams">
        <li v-for="t in student.teams" :key="t.id" @click="openTeam(t.id)">
          <img :src="t.image_perfil?.file" :alt="t.nome">
          <h2>{{ t.nome }}</h2>
        </li>
      </ul>
    </div>
    <div class="no-teams" v-else>
      <h2>{{ student.user.name }} não participa de nenhuma equipe</h2>
    </div>
  </div>

  <div class="loading" v-else>
    <p>Carregando perfil...</p>
  </div>
</template>

<style scoped>
.page {
  width: 100%;
  position: relative;
}

.loading {
  text-align: center;
  padding: 40px;
  color: var(--principal-claro);
}

.top {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 25px;
  margin-top: 30px;
}

.mdi {
  font-size: 25px;
  cursor: pointer;
}

div.first-data {
  padding: 10px 0;
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
    width: 65%;

    & h1 {
      font-size: 25px;
      color: var(--principal-claro);
    }

    & h2,
    h3 {
      font-size: 12.5px;
      font-weight: 400;
      color: var(--texto-claro);
    }
  }
}

.desc {
  margin-top: 15px;
  font-size: 13.5px;
  text-align: justify;
  white-space: pre-line;
  word-wrap: break-word;
  color: var(--texto-claro);
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
    width: 25%;
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
