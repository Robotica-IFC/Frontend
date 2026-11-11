<script setup>
import { useHomeHighlightsStore } from '@/store/homeHighlightsStore'
import { rememberHomeSection } from '@/utils/homeNavigation'

const highlights = useHomeHighlightsStore()
const statusLabels = {
  EM_ANDAMENTO: 'Em andamento',
  CONCLUIDO: 'Concluído',
  CANCELADO: 'Cancelado',
}
</script>

<template>
  <section
    id="featured-projects"
    class="featured-projects"
    aria-labelledby="featured-projects-heading"
  >
    <h2 id="featured-projects-heading">Projetos em destaque</h2>
    <p v-if="highlights.errors.projects" class="section-message" role="alert">
      {{ highlights.errors.projects }}
      <button type="button" @click="highlights.refresh()">Tentar novamente</button>
    </p>
    <p
      v-if="highlights.loading.projects && !highlights.projects.length"
      class="section-message"
      role="status"
    >
      Carregando projetos em destaque...
    </p>
    <p
      v-else-if="!highlights.projects.length && !highlights.errors.projects"
      class="section-message"
    >
      Nenhum projeto disponível nas equipes em destaque.
    </p>
    <div v-else-if="highlights.projects.length" class="projects-grid">
      <article v-for="project in highlights.projects" :key="project.id" class="project-card">
        <RouterLink
          class="project-open-link"
          :to="{ name: 'projectDetails', params: { id: project.id } }"
          :aria-label="`Abrir projeto ${project.titulo}`"
          @click="rememberHomeSection('featured-projects')"
        />
        <img
          v-if="project.image_perfil?.url || project.image_perfil?.file"
          class="project-image"
          :src="project.image_perfil.url || project.image_perfil.file"
          :alt="project.titulo"
        />
        <div v-else class="project-image image-placeholder">
          <span class="mdi mdi-robot-outline" aria-hidden="true"></span>
        </div>
        <div class="project-content">
          <h3>{{ project.titulo }}</h3>
          <div class="project-meta">
            <RouterLink
              class="project-team"
              :to="{ name: 'teamDetails', params: { id: project.equipe_id } }"
              :aria-label="`Ver equipe ${project.equipe}`"
            >
              <img
                v-if="project.equipe_image"
                class="team-avatar"
                :src="project.equipe_image"
                :alt="`Logo da equipe ${project.equipe}`"
              />
              <span v-else class="mdi mdi-account-group" aria-hidden="true"></span>
              <span
                ><strong>Equipe:</strong> <span class="team-name">{{ project.equipe }}</span></span
              >
            </RouterLink>
            <span class="project-status" :class="project.status?.toLowerCase()">
              {{ statusLabels[project.status] || project.status }}
            </span>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped src="./featuredProjectsComponent.css"></style>
