<script setup>
import { computed, defineProps, onMounted, onBeforeUnmount } from 'vue'
import { useTeacherStore } from '@/store/teacherStore'
import appArrow from '@/components/appArrow.vue'
import router from '@/router'

const teacherStore = useTeacherStore()

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
  await teacherStore.getTeacherById(props.id)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})

const teacher = computed(() => teacherStore.actualTeacher)
</script>

<template>
  <div class="modal-backdrop" @click.self="router.back()">
    <div class="page" v-if="teacher && teacher.user">
      <!-- X de fechar: aparece só no desktop -->
      <button type="button" class="close-btn" @click="router.back()">&times;</button>

      <div class="top">
        <appArrow @back="router.back"></appArrow>
      </div>

      <div class="data">
        <div class="first-data">
          <div class="name-image">
            <!-- IMAGEM DO PROFESSOR -->
            <div class="profile-image-container">
              <img
                v-if="teacher.imagem_perfil?.url || teacher.imagem_perfil?.file"
                class="profile-image"
                :src="`${teacher.imagem_perfil.url || teacher.imagem_perfil.file}?t=${cacheBust}`"
                :alt="teacher.user?.name"
              />

              <span v-else class="mdi mdi-account-circle profile-placeholder"></span>
            </div>

            <div>
              <h1>{{ teacher.user?.username }}</h1>
              <h2>{{ teacher.user?.email }}</h2>
              <h3>{{ teacher.user?.name }}</h3>
              <h4>
                {{ teacher.instituicao?.nome || teacher.instituicao || 'Não informada' }}
              </h4>
            </div>
          </div>

          <p class="desc">
            {{ teacher.descricao || 'Sem descrição 😢' }}
          </p>
        </div>
      </div>

      <!-- EQUIPES -->
      <div class="team" v-if="teacher.teams && teacher.teams.length > 0">
        <h1 class="team-title">Equipes Orientadas:</h1>

        <ul class="teams">
          <li v-for="t in teacher.teams" :key="t.id" @click="openTeam(t.id)">
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
        <h2>
          O(A) professor(a) {{ teacher.user.name }}
          não orienta nenhuma equipe no momento.
        </h2>
      </div>
    </div>

    <!-- CARREGANDO -->
    <div class="loading" v-else>
      <p>Carregando perfil do professor...</p>
    </div>
  </div>
</template>

<style scoped src="./teacherDetailComponent.css"></style>
