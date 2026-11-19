<script setup>
import ResourceFilters from '@/components/ResourceFilters.vue'
import { nextTick, ref, watch } from 'vue'
import { useProjectStore } from '@/store/projectsStore'
import router from '@/router'
import projectSuggestionBadge from '@/components/projects/projectSuggestionBadge.vue'
import Pagination from '@/components/paginationComponent.vue'
import ExpandablePostCaption from '@/components/posts/ExpandablePostCaption.vue'

const projectStore = useProjectStore()
const projectsSection = ref(null)
const requestedPage = ref(1)
const filters = ref({})
function applyFilters(value) {
  filters.value = value
  loadPage(1)
}

const props = defineProps({
  teamId: {
    type: [String, Number],
    required: true,
  },
})

function openProject(id) {
  router.push({ name: 'projectDetails', params: { id } })
}

async function loadPage(page, scroll = false) {
  requestedPage.value = page
  const loaded = await projectStore.getProjectsByTeam(props.teamId, page, filters.value)
  if (!loaded || !scroll) return
  await nextTick()
  projectsSection.value?.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    block: 'start',
  })
}

function changePage(page) {
  if (
    projectStore.teamLoading ||
    page === projectStore.teamCurrentPage ||
    page < 1 ||
    page > projectStore.teamTotalPages
  )
    return
  loadPage(page, true)
}

watch(
  () => props.teamId,
  () => loadPage(1),
  { immediate: true },
)
</script>

<template>
  <section ref="projectsSection" class="team-projects" :aria-busy="projectStore.teamLoading">
    <h1>Projetos da equipe</h1>
    <ResourceFilters team-only @change="applyFilters" />
    <p
      v-if="
        !projectStore.teamLoading &&
        !projectStore.teamErrorMessage &&
        !projectStore.teamProjects.length
      "
      class="section-message"
    >
      Nenhum projeto encontrado.
    </p>
    <p v-if="projectStore.teamLoading" class="section-message" role="status">
      Carregando projetos...
    </p>
    <p v-if="projectStore.teamErrorMessage" class="section-message" role="alert">
      {{ projectStore.teamErrorMessage }}
      <button type="button" @click="loadPage(requestedPage)">Tentar novamente</button>
    </p>

    <div
      class="projects"
      v-if="projectStore.teamProjects.length > 0"
      :inert="projectStore.teamLoading"
    >
      <article
        v-for="project in projectStore.teamProjects"
        :key="project.id"
        @click="openProject(project.id)"
      >
        <div class="card">
          <div class="image">
            <img
              v-if="project.image_perfil"
              :src="project.image_perfil.url || project.image_perfil.file"
              :alt="project.titulo"
            />

            <div v-else class="no-image">
              <span class="mdi mdi-robot-outline"></span>
            </div>
          </div>

          <div class="info">
            <h2>{{ project.titulo }}</h2>
            <projectSuggestionBadge v-if="project.sugestao" />
            <ExpandablePostCaption
              class="project-description"
              :text="project.desc_curta"
              desktop-clamp
              :desktop-lines="2"
            />

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
    <Pagination
      :current-page="projectStore.teamCurrentPage"
      :total-pages="projectStore.teamTotalPages"
      :inert="projectStore.teamLoading"
      aria-label="Paginação dos projetos da equipe"
      @change="changePage"
    />
  </section>
</template>

<style scoped src="./teamProjectsComponent.css"></style>
