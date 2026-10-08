<script setup>
import { useAuthStore } from '@/store/authStore'
import { useTeamStore } from '@/store/teamStore'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import appArrow from '../appArrow.vue'
import appButton from '@/components/form/appButton.vue'

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
  <div class="my-teams">
    <div class="top">
      <appArrow @back="router.back()" />
    </div>

    <div class="static">
      <div class="left">
        <h2>Veja seus times da Robótica IFC</h2>
        <p>Acesse seus times, explore os projetos e colabore com sua equipe na robótica.</p>

        <!-- Resumo (apenas desktop) -->
        <div class="stat" v-if="teamsUser">
          <strong>
            <span class="mdi mdi-account-group"></span>
            {{ teamsUser.length }}
          </strong>
          <span>Suas equipes</span>
        </div>
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
            <h2 class="team-name"><span class="prefix">Equipe: </span>{{ t.nome }}</h2>
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

          <!-- Botão (apenas desktop). O clique sobe para o <li> e abre a equipe -->
          <div class="details-btn">
            <appButton variant="border" label="Ver Detalhes" />
          </div>

          <!-- Ícone da seta no final do card -->
          <span class="mdi mdi-chevron-right arrow-icon"></span>
        </li>
      </ul>
    </div>
    <p v-else-if="teamsUser" class="empty-teams">
      Você ainda não participa de nenhuma equipe.
    </p>
  </div>
</template>

<style scoped>
/* ============ MOBILE (base) ============ */
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

  & .stat {
    display: none;
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

.empty-teams {
  margin: 0 15px;
  padding: 20px 16px;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  color: #555;
  font-size: 14px;
  text-align: center;
}

.prefix {
  display: none;
}

.t {
  display: flex;
  flex-direction: column;
  gap: 15px;
  list-style: none;
  padding: 0;
  margin: 0;

  /* "> li" evita que o estilo do card vaze para as tags de categoria */
  & > li {
    display: flex;
    align-items: center;
    background-color: #ffffff;
    border-radius: 12px;
    padding: 16px 12px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);
    position: relative;
    cursor: pointer;

    /* Imagem do perfil do time */
    & > img {
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

    & .details-btn {
      display: none;
    }

    /* Seta da direita */
    & .arrow-icon {
      font-size: 22px;
      color: #0d3859;
      margin-left: 6px;
    }
  }
}

/* ============ DESKTOP ============ */
@media (min-width: 900px) {
  .my-teams {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 48px 64px;
  }

  .top {
    padding: 40px 0 0;
  }
  .top :deep(.mdi) {
    font-size: 40px;
  }

  /* Hero */
  div.static {
    position: relative;
    justify-content: space-between;
    gap: 48px;
    padding: 24px 0 80px;
    border-bottom: none;

    & div.left {
      max-width: 640px;
    }

    & h2 {
      font-size: clamp(36px, 3.6vw, 52px);
    }

    & p {
      margin-top: 28px;
      font-size: clamp(18px, 1.7vw, 26px);
      font-weight: 300;
      line-height: 1.3;
      color: var(--texto-claro);
    }

    & img {
      width: clamp(320px, 34vw, 520px);
      max-width: none;
    }

    & .stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: fit-content;
      margin-top: 40px;
      padding: 14px 32px;
      background: #ffffff;
      border-radius: 6px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
      color: var(--principal-claro);
      font-size: 20px;

      & strong {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 26px;
      }
    }

    /* Divisor centralizado */
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 70%;
      height: 1.5px;
      background: #1c3248;
    }
  }

  .my-team-title {
    padding: 56px 0 28px;
    font-size: 32px;
    color: var(--h2-titulo);
  }

  .teams {
    padding: 0;
  }

  .empty-teams {
    margin: 0;
  }

  .prefix {
    display: inline;
  }

  /* Grade de cards */
  .t {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 32px;

    & > li {
      display: grid;
      grid-template-columns: 1fr 1fr;
      column-gap: 16px;
      row-gap: 14px;
      align-items: center;
      padding: 28px 24px 24px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
      transition:
        transform 0.15s,
        box-shadow 0.15s;

      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 22px rgba(0, 0, 0, 0.16);
      }

      & > img {
        grid-column: 1 / -1;
        grid-row: 1;
        justify-self: center;
        width: 120px;
        height: 120px;
      }

      /* Os dois blocos "somem" e seus filhos entram direto no grid do card */
      & div.left {
        display: contents;

        & .team-name {
          grid-column: 1 / -1;
          grid-row: 2;
          text-align: center;
          font-size: 24px;
          margin: 0;
        }

        & .leader-name,
        & .place-team,
        & .total-members {
          font-size: 14px;

          & .mdi {
            font-size: 18px;
          }
        }

        & .leader-name {
          grid-column: 1;
          grid-row: 3;
        }
        & .place-team {
          grid-column: 2;
          grid-row: 3;
        }
        & .total-members {
          grid-column: 1;
          grid-row: 4;
        }
      }

      & div.right {
        display: contents;

        & .total-projects,
        & .no-projects {
          grid-column: 2;
          grid-row: 4;
          font-size: 14px;

          & .mdi {
            font-size: 18px;
          }
        }

        & .category {
          grid-column: 1 / -1;
          grid-row: 5;
          flex-direction: row;
          flex-wrap: nowrap;
          gap: 8px;
          margin-top: 6px;
          padding-top: 18px;
          border-top: 1px solid #dcdcdc;

          & .categories {
            flex: 1;
            min-width: 0;
            width: auto;
            padding: 7px 8px;
            font-size: 12px;
            text-align: center;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }

      & .details-btn {
        display: block;
        grid-column: 1 / -1;
        grid-row: 6;
        margin-top: 4px;
      }

      & .arrow-icon {
        display: none;
      }
    }
  }
}

/* Telas desktop menores */
@media (min-width: 900px) and (max-width: 1100px) {
  .my-teams {
    padding: 0 28px 48px;
  }
}
</style>