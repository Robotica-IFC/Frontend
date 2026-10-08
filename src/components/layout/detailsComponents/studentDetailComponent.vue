<script setup>
import { computed, defineProps, onMounted, onBeforeUnmount } from 'vue'
import { useStudentStore } from '@/store/studentStore'
import appArrow from '@/components/appArrow.vue'
import router from '@/router'

const studentStore = useStudentStore()

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

// Evita baixar a imagem novamente a cada renderização
const cacheBust = Date.now()

function openTeam(id) {
  router.push({ name: 'teamDetails', params: { id } })
}

function handleKeydown(e) {
  if (e.key === 'Escape') router.back()
}

onMounted(async () => {
  window.addEventListener('keydown', handleKeydown)
  await studentStore.getStudentById(props.id)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})

const student = computed(() => studentStore.actualStudent)
</script>

<template>
  <div class="modal-backdrop" @click.self="router.back()">
    <div class="page" v-if="student && student.user">
      <!-- X de fechar: aparece só no desktop -->
      <button type="button" class="close-btn" @click="router.back()">&times;</button>

      <div class="top">
        <appArrow @back="router.back"></appArrow>
      </div>

      <div class="data">
        <div class="first-data">
          <div class="name-image">
            <!-- IMAGEM DO ALUNO -->
            <div class="profile-image-container">
              <img
                v-if="student.imagem_perfil?.file"
                class="profile-image"
                :src="`${student.imagem_perfil.file}?t=${cacheBust}`"
                :alt="student.user?.name"
              />

              <span v-else class="mdi mdi-account-circle profile-placeholder"></span>
            </div>

            <div>
              <h1>{{ student.user?.username }}</h1>
              <h3>{{ student.user?.name }}</h3>
            </div>
          </div>

          <p class="desc">{{ student.descricao || 'Sem descrição 😢' }}</p>
        </div>
      </div>

      <!-- EQUIPES -->
      <div class="team" v-if="student.teams && student.teams.length > 0">
        <h1 class="team-title">Equipes:</h1>

        <ul class="teams">
          <li v-for="t in student.teams" :key="t.id" @click="openTeam(t.id)">
            <!-- IMAGEM DA EQUIPE -->
            <div class="team-image">
              <img v-if="t.image_perfil?.file" :src="t.image_perfil.file" :alt="t.nome" />

              <span v-else class="mdi mdi-account-multiple-outline"></span>
            </div>

            <h2>{{ t.nome }}</h2>
          </li>
        </ul>
      </div>

      <!-- SEM EQUIPES -->
      <div class="no-teams" v-else>
        <h2>{{ student.user.name }} não participa de nenhuma equipe</h2>
      </div>
    </div>

    <!-- CARREGANDO -->
    <div class="loading" v-else>
      <p>Carregando perfil...</p>
    </div>
  </div>
</template>

<style scoped>
/* =========================================
   BACKDROP
========================================= */

/* no mobile o backdrop não interfere no layout */
.modal-backdrop {
  display: contents;
}

/* =========================================
   BOTÃO FECHAR
========================================= */

/* só aparece no desktop */
.close-btn {
  display: none;
}

/* =========================================
   PÁGINA
========================================= */

.page {
  width: 100%;
  position: relative;
}

.loading {
  text-align: center;
  padding: 40px;
  color: var(--principal-claro);
}

/* =========================================
   TOPO
========================================= */

.top {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 25px;
  margin-top: 30px;
}

/* =========================================
   DADOS DO ALUNO
========================================= */

div.first-data {
  padding: 10px 0;
}

.name-image {
  display: flex;
  align-items: center;
  gap: 15px;
}

.name-image div:last-child {
  width: 65%;
}

/* =========================================
   IMAGEM DO ALUNO
========================================= */

.profile-image-container {
  width: 32%;
  aspect-ratio: 1 / 1;
  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border: solid gray 1px;
  border-radius: 50%;
  overflow: hidden;

  background-color: var(--destaque-claro);
}

img.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.profile-placeholder {
  font-size: 45px;
  color: white;
}

/* =========================================
   TEXTOS DO ALUNO
========================================= */

.name-image div:last-child h1 {
  font-size: 25px;
  color: var(--principal-claro);
}

.name-image div:last-child h2,
.name-image div:last-child h3 {
  font-size: 12.5px;
  font-weight: 400;
  color: var(--texto-claro);
}

.desc {
  margin-top: 15px;
  font-size: 13.5px;
  text-align: justify;
  white-space: pre-line;
  word-wrap: break-word;
  color: var(--texto-claro);
}

/* =========================================
   EQUIPES
========================================= */

.team {
  margin-top: 30px;
}

h1.team-title {
  font-size: 25px;
  color: var(--principal-claro);
}

ul.teams {
  display: flex;
  flex-wrap: wrap;
  padding-top: 10px;
  gap: 20px;
  align-items: center;
  list-style: none;
}

ul.teams li {
  width: 25%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
  cursor: pointer;
}

/* =========================================
   IMAGEM DA EQUIPE
========================================= */

.team-image {
  width: 100%;
  aspect-ratio: 1 / 1;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;
  overflow: hidden;

  background-color: var(--destaque-claro);
}

.team-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.team-image .mdi {
  font-size: 45px;
  color: white;
}

ul.teams li h2 {
  text-align: center;
  font-size: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* =========================================
   SEM EQUIPES
========================================= */

.no-teams {
  margin-top: 30px;
  padding: 20px;
  border: 1px dashed var(--placeholder);
  border-radius: 10px;
  text-align: center;
}

.no-teams h2 {
  font-size: 14px;
  font-weight: 400;
  color: var(--placeholder);
}

/* =========================================
   DESKTOP: vira modal
========================================= */

@media (min-width: 950px) {
  .modal-backdrop {
    display: flex;
    position: fixed;
    inset: 0;

    align-items: center;
    justify-content: center;

    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
  }

  .page {
    width: 90%;
    max-width: 680px;
    max-height: 90vh;

    overflow-y: auto;

    padding: 32px;
    margin: 0;

    background: #fff;
    border-radius: 12px;

    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  }

  .loading {
    background: #fff;
    border-radius: 12px;
    padding: 40px 60px;
  }

  /* troca a seta pelo X */
  .top {
    display: none;
  }

  .close-btn {
    display: block;

    position: absolute;
    top: 12px;
    right: 18px;

    background: none;
    border: none;

    font-size: 1.8rem;
    line-height: 1;

    cursor: pointer;
    color: #334155;
  }

  .close-btn:hover {
    color: var(--principal-claro);
  }

  /* ALUNO */

  .name-image {
    gap: 24px;
  }

  .profile-image-container {
    width: 140px;
    height: 140px;
  }

  .profile-placeholder {
    font-size: 70px;
  }

  .name-image div:last-child {
    width: auto;
    min-width: 0;
  }

  .name-image div:last-child h1 {
    font-size: 1.7rem;
  }

  .name-image div:last-child h2,
  .name-image div:last-child h3 {
    font-size: 0.95rem;
  }

  .desc {
    font-size: 1rem;
    line-height: 1.5;
    margin-top: 20px;
  }

  /* EQUIPES */

  h1.team-title {
    font-size: 1.4rem;
  }

  ul.teams {
    gap: 24px;
  }

  ul.teams li {
    width: 110px;
  }

  .team-image {
    width: 110px;
    height: 110px;
  }

  .team-image .mdi {
    font-size: 40px;
  }

  ul.teams li h2 {
    font-size: 0.8rem;
  }
}
</style>
