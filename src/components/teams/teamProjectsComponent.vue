<script setup>
import { onMounted } from 'vue'
import { defineProps } from 'vue'
import { useProjectStore } from '@/store/projectsStore'
import router from '@/router'
import projectSuggestionBadge from '@/components/projects/projectSuggestionBadge.vue'

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

  <div class="projects" v-if="projectStore.teamProjects.length > 0">
    <article
      v-for="project in projectStore.teamProjects"
      :key="project.id"
      @click="openProject(project.id)"
    >
      <div class="card">
        <div class="image">
          <AppImage
            :src="project.image_perfil?.url || project.image_perfil?.file"
            :alt="project.titulo" />
        </div>

        <div class="info">
          <h2>{{ project.titulo }}</h2>
          <projectSuggestionBadge v-if="project.sugestao" />
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

<style scoped src="./teamProjectsComponent.css"></style>
