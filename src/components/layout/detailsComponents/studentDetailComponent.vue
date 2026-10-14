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
                v-if="student.imagem_perfil?.url || student.imagem_perfil?.file"
                class="profile-image"
                :src="`${student.imagem_perfil.url || student.imagem_perfil.file}?t=${cacheBust}`"
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
              <img
                v-if="t.image_perfil?.url || t.image_perfil?.file"
                :src="t.image_perfil.url || t.image_perfil.file"
                :alt="t.nome"
              />

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

<style scoped src="./studentDetailComponent.css"></style>
