<script setup>
import { useTeamStore } from '@/store/teamStore'
import { useAuthStore } from '@/store/authStore'
import { onMounted, computed, ref } from 'vue'
import appButton from '../form/appButton.vue'
import createTeamModal from './createTeamModal.vue'

const teamStore = useTeamStore()
const authStore = useAuthStore()

// Controla a visibilidade do modal
const showModal = ref(false)

// Verifica se o usuário logado é professor
const isProfessor = computed(() => {
  return authStore.user?.tipo?.toLowerCase() === 'professor'
})

function openModal() {
  showModal.value = true
}

function handleTeamCreated() {
  teamStore.getTeams() // Atualiza a lista e a contagem de equipes após criar
}

onMounted(() => {
  teamStore.getTeams()
})
</script>

<template>
  <div class="top" style="margin-top: 50px">
    <div class="inicio">
      <div class="text">
        <h1>Equipes</h1>
        <p>Conheça as equipes da Robótica IFC, seus membros e os projetos que desenvolvem.</p>
      </div>

      <div class="equipes">
        <p class="numero">
          <span class="mdi mdi-account-multiple"></span>
          {{ teamStore.totalTeams || 0 }}
        </p>
        <p v-if="teamStore.totalTeams > 1" class="texto-equipe">Equipes registradas</p>
        <p v-else class="texto-equipe">Equipe registrada</p>
      </div>

      <!-- Botão Desktop -->
      <appButton v-if="isProfessor" class="desktop" @click="openModal">
        Criar Equipe
      </appButton>
    </div>

    <!-- Botão Mobile -->
    <appButton v-if="isProfessor" class="mobile" @click="openModal">
      Criar Equipe
    </appButton>

    <img src="/img/team/computer-team.png" alt="computer" />

    <!-- Modal Renderizado Condicionalmente -->
    <createTeamModal
      v-if="showModal"
      @close="showModal = false"
      @created="handleTeamCreated"
    />
  </div>
</template>

<style scoped>
.desktop {
  display: none;
}

.inicio {
  display: flex;
  align-items: center;
}

.text h1 {
  color: var(--principal-claro);
  font-size: 25px;
}
.text p {
  font-weight: 400;
  font-size: 15px;
  margin-top: 10px;
  width: 85%;
}

.equipes {
  box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  text-align: center;
  color: var(--principal-claro);
  padding: 5px 15px;
  margin-left: 1px;
}
.equipes .texto-equipe {
  font-size: 13px;
}
.equipes .numero {
  font-size: 20px;
  font-weight: 600;
}

img {
  display: none;
}

@media (min-width: 950px) {
  .top {
    width: 100%;
    max-width: none;
    box-sizing: border-box;

    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .inicio {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 30px;

    flex: 1;
    min-width: 0;
  }

  img {
    display: block;
    width: 35%;
    max-width: 500px;
    margin-left: 100px;
  }

  .text {
    width: 100%;
  }

  .text h1 {
    font-size: 1.8rem;
  }

  .text p {
    font-size: 1.3rem;
    width: 85%;
  }

  .equipes {
    display: flex;
    padding: 10px 30px;
    align-items: center;
    justify-content: space-between;
  }

  .equipes p {
    font-size: 1.1rem;
    margin-left: 8px;
  }
  .mobile {
    display: none;
  }
  .desktop {
    display: block;
  }
}
</style>