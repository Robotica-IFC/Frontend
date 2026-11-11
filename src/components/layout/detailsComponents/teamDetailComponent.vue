<script setup>
import { defineProps, computed, ref, watch } from 'vue'
import appArrow from '@/components/appArrow.vue'
import requestToParticipateComponent from '@/components/requestToParticipateComponent.vue'
import teamProjectsComponent from '@/components/teams/teamProjectsComponent.vue'
import createProjectModal from '@/components/projects/createProjectModal.vue'
import { useTeamStore } from '@/store/teamStore'
import { useProjectStore } from '@/store/projectsStore.js'
import router from '@/router'
import { useAuthStore } from '@/store/authStore'
import { useStorageStore } from '@/store/storageStore'
import exitTeamComponent from '@/components/teams/exitTeamComponent.vue'
import membersOfTeamComponent from './membersOfTeamComponent.vue'
import teamSuggestionsComponent from '@/components/teams/teamSuggestionsComponent.vue'

const teamStore = useTeamStore()
const projectStore = useProjectStore()
const authStore = useAuthStore()
const storageStore = useStorageStore()

const isModalOpen = ref(false)
const selectedSuggestion = ref(null)
const showSuggestions = ref(false)

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

const team = computed(() => teamStore.actualTeam || {})

const isTeacher = computed(
  () => authStore.isAuthenticated && authStore.user?.tipo?.trim().toLowerCase() === 'professor',
)

function sameId(first, second) {
  if (first == null || second == null || first === '' || second === '') return false
  return (
    String(first).replaceAll('-', '').toLowerCase() ===
    String(second).replaceAll('-', '').toLowerCase()
  )
}

const isTeacherInTeam = computed(() => {
  if (
    !isTeacher.value ||
    !sameId(team.value.id, props.id) ||
    !Array.isArray(team.value.professores)
  )
    return false
  return team.value.professores.some((teacher) => {
    const profileId = teacher?.id ?? teacher
    const userId =
      teacher?.user?.id ??
      teacher?.user_id ??
      (typeof teacher?.user === 'object' ? null : teacher?.user)
    return sameId(profileId, authStore.user.id) || sameId(userId, authStore.user.user_id)
  })
})

const isStudentInTeam = computed(() => {
  if (
    !authStore.isAuthenticated ||
    authStore.user?.tipo?.trim().toLowerCase() !== 'aluno' ||
    !sameId(team.value.id, props.id) ||
    !Array.isArray(team.value.alunos)
  )
    return false
  return team.value.alunos.some((student) => {
    const profileId = student?.id ?? student
    const userId =
      student?.user?.id ??
      student?.user_id ??
      (typeof student?.user === 'object' ? null : student?.user)
    return sameId(profileId, authStore.user.id) || sameId(userId, authStore.user.user_id)
  })
})

const isMemberOfTeam = computed(() => isTeacherInTeam.value || isStudentInTeam.value)

watch(
  () => props.id,
  () => {
    showSuggestions.value = false
    isModalOpen.value = false
    selectedSuggestion.value = null
  },
)

watch(
  () => props.id,
  async () => {
    // 1. Busca os dados da equipe primeiro para poder avaliar os membros
    await teamStore.getTeamById(props.id, false)

    // 2. Se o usuário NÃO for membro da equipe, envia a requisição de visualização
    if (!isMemberOfTeam.value) {
      await teamStore.incrementView(props.id)
    }
  },
  { immediate: true },
)

async function handleProjectCreated() {
  await projectStore.getProjectsByTeam(props.id)
}

function openCreateProject(suggestion = null) {
  if (!isTeacherInTeam.value) return
  selectedSuggestion.value = suggestion
  isModalOpen.value = true
}

function closeSuggestions() {
  showSuggestions.value = false
  document.getElementById('toggle-team-suggestions')?.focus()
}

async function goToStorage() {
  const storageId = await storageStore.getOrCreateStorage(team.value.id)

  if (storageId) {
    router.push({ name: 'storage', params: { id: storageId } })
  }
}
</script>

<template>
  <div class="page">
    <div class="top">
      <appArrow @click="router.back()"></appArrow>
      <requestToParticipateComponent v-if="!isMemberOfTeam"></requestToParticipateComponent>
      <exitTeamComponent v-if="isMemberOfTeam" :teamId="props.id"></exitTeamComponent>
    </div>

    <div class="info">
      <div class="principal-info">
        <div class="logo-team">
          <img
            v-if="team.image_perfil?.url || team.image_perfil?.file"
            :src="team.image_perfil.url || team.image_perfil.file"
            alt="Logo da equipe"
          />

          <span v-else class="mdi mdi-account-group"></span>
        </div>
        <div class="principal-text">
          <h1>
            {{ team.nome }}
          </h1>
          <h2>
            <span class="mdi mdi-map-marker"></span>
            {{ team.professores?.[0]?.instituicao?.nome }} -
            {{ team.professores?.[0]?.instituicao?.cidade }}/{{
              team.professores?.[0]?.instituicao?.estado
            }}
          </h2>
          <h3 class="views">Visualizações: {{ team.views }}</h3>
        </div>
      </div>

      <p class="bio">
        {{ team.descricao }}
      </p>

      <ul class="categories">
        <li v-for="c in team.categorias" :key="c.id">
          {{ c.nome }}
        </li>
      </ul>
      <membersOfTeamComponent
        :teachers="team.professores"
        :students="team.alunos"
      ></membersOfTeamComponent>
    </div>
    <div class="creates">
      <button v-if="isMemberOfTeam" class="createProject" @click="goToStorage()">
        <span class="mdi mdi-archive"></span> Estoque da equipe
      </button>
      <button
        v-if="isMemberOfTeam"
        id="toggle-team-suggestions"
        type="button"
        class="createProject"
        :aria-expanded="showSuggestions"
        aria-controls="team-suggestions"
        @click="showSuggestions = !showSuggestions"
      >
        <span class="mdi mdi-lightbulb-on-outline" aria-hidden="true"></span>
        Ver sugestões
      </button>
      <button v-if="isTeacherInTeam" class="createProject" @click="openCreateProject()">
        <span class="mdi mdi-plus"></span> Criar projeto
      </button>
    </div>

    <p v-if="isTeacher && team.id && !isTeacherInTeam" class="team-access-message">
      As sugestões ficam disponíveis aos participantes vinculados a esta equipe.
    </p>

    <teamSuggestionsComponent
      v-if="isMemberOfTeam && showSuggestions"
      id="team-suggestions"
      :team-id="props.id"
      :can-manage="isTeacherInTeam"
      @create="openCreateProject"
      @close="closeSuggestions"
    />

    <div v-if="isTeacherInTeam && isModalOpen" class="project-overlay">
      <createProjectModal
        :id="props.id"
        :suggestion="selectedSuggestion"
        @close="isModalOpen = false"
        @created="handleProjectCreated"
      ></createProjectModal>
    </div>

    <teamProjectsComponent :team-id="props.id" />
  </div>
</template>

<style scoped src="./teamDetailComponent.css"></style>
