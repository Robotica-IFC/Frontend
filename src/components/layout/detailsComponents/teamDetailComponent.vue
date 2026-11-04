<script setup>
import { defineProps, onMounted, computed, ref } from 'vue'
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
import EditTeamModal from '@/components/teams/EditTeamModal.vue'
import InviteTeamModal from '@/components/teams/InviteTeamModal.vue'

const teamStore = useTeamStore()
const projectStore = useProjectStore()
const authStore = useAuthStore()
const storageStore = useStorageStore()

const isModalOpen = ref(false)
const isEditOpen = ref(false)
const isInviteOpen = ref(false)

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

const team = computed(() => teamStore.actualTeam || {})

const currentUserId = computed(() => authStore.user?.user_id || authStore.user?.id)

const isTeacherInTeam = computed(() => {
  if (!team.value.professores || !currentUserId.value) return false
  return team.value.professores.some(
    (teacher) =>
      teacher.user?.id === currentUserId.value ||
      teacher.id === currentUserId.value ||
      teacher.user_id === currentUserId.value,
  )
})

const isStudentInTeam = computed(() => {
  if (!team.value.alunos || !currentUserId.value) return false
  return team.value.alunos.some(
    (student) =>
      student.user?.id === currentUserId.value ||
      student.id === currentUserId.value ||
      student.user_id === currentUserId.value,
  )
})

const isMemberOfTeam = computed(() => isTeacherInTeam.value || isStudentInTeam.value)

onMounted(async () => {
  // 1. Busca os dados da equipe primeiro para poder avaliar os membros
  await teamStore.getTeamById(props.id, false)

  // 2. Se o usuário NÃO for membro da equipe, envia a requisição de visualização
  if (!isMemberOfTeam.value) {
    await teamStore.incrementView(props.id)
  }
})

async function handleProjectCreated() {
  await projectStore.getProjectsByTeam(props.id)
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
          <div class="team-title-row">
            <h1>{{ team.nome }}</h1>
            <button v-if="isTeacherInTeam" type="button" class="edit-team-btn" aria-label="Editar equipe" title="Editar equipe" @click="isEditOpen = true">
              <i class="mdi mdi-pencil-outline" aria-hidden="true"/>
            </button>
          </div>
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
      <div class="members-title-bar">
        <h3>Participantes</h3>
        <button v-if="isTeacherInTeam" class="invite-team-btn" type="button" @click="isInviteOpen = true">
          <i class="mdi mdi-account-plus-outline" aria-hidden="true"/> Convidar
        </button>
      </div>
      <membersOfTeamComponent
        :teachers="team.professores"
        :students="team.alunos"
      ></membersOfTeamComponent>
    </div>
    <div class="creates" style="margin-top: 20px">
      <button v-if="isMemberOfTeam" class="createProject" @click="goToStorage()">
        <span class="mdi mdi-archive"></span> Estoque da equipe
      </button>
      <button v-if="isTeacherInTeam" class="createProject" @click="isModalOpen = true">
        <span class="mdi mdi-plus"></span> Criar projeto
      </button>
    </div>

    <div v-if="team.id && isModalOpen" class="project-overlay">
      <createProjectModal
        :id="props.id"
        @close="isModalOpen = false"
        @created="handleProjectCreated"
      ></createProjectModal>
    </div>

    <teamProjectsComponent :team-id="props.id" />
    <EditTeamModal v-if="isEditOpen" :team="team" @close="isEditOpen = false" @saved="teamStore.getTeamById(props.id)" />
    <InviteTeamModal v-if="isInviteOpen" :team="team" @close="isInviteOpen = false" />
  </div>
</template>

<style scoped>
.team-title-row{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.edit-team-btn{display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;flex:0 0 34px;padding:0;border:1px solid #bed4e0;border-radius:8px;background:#f3f9fc;color:#004369;cursor:pointer;font-size:18px}
.edit-team-btn:hover{background:#e1eff7}.edit-team-btn:focus-visible,.invite-team-btn:focus-visible{outline:2px solid #004369;outline-offset:2px}
.members-title-bar{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:22px 0 10px}.members-title-bar h3{color:#004369;font-size:18px}
.invite-team-btn{display:flex;align-items:center;gap:7px;background:#004369;color:white;border:0;border-radius:8px;padding:10px 14px;font:inherit;font-size:14px;cursor:pointer}
@media(max-width:650px){.edit-team-btn{width:32px;height:32px;flex-basis:32px;font-size:17px}.invite-team-btn{font-size:12px;padding:9px 11px}}
</style>

<style scoped src="./teamDetailComponent.css"></style>
