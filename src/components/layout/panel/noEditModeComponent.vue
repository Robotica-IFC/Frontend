
<script setup>
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

import appArrow from '@/components/appArrow.vue'
import appButton from '@/components/form/appButton.vue'

import { useTemplateStore } from '@/store/template'
import { useAuthStore } from '@/store/authStore'
import { useTeamStore } from '@/store/teamStore'

import { useConfirmation } from '@/composables/useConfirmation'
import { getProfileImageUrl } from '@/utils/profileImage'
import { formatApiError } from '@/utils/formValidation'

import router from '@/router'

const templateStore = useTemplateStore()
const authStore = useAuthStore()
const teamStore = useTeamStore()

const { confirm } = useConfirmation()
const { user } = storeToRefs(authStore)

const teamsUser = ref(null)
const checkingDeletion = ref(false)

const profileImageUrl = computed(() =>
  getProfileImageUrl(user.value?.imagem_perfil),
)

function confirmLogout() {
  return confirm({
    title: 'Sair da conta?',
    message: 'Será necessário entrar novamente para acessar sua conta.',
    confirmLabel: 'Sair da conta',
    danger: false,
    onConfirm: () => authStore.logout(),
  })
}

async function confirmDeleteAccount() {
  if (checkingDeletion.value) return
  checkingDeletion.value = true
  try {
    const eligibility = await authStore.accountDeletionEligibility()
    if (!eligibility.pode_excluir) {
      await confirm({
        title: 'Não é possível excluir a conta',
        message: eligibility.detail,
        confirmLabel: '',
        cancelLabel: 'Entendi',
      })
      return
    }
    const teacherNotice = user.value?.tipo === 'professor'
      ? '\n\nSe você for o responsável principal de uma equipe, essa responsabilidade será transferida para outro professor da equipe.'
      : ''
    await confirm({
      title: 'Excluir conta permanentemente?',
      message: 'Sua conta, seu perfil, suas publicações, comentários e convites serão excluídos permanentemente. Esta ação não pode ser desfeita.' + teacherNotice,
      confirmLabel: 'Excluir conta',
      cancelLabel: 'Cancelar',
      busyLabel: 'Excluindo conta...',
      danger: true,
      onConfirm: () => authStore.deleteAccount(),
    })
  } catch (error) {
    await confirm({
      title: 'Não foi possível verificar a conta',
      message: formatApiError(error, 'Tente novamente em instantes.'),
      confirmLabel: '',
      cancelLabel: 'Fechar',
    })
  } finally {
    checkingDeletion.value = false
  }
}

onMounted(async () => {
  if (!user.value?.user_id) return

  const [profile, teams] = await Promise.allSettled([
    authStore.refreshUserProfile(),
    teamStore.getTeamByUserId(user.value.user_id),
  ])

  if (profile.status === 'rejected') {
    console.error('Erro ao atualizar perfil:', profile.reason)
  }

  if (teams.status === 'fulfilled') {
    teamsUser.value = teams.value
  }
})

function openTeam(id) {
  router.push({
    name: 'teamDetails',
    params: { id },
  })
}
</script>

<template>
  <div class="top">
    <appArrow @back="router.back" />

    <span
      class="mdi mdi-square-edit-outline"
      @click="templateStore.panel = false"
    ></span>
  </div>

  <div class="page">
    <div class="data">
      <div class="first-data">
        <div class="name-image">
          <img
            v-if="profileImageUrl"
            class="profile-image"
            :src="profileImageUrl"
            :alt="user?.name"
          />

          <span
            v-else
            class="mdi mdi-account-circle profile-placeholder"
            aria-label="Sem foto de perfil"
          ></span>

          <div>
            <h1>{{ user?.username }}</h1>
            <h2>{{ user?.email }}</h2>
            <h3>{{ user?.name }}</h3>

            <h3
              v-if="user?.tipo === 'professor' && user?.instituicao"
            >
              {{
                typeof user.instituicao === 'object'
                  ? user.instituicao?.nome
                  : user.instituicao
              }}
            </h3>
          </div>
        </div>

        <p class="desc">
          {{ user?.descricao || 'Sem descrição 😢' }}
        </p>
      </div>
    </div>

    <div
      v-if="teamsUser && teamsUser.length > 0"
      class="team"
    >
      <h1 class="team-title">
        Minhas equipes:
      </h1>

      <ul class="teams">
        <li
          v-for="t in teamsUser"
          :key="t.id"
          @click="openTeam(t.id)"
        >
          <img
            :src="t.image_perfil?.url || t.image_perfil?.file"
            :alt="t.nome"
          />

          <h2>{{ t.nome }}</h2>
        </li>
      </ul>
    </div>

    <div
      v-else
      class="no-teams"
    >
      <h2>Você não participa de nenhuma equipe</h2>
    </div>

    <div class="equipe-card">
      <span class="mdi mdi-account-multiple-outline"></span>

      <div class="info-team">
        <h1>
          Envie solicitações para entrar nas equipes
        </h1>

        <p>
          Explore as equipes da Robótica IFC e envie uma
          solicitação para participar
        </p>

        <appButton
          font="13px"
          @click="router.push('/team')"
        >
          Explorar equipes
        </appButton>
      </div>
    </div>

    <div class="logout">
      <button
        class="danger"
        @click="confirmLogout"
      >
        <span class="mdi mdi-logout"></span>
        <span>Sair da conta</span>
      </button>

      <button class="danger" :disabled="checkingDeletion" @click="confirmDeleteAccount">
        <span class="mdi mdi-trash-can-outline"></span>
        <span>Excluir conta</span>
      </button>
    </div>
  </div>
</template>

<style scoped src="./noEditModeComponent.css"></style>
