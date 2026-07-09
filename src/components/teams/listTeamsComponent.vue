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
      <li v-for="t in teamStore.teams" :key="t.id" @click="openTeam(t.id)">
        <div class="primeiro">
          <div class="img">
            <img
              :src="t.image_perfil?.file || 'https://via.placeholder.com/58'"
              alt="image_equipe"
            />
          </div>

          <div class="info">
            <h1>{{ t.nome }}</h1>

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
<style scoped>
/* ESTRUTURA */

.content {
  min-height: 85vh;
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-x: hidden;
}

.pagination-wrapper {
  margin-top: auto;
}

ul {
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
  margin-top: 20px;
}

li {
  width: 100%;
  display: flex;
  overflow: hidden;
  align-items: center;
  gap: 10px;
  box-sizing: border-box;
  background: #fff;
  padding: 14px 10px;
  margin-bottom: 14px;

  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
}

/* LADOS */
.primeiro {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.segundo {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

/* IMAGEM */
.img {
  display: flex;
  align-items: center;
  justify-content: center;
}

img {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

/* TEXTO ESQUERDA */
.info {
  flex: 1;
  min-width: 0;
}

h1 {
  margin: 0 0 7px 0;
  color: #0b4b78;
  font-size: 16px;
  font-weight: 700;
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

p {
  margin: 3px 0;
  font-size: 12px;
  color: #1f1f1f;

  display: flex;
  align-items: center;
  gap: 4px;
}

/* BORDA CENTRAL */
.border {
  width: 1px;
  align-self: stretch;
  background: #c8c8c8;
}

/* PROJETOS */

.projects {
  margin: 0 0 8px 0;
  font-size: 10px;
  color: #333;
  font-weight: 500;
  font-size: 10px;
}

.categoria {
  width: 100%;
  margin-top: 4px;
  padding: 3px 6px;

  background: #0b4b78;
  color: #fff;

  border-radius: 3px;
  font-size: 10p.5x;
  font-weight: 600;
  text-align: center;
}

.projetos {
  flex: 1;
  min-width: 0;
}

button {
  border: none;
  background: transparent;
  padding: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;
}

button .mdi-chevron-right {
  font-size: 25px;
  color: #0b4b78;
}
</style>
