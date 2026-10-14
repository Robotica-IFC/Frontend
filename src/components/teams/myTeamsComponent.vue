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
            v-if="t.image_perfil?.url || t.image_perfil?.file"
            :src="t.image_perfil.url || t.image_perfil.file"
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
    <p v-else-if="teamsUser" class="empty-teams">Você ainda não participa de nenhuma equipe.</p>
  </div>
</template>

<style scoped src="./myTeamsComponent.css"></style>
