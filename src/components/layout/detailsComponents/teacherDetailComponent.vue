<script setup>
import { computed, defineProps, onMounted } from 'vue'
import { useTeacherStore } from '@/store/teacherStore'
import appArrow from '@/components/appArrow.vue'
import router from '@/router'

const teacherStore = useTeacherStore()

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

function openTeam(id){
  router.push({ name: 'teamDetails', params: { id } })
}

onMounted(async () => {
    await teacherStore.getTeacherById(props.id)
})

const teacher = computed(() => teacherStore.actualTeacher)
</script>

<template>
  <div class="page" v-if="teacher && teacher.user">
    <div class="top">
      <appArrow @back="router.back"></appArrow>
    </div>
    
    <div class="data">
      <div class="first-data">
        <div class="name-image">
          <img
            class="profile-image"
            :src="teacher.imagem_perfil?.file ? `${teacher.imagem_perfil.file}?t=${Date.now()}` : ''"
            :alt="teacher.user?.name"
          />
          <div>
            <h1>{{ teacher.user?.username }}</h1>
            <h2>{{ teacher.user?.email }}</h2>
            <h3>{{ teacher.user?.name }}</h3>
            <h4>{{ teacher.instituicao?.nome || teacher.instituicao || 'Não informada' }}</h4>
          </div>
        </div>
        <p class="desc">
          {{ teacher.descricao || 'Sem descrição 😢' }}
        </p>
      </div>
    </div>
    
    <div class="team" v-if="teacher.teams && teacher.teams.length > 0">
      <h1 class="team-title">Equipes Orientadas:</h1>
      <ul class="teams">
        <li v-for="t in teacher.teams" :key="t.id" @click="openTeam(t.id)">
          <img :src="t.image_perfil?.file" :alt="t.nome">
          <h2>{{ t.nome }}</h2>
        </li>
      </ul>
    </div>
    <div class="no-teams" v-else>
      <h2>O(A) professor(a) {{ teacher.user.name }} não orienta nenhuma equipe no momento.</h2>
    </div>
  </div>

  <div class="loading" v-else>
    <p>Carregando perfil do professor...</p>
  </div>
</template>

<style scoped>
/* Reaproveita exatamente os mesmos estilos organizados que você usou em Students */
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
}

.name-image div {
  width: 65%;
}

.name-image div h1 {
  font-size: 25px;
  color: var(--principal-claro);
}

.name-image div h2,
.name-image div h3 {
  font-size: 12.5px;
  font-weight: 400;
  color: var(--texto-claro);
}

.desc {
  margin-top: 15px;
  font-size: 13.5px;
  color: var(--texto-claro);
}

.team {
  margin-top: 30px;
}

h1.team-title {
  font-size: 25px;
  color: var(--principal-claro);
}

ul.teams {
  display: flex;
  flex-wrap: wrap;
  padding-top: 10px;
  gap: 20px;
  align-items: center;
  list-style: none;
}

ul.teams li {
  width: 25%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
  cursor: pointer;
}

ul.teams li img {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 50%;
}

ul.teams li h2 {
  text-align: center;
  font-size: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.no-teams {
  margin-top: 30px;
  padding: 20px;
  border: 1px dashed var(--placeholder);
  border-radius: 10px;
  text-align: center;
}

.no-teams h2 {
  font-size: 14px;
  font-weight: 400;
  color: var(--placeholder);
}
</style>