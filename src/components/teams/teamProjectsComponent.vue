<script setup>
import { onMounted } from 'vue'
import { defineProps } from 'vue'
import { useProjectStore } from '@/store/projectsStore'
import router from '@/router'

const projectStore = useProjectStore()

const props = defineProps({
  teamId: {
    type: [String, Number],
    required: true,
  },
})

function openProject(id) {
  router.push({ name: 'projectDetails', params: { id } })
}

onMounted(() => {
  projectStore.getProjectsByTeam(props.teamId)
})
</script>

<template>
  <h1 v-if="projectStore.teamProjects.length > 0">Projetos da Equipe</h1>

  <div class="projects" v-if="projectStore.teamProjects.length > 0" >
    <article v-for="project in projectStore.teamProjects" :key="project.id" @click="openProject(project.id)">
      <div class="card">
        <div class="image">
          <img v-if="project.image_perfil" :src="project.image_perfil.file" :alt="project.titulo" />

          <div v-else class="no-image">
            <span class="mdi mdi-robot-outline"></span>
          </div>
        </div>

        <div class="info">
          <h2>{{ project.titulo }}</h2>
          <p>{{ project.desc_curta }}</p>

          <span class="status" :class="project.status?.toLowerCase()">
            {{
              project.status === 'EM_ANDAMENTO'
                ? 'Em andamento'
                : project.status === 'CONCLUIDO'
                  ? 'Concluído'
                  : 'Cancelado'
            }}
          </span>
        </div>
      </div>
    </article>
  </div>
</template>

<style scoped>
h1{
  color: var(--principal-claro);
  font-size: 23px;
  margin:18px 0;
}
.card {
  background: white;
  margin-bottom: 15px;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #ddd;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.12);
  transition: 0.2s;
  display: flex;
  width: 100%;
  height: 120px;
}

.image {
  width: 200px;
  height: 100%;
  flex-shrink: 0;
}

.image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.no-image {
  width: 100%;
  height: 100%;
  background: rgba(33, 150, 243, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
}

.info {
  padding: 20px;
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.no-image .mdi {
  font-size: 60px;
  color: #2196f3;
}

.status {
  padding: 4px 5px;
  border-radius: 5px;
  color: #ffff;
  font-size:11px;
  align-self: flex-start;
  display: -webkit-box;
}

.em_andamento {
  background: #003d66;
}
.concluido {
  background: #386641;
}
.cancelado {
  background: #b91c1c;
}
h2{
  font-size: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
p{
  font-size: 12px;
  margin-bottom: 10px;
  margin-top: 5px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>