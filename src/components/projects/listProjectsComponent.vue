<script setup>
import { onMounted, ref, computed } from 'vue'
import { useProjectStore } from '@/store/projectsStore'
import router from '@/router'

const store = useProjectStore()

const quantidade = ref(4)

const projetosVisiveis = computed(() => {
  return store.projects.slice(0, quantidade.value)
})
function openProject(id) {
  router.push({ name: 'projectDetails', params: { id } })
}

function verMais() {
  quantidade.value += 4
}

onMounted(() => {
  store.getProjects()
})
</script>

<template>
  <section class="container">
    <div class="grid">
      <article
        class="card"
        v-for="project in projetosVisiveis"
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

            <p class="desc-curta">
              {{ project.desc_curta }}
            </p>

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
              <button>Ver detalhes</button>
            </div>
          </div>
        </div>
      </article>
    </div>

    <div class="ver-mais" v-if="quantidade < store.projects.length">
      <button @click="verMais">Ver mais projetos</button>
    </div>
  </section>
</template>

<style scoped src="./listProjectsComponent.css"></style>
