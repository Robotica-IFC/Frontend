<script setup>
import { onMounted } from 'vue'
import { defineProps } from 'vue'
import { useProjectStore } from '@/store/projectsStore'

const projectStore = useProjectStore()

const props = defineProps({
  teamId: {
    type: [String, Number],
    required: true,
  },
})

onMounted(() => {
  projectStore.getProjectsByTeam(props.teamId)
})
</script>

<template>
  <h1>Projetos da Equipe</h1>

  <div class="projects">
    <article v-for="project in projectStore.teamProjects" :key="project.id">
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
}

.no-image .mdi {
  font-size: 60px;
  color: #2196f3;
}

.status {
  padding: 2px 15px;
  border-radius: 5px;
  color: #ffff;
  font-size:12px
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
}
p{
  font-size: 12px;
  margin-bottom: 10px;
  margin-top: 5px;
}
</style>
