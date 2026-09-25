<script setup>
import { useAuthStore } from '@/store/authStore'
import { useTeamStore } from '@/store/teamStore'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import appArrow from '../appArrow.vue'

const router = useRouter()
const authStore = useAuthStore()
const teamStore = useTeamStore()

const teamsUser = ref(null)

onMounted(async () => {
  const userId = authStore.user?.user_id || authStore.user?.id
  if (userId) {
    teamsUser.value = await teamStore.getTeamByUserId(userId)
  }
})

function teamSize(teachersCount = 0, studentsCount = 0) {
  return (teachersCount || 0) + (studentsCount || 0)
}

function goToTeam(id) {
  router.push({ name: 'teamDetails', params: { id } })
}
</script>

<template>
  <div class="top">
    <appArrow @back="router.back()"></appArrow>
  </div>

  <div class="static">
    <div class="left">
      <h2>Veja seus times da Robótica IFC</h2>
      <p>Acesse seus times, explore os projetos e colabore com sua equipe na robótica.</p>
    </div>
    <img src="/img/team/Coworking-rafiki 1.png" alt="Coworking" />
  </div>

  <h2 class="my-team-title">Minhas equipes</h2>

  <div class="teams" v-if="teamsUser && teamsUser.length">
    <ul class="t">
      <li v-for="t in teamsUser" :key="t.id" @click="goToTeam(t.id)">
        <!-- Imagem de perfil -->
        <img
          v-if="t.image_perfil?.file || t.image_perfil?.url"
          :src="t.image_perfil.file || t.image_perfil.url"
          :alt="t.nome"
        />
        <img v-else src="/img/Default.webp" alt="Sem imagem" />

        <!-- Lado esquerdo do card -->
        <div class="left">
          <h2 class="team-name">{{ t.nome }}</h2>
          <h3 class="leader-name" v-if="t.professores && t.professores.length">
            <span class="mdi mdi-account-outline"></span>
            <span>Líder: {{ t.professores[0]?.username }}</span>
          </h3>
          <h4 class="place-team" v-if="t.instituicao">
            <span class="mdi mdi-map-marker"></span>
            <span>{{ t.instituicao.sigla }}</span>
          </h4>
          <h4 class="total-members">
            <span class="mdi mdi-account-multiple-outline"></span>
            <span>{{ teamSize(t.professores?.length, t.alunos?.length) }} membros</span>
          </h4>
        </div>

        <!-- Lado direito do card com divisor de linha -->
        <div class="right">
          <h3 v-if="t.total_projetos > 0" class="total-projects">
            <span class="mdi mdi-folder-outline"></span>
            <span>{{ t.total_projetos }} projetos</span>
          </h3>
          <h3 v-else class="no-projects">Sem projetos</h3>

          <ul class="category" v-if="t.categorias && t.categorias.length">
            <template v-if="t.categorias.length <= 2">
              <li v-for="c in t.categorias" :key="c.id" class="categories">
                {{ c.nome }}
              </li>
            </template>
            <template v-else>
              <li class="categories">
                {{ t.categorias[0].nome }}
              </li>
              <li class="categories more-categories">+ mais categorias</li>
            </template>
          </ul>
        </div>

        <!-- Ícone da seta no final do card -->
        <span class="mdi mdi-chevron-right arrow-icon"></span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.top {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 15px;
}

div.static {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 0 15px 15px 15px;
  border-bottom: 1.5px solid #1c3248;

  & img {
    width: 45%;
    max-width: 180px;
  }

  & h2 {
    font-size: 20px;
    font-weight: 700;
    color: #1c3248;
    line-height: 1.2;
  }

  & p {
    font-size: 13px;
    color: #555;
    margin-top: 8px;
    line-height: 1.3;
  }

  & div.left {
    display: flex;
    flex-direction: column;
  }
}

.my-team-title {
  color: #1c3248;
  font-size: 20px;
  font-weight: 700;
  padding: 20px 15px 10px 15px;
}

.teams {
  padding: 0 15px;
}

.t {
  display: flex;
  flex-direction: column;
  gap: 15px;
  list-style: none;
  padding: 0;
  margin: 0;

  & li {
    display: flex;
    align-items: center;
    background-color: #ffffff;
    border-radius: 12px;
    padding: 16px 12px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);
    position: relative;
    cursor: pointer;

    /* Imagem do perfil do time */
    & img {
      width: 70px;
      height: 70px;
      aspect-ratio: 1 / 1;
      object-fit: cover;
      border-radius: 50%;
      flex-shrink: 0;
    }

    /* Coluna Esquerda */
    & div.left {
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin-left: 12px;
      flex: 1.1;

      & .team-name {
        font-size: 16px;
        font-weight: 700;
        color: #0d3859;
        margin-bottom: 2px;
      }

      & .leader-name,
      & .place-team,
      & .total-members {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 11px;
        color: #333333;
        font-weight: 400;

        & .mdi {
          font-size: 14px;
          color: #0d3859;
        }
      }
    }

    /* Coluna Direita com divisor à esquerda */
    & div.right {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding-left: 12px;
      border-left: 1px solid #dcdcdc;
      flex: 1;

      & .total-projects,
      & .no-projects {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        font-weight: 500;
        color: #222222;

        & .mdi {
          font-size: 16px;
          color: #0d3859;
        }
      }

      /* Lista de Tags de Categoria */
      & .category {
        display: flex;
        flex-direction: column;
        gap: 4px;
        list-style: none;
        padding: 0;
        margin: 0;

        & .categories {
          background-color: #0d3859;
          color: #ffffff;
          font-size: 10px;
          font-weight: 500;
          padding: 3px 8px;
          border-radius: 4px;
          width: fit-content;
          white-space: nowrap;
        }

        & .more-categories {
          background-color: #e2e8f0;
          color: #333333;
        }
      }
    }

    /* Seta da direita */
    & .arrow-icon {
      font-size: 22px;
      color: #0d3859;
      margin-left: 6px;
    }
  }
}
</style>