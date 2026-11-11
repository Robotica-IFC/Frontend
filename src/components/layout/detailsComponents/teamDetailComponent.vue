
<script setup>
import { computed, ref, watch } from 'vue'
import appArrow from '@/components/appArrow.vue'
import requestToParticipateComponent from '@/components/requestToParticipateComponent.vue'
import teamProjectsComponent from '@/components/teams/teamProjectsComponent.vue'
import createProjectModal from '@/components/projects/createProjectModal.vue'
import EditTeamModal from '@/components/teams/EditTeamModal.vue'
import InviteTeamModal from '@/components/teams/InviteTeamModal.vue'
import TeamJoinRequests from '@/components/teams/TeamJoinRequests.vue'
import teamSuggestionsComponent from '@/components/teams/teamSuggestionsComponent.vue'
import exitTeamComponent from '@/components/teams/exitTeamComponent.vue'
import membersOfTeamComponent from './membersOfTeamComponent.vue'

import { useTeamStore } from '@/store/teamStore'
import { useProjectStore } from '@/store/projectsStore.js'
import { useAuthStore } from '@/store/authStore'
import { useStorageStore } from '@/store/storageStore'
import router from '@/router'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

const teamStore = useTeamStore()
const projectStore = useProjectStore()
const authStore = useAuthStore()
const storageStore = useStorageStore()

const isModalOpen = ref(false)
const isEditOpen = ref(false)
const isInviteOpen = ref(false)

const selectedSuggestion = ref(null)
const showSuggestions = ref(false)
const showJoinRequests = ref(false)

const team = computed(() => teamStore.actualTeam || {})

const isTeacher = computed(
  () =>
    authStore.isAuthenticated &&
    authStore.user?.tipo?.trim().toLowerCase() === 'professor',
)

function sameId(first, second) {
  if (
    first == null ||
    second == null ||
    first === '' ||
    second === ''
  ) {
    return false
  }

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
  ) {
    return false
  }

  return team.value.professores.some((teacher) => {
    const profileId = teacher?.id ?? teacher

    const userId =
      teacher?.user?.id ??
      teacher?.user_id ??
      (typeof teacher?.user === 'object'
        ? null
        : teacher?.user)

    return (
      sameId(profileId, authStore.user?.id) ||
      sameId(userId, authStore.user?.user_id)
    )
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

const isMemberOfTeam = computed(
  () => isTeacherInTeam.value || isStudentInTeam.value,
)

watch(
  () => props.id,
  () => {
    showSuggestions.value = false
    showJoinRequests.value = false
    isModalOpen.value = false
    isEditOpen.value = false
    isInviteOpen.value = false
    selectedSuggestion.value = null
  },
)

watch(
  () => props.id,
  async () => {
    await teamStore.getTeamById(props.id, false)

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
  const storageId = await storageStore.getOrCreateStorage(
    team.value.id,
  )

  if (storageId) {
    router.push({
      name: 'storage',
      params: { id: storageId },
    })
  }
}
</script>

<template>
  <div class="page">
    <div class="top" style="padding-top: 20px">
      <appArrow @click="router.back()" />

      <requestToParticipateComponent
        v-if="team.id && !isMemberOfTeam && authStore.isAuthenticated"
        :team-id="props.id"
      />

      <exitTeamComponent
        v-if="isMemberOfTeam"
        :teamId="props.id"
      />
    </div>

    <div class="info">
      <div class="principal-info">
        <div class="logo-team">
          <AppImage placeholder="team"
            :src="team.image_perfil?.url || team.image_perfil?.file"
            alt="Logo da equipe" />
        </div>

        <div class="principal-text">
          <div class="team-title-row">
            <h1>{{ team.nome }}</h1>

            <button
              v-if="isTeacherInTeam"
              type="button"
              class="edit-team-btn"
              aria-label="Editar equipe"
              title="Editar equipe"
              @click="isEditOpen = true"
            >
              <i
                class="mdi mdi-pencil-outline"
                aria-hidden="true"
              ></i>
            </button>
          </div>

          <h2>
            <span class="mdi mdi-map-marker"></span>
            {{ team.professores?.[0]?.instituicao?.nome }} -
            {{ team.professores?.[0]?.instituicao?.cidade }}/{{
              team.professores?.[0]?.instituicao?.estado
            }}
          </h2>

          <h3 class="views">
            Visualizações: {{ team.views }}
          </h3>
        </div>
      </div>

      <p class="bio">
        {{ team.descricao }}
      </p>

      <ul class="categories">
        <li
          v-for="c in team.categorias"
          :key="c.id"
        >
          {{ c.nome }}
        </li>
      </ul>

      <div class="members-title-bar">
        <h3>Participantes</h3>

        <button
          v-if="isTeacherInTeam"
          type="button"
          class="invite-team-btn"
          @click="isInviteOpen = true"
        >
          <i
            class="mdi mdi-account-plus-outline"
            aria-hidden="true"
          ></i>
          Convidar
        </button>
      </div>

      <membersOfTeamComponent
        :teachers="team.professores"
        :students="team.alunos"
        :owner-id="team.criador"
      />

    </div>

    <div class="creates">
      <button
        v-if="isMemberOfTeam"
        type="button"
        class="createProject"
        @click="goToStorage"
      >
        <span class="mdi mdi-archive"></span>
        Estoque da equipe
      </button>

      <button
        v-if="isTeacherInTeam"
        id="toggle-team-requests"
        type="button"
        class="createProject"
        :aria-expanded="showJoinRequests"
        aria-controls="team-join-requests"
        @click="showJoinRequests = !showJoinRequests"
      >
        <span class="mdi mdi-account-clock-outline" aria-hidden="true"></span>
        {{ showJoinRequests ? 'Ocultar solicitações' : 'Ver solicitações' }}
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
        <span
          class="mdi mdi-lightbulb-on-outline"
          aria-hidden="true"
        ></span>
        Ver sugestões
      </button>

      <button
        v-if="isTeacherInTeam"
        type="button"
        class="createProject"
        @click="openCreateProject()"
      >
        <span class="mdi mdi-plus"></span>
        Criar projeto
      </button>
    </div>

    <p v-if="isTeacher && team.id && !isTeacherInTeam" class="team-access-message">
      As sugestões ficam disponíveis aos participantes vinculados a esta equipe.
    </p>

    <TeamJoinRequests
      v-if="isTeacherInTeam && showJoinRequests"
      id="team-join-requests"
      :team-id="props.id"
      @accepted="teamStore.getTeamById(props.id)"
    />

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
      />
    </div>

    <teamProjectsComponent
      :team-id="props.id"
    />

    <EditTeamModal
      v-if="isEditOpen"
      :team="team"
      @close="isEditOpen = false"
      @saved="teamStore.getTeamById(props.id)"
    />

    <InviteTeamModal
      v-if="isInviteOpen"
      :team="team"
      @close="isInviteOpen = false"
    />
  </div>
</template>

<style scoped>
.team-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.edit-team-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  flex: 0 0 34px;
  padding: 0;
  border: 1px solid #bed4e0;
  border-radius: 8px;
  background: #f3f9fc;
  color: #004369;
  cursor: pointer;
  font-size: 18px;
}

.edit-team-btn:hover {
  background: #e1eff7;
}

.edit-team-btn:focus-visible,
.invite-team-btn:focus-visible {
  outline: 2px solid #004369;
  outline-offset: 2px;
}

.members-title-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 22px 0 10px;
}

.members-title-bar h3 {
  color: #004369;
  font-size: 18px;
}

.invite-team-btn {
  display: flex;
  align-items: center;
  gap: 7px;
  background: #004369;
  color: white;
  border: 0;
  border-radius: 8px;
  padding: 10px 14px;
  font: inherit;
  font-size: 14px;
  cursor: pointer;
}

@media (max-width: 650px) {
  .edit-team-btn {
    width: 32px;
    height: 32px;
    flex-basis: 32px;
    font-size: 17px;
  }

  .invite-team-btn {
    font-size: 12px;
    padding: 9px 11px;
  }
}
</style>

<style scoped src="./teamDetailComponent.css"></style>
