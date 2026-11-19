<script setup>
import ResourceFilters from '@/components/ResourceFilters.vue'
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useProjectStore } from '@/store/projectsStore'
import router from '@/router'
import projectSuggestionBadge from './projectSuggestionBadge.vue'
import Pagination from '@/components/paginationComponent.vue'
import { scrollAfterPagination } from '@/utils/paginationScroll'
import ExpandablePostCaption from '@/components/posts/ExpandablePostCaption.vue'

const store = useProjectStore()
const projectsSection = ref(null)
const desktopQuery = window.matchMedia('(min-width: 950px)')
const pageSize = ref(desktopQuery.matches ? 4 : 2)
const requestedPage = ref(1)
const filters = ref({})
function applyFilters(value) {
  filters.value = value
  loadPage(1)
}

async function loadPage(page, scroll = false) {
  requestedPage.value = page
  const loaded = await store.getProjects(page, pageSize.value, filters.value)
  if (!loaded || !scroll) return

  await nextTick()
  if (projectsSection.value) scrollAfterPagination()
}

function changePage(page) {
  if (store.loading || page === store.currentPage || page < 1 || page > store.totalPages) return
  loadPage(page, true)
}

function updatePageSize(event) {
  pageSize.value = event.matches ? 4 : 2
  loadPage(1)
}

function openProject(id) {
  router.push({ name: 'projectDetails', params: { id } })
}

onMounted(() => {
  desktopQuery.addEventListener('change', updatePageSize)
  loadPage(1)
})

onBeforeUnmount(() => {
  desktopQuery.removeEventListener('change', updatePageSize)
})
</script>

<template>
  <section ref="projectsSection" class="container" :aria-busy="store.loading">
    <ResourceFilters @change="applyFilters" />
    <p v-if="store.loading" class="section-message" role="status">Carregando projetos...</p>
    <p v-else-if="store.errorMessage" class="section-message" role="alert">
      {{ store.errorMessage }}
      <button type="button" @click="loadPage(requestedPage, requestedPage !== store.currentPage)">Tentar novamente</button>
    </p>
    <p v-else-if="!store.projects.length" class="section-message">Nenhum projeto encontrado.</p>

    <div v-else class="grid">
      <article
        class="card"
        v-for="project in store.projects"
        :key="project.id"
        @click="openProject(project.id)"
      >
        <div class="left">
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
        </div>

        <div class="rigth">
          <span class="status" :class="project.status?.toLowerCase()">
            {{
              project.status === 'EM_ANDAMENTO'
                ? 'Em andamento'
                : project.status === 'CONCLUIDO'
                  ? 'Concluído'
                  : 'Cancelado'
            }}
          </span>

          <div class="content">
            <h2>{{ project.titulo }}</h2>
            <projectSuggestionBadge v-if="project.sugestao" />

            <ExpandablePostCaption
              class="desc-curta"
              :text="project.desc_curta"
              desktop-clamp
              :desktop-lines="2"
            />

            <div class="team">
              <div class="info-item">
                <span class="mdi mdi-account-group"></span>
                <span class="equipe">{{ project.equipe }}</span>
              </div>

              <div class="info-item">
                <span class="mdi mdi-map-marker"></span>
                <span class="instituicao">{{ project.instituicao }}</span>
              </div>
            </div>

            <div class="detalhe">
              <button type="button" class="details-button" @click.stop="openProject(project.id)">
                Ver detalhes
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>

    <Pagination
      :current-page="store.currentPage"
      :total-pages="store.totalPages"
      :inert="store.loading"
      aria-label="Paginação dos projetos"
      @change="changePage"
    />
  </section>
</template>

<style scoped src="./listProjectsComponent.css"></style>
