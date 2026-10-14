<script setup>
import { useTeamStore } from '@/store/teamStore'
import { onMounted } from 'vue'
import Pagination from '@/components/paginationComponent.vue'
import router from '@/router'

const teamStore = useTeamStore()

function openTeam(id) {
  router.push({ name: 'teamDetails', params: { id } })
}

onMounted(() => {
  teamStore.getTeams()
})
</script>

<template>
  <div class="content">
    <ul>
      <li v-for="t in teamStore.teams" :key="t.id">
        <!-- LAYOUT ORIGINAL (< 950px) -->
        <div class="card-mobile" @click="openTeam(t.id)">
          <div class="primeiro">
            <div class="img">
              <img
                :src="t.image_perfil?.url || 'https://via.placeholder.com/58'"
                alt="image_equipe"
              />
            </div>

            <div class="info">
              <h1>{{ t.nome }}</h1>

              <p>
                <span class="mdi mdi-account-outline"></span>
                Líder:
                {{
                  t.professores?.[0]?.user?.username ||
                  t.professores?.[0]?.user?.name ||
                  'Sem líder'
                }}
              </p>

              <p>
                <span class="mdi mdi-map-marker" style="color: var(--principal-claro)"></span>
                {{ t.instituicao?.sigla || 'N/A' }} -
                {{ t.instituicao?.cidade || 'Local não informado' }}
              </p>

              <p>
                <span class="mdi mdi-account-multiple-outline"></span>
                {{ (t.alunos?.length || 0) + (t.professores?.length || 0) }} membros
              </p>
            </div>
          </div>

          <div class="border"></div>

          <div class="segundo">
            <div class="projetos">
              <p class="projects">
                <span class="mdi mdi-folder-outline"></span>
                {{ t.total_projetos }} projetos
              </p>
              <p v-for="c in t.categorias?.slice(0, 2)" :key="c.id" class="categoria">
                {{ c.nome }}
              </p>
            </div>
            <button><span class="mdi mdi-chevron-right"></span></button>
          </div>
        </div>

        <!-- LAYOUT NOVO (>= 950px) -->
        <div class="card-desktop">
          <div class="img-desktop">
            <div class="img">
              <img v-if="t.image_perfil?.url" :src="t.image_perfil.url" alt="image_equipe" />

              <span v-else class="mdi mdi-account-group"></span>
            </div>
          </div>

          <h1 class="titulo-desktop">{{ t.nome }}</h1>

          <div class="info-grid">
            <p>
              <span class="mdi mdi-account-outline"></span>
              Líder:
              {{
                t.professores?.[0]?.user?.username || t.professores?.[0]?.user?.name || 'Sem líder'
              }}
            </p>

            <p>
              <span class="mdi mdi-map-marker" style="color: var(--principal-claro)"></span>
              {{ t.instituicao?.sigla || 'N/A' }} -
              {{ t.instituicao?.cidade || 'Local não informado' }}
            </p>

            <p>
              <span class="mdi mdi-account-multiple-outline"></span>
              {{ (t.alunos?.length || 0) + (t.professores?.length || 0) }} membros
            </p>

            <p>
              <span class="mdi mdi-folder-outline"></span>
              {{ t.total_projetos }} projetos
            </p>
          </div>

          <div class="border-desktop"></div>

          <div class="categorias" v-if="t.categorias?.length">
            <p v-for="c in t.categorias?.slice(0, 3)" :key="c.id" class="categoria-desktop">
              {{ c.nome }}
            </p>
          </div>

          <button class="ver-detalhes" @click="openTeam(t.id)">Ver Detalhes</button>
        </div>
      </li>
    </ul>

    <Pagination
      class="pagination-wrapper"
      :currentPage="teamStore.currentPage"
      :totalPages="teamStore.totalPages"
      @change="
        (page) => {
          teamStore.getTeams(page)
        }
      "
    />
  </div>
</template>

<style scoped src="./listTeamsComponent.css"></style>
