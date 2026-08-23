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
            <img
              :src="t.image_perfil?.file || 'https://via.placeholder.com/100'"
              alt="image_equipe"
            />
          </div>

          <h1 class="titulo-desktop">{{ t.nome }}</h1>

          <div class="info-grid">
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
              {{ t.instituicao?.sigla || 'N/A' }} - {{ t.instituicao?.cidade || 'Local não informado' }}
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

<style scoped>
/* ESTRUTURA */

.content {
  min-height: 85vh;
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;
  padding: 4px 10px;
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
  box-sizing: border-box;
  margin-bottom: 14px;
}

/* Por padrão (mobile) mostra o layout antigo e esconde o novo */
.card-mobile {
  display: flex;
  align-items: center;
  gap: 10px;
  box-sizing: border-box;
  background: #fff;
  padding: 14px 10px;

  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
  cursor: pointer;
}

.card-desktop {
  display: none;
}

/* LADOS (layout mobile) */
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

/* IMAGEM (layout mobile) */
.img {
  display: flex;
  align-items: center;
  justify-content: center;
}

.img img {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

/* TEXTO ESQUERDA (layout mobile) */
.info {
  flex: 1;
  min-width: 0;
}

.card-mobile h1 {
  margin: 0 0 7px 0;
  color: #0b4b78;
  font-size: 16px;
  font-weight: 700;
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-mobile p {
  margin: 3px 0;
  font-size: 12px;
  color: #1f1f1f;

  display: flex;
  align-items: center;
  gap: 4px;
}

/* BORDA CENTRAL (layout mobile) */
.card-mobile .border {
  width: 1px;
  align-self: stretch;
  background: #c8c8c8;
}

/* PROJETOS (layout mobile) */
.projects {
  margin: 0 0 8px 0;
  font-size: 10px;
  color: #333;
  font-weight: 500;
}

.card-mobile .categoria {
  width: 100%;
  margin-top: 4px;
  padding: 3px 6px;

  background: #0b4b78;
  color: #fff;

  border-radius: 3px;
  font-size: 10.5px;
  font-weight: 600;
  text-align: center;
}

.projetos {
  flex: 1;
  min-width: 0;
}

.card-mobile button {
  border: none;
  background: transparent;
  padding: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;
}

.card-mobile button .mdi-chevron-right {
  font-size: 25px;
  color: #0b4b78;
}

/* ============================= */
/* LAYOUT NOVO (>= 950px) */
/* ============================= */
@media (min-width: 950px) {
  .content {
    width: 100%;
    max-width: none;
    box-sizing: border-box;
  }

  ul {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-bottom: 50px;
  }

  li {
    margin-bottom: 0;
  }

  .card-mobile {
    display: none;
  }

  .card-desktop {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    background: #fff;
    padding: 50px 16px;

    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
  }

  .img-desktop {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 14px;
  }

  .img-desktop img {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
  }

  .titulo-desktop {
    margin: 0 0 16px 0;
    color: #0b4b78;
    font-size: 18px;
    font-weight: 700;
    line-height: 1.2;
    text-align: center;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 10px;
    row-gap: 8px;
    width: 100%;
    margin-bottom: 14px;
  }

  .info-grid p {
    margin: 0;
    font-size: 12px;
    color: #1f1f1f;

    display: flex;
    align-items: center;
    gap: 4px;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .border-desktop {
    width: 100%;
    height: 1px;
    background: var(--principal-claro, #0b4b78);
    opacity: 0.5;
    margin-bottom: 14px;
  }

  .categorias {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
    width: 100%;
    margin-bottom: 14px;
  }

  .categoria-desktop {
    padding: 7px 14px;

    background: #0b4b78;
    color: #fff;

    border-radius: 4px;
    font-size: 11px;
    font-weight: 600;
    text-align: center;
    white-space: nowrap;
  }

  .ver-detalhes {
    width: 100%;
    margin-top: auto;
    border: 1px solid #0b4b78;
    background: transparent;
    color: #0b4b78;
    padding: 10px;

    border-radius: 6px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease;
  }

  .ver-detalhes:hover {
    background: #0b4b78;
    color: #fff;
  }
}
</style>
