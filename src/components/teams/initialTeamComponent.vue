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
  <div class="top" style="margin-top: 100px">
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

<style scoped src="./initialTeamComponent.css"></style>
