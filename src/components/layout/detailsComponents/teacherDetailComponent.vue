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
  embedded: { type: Boolean, default: false },
  initialAuthor: { type: Object, default: null },
})
const emit = defineEmits(['close'])

function closeProfile() {
  if (props.embedded) emit('close')
  else router.back()
}

// Evita baixar a imagem novamente a cada renderização
const cacheBust = Date.now()

function openTeam(id) {
  if (props.embedded) emit('close')
  router.push({ name: 'teamDetails', params: { id } })
}

function handleKeydown(e) {
  if (e.key === 'Escape') closeProfile()
}

onMounted(async () => {
  window.addEventListener('keydown', handleKeydown)
  await teacherStore.getTeacherById(props.id)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})

const loadedTeacher = computed(() => {
  const profile = teacherStore.actualTeacher
  return profile?.user && String(profile.id) === props.id ? profile : null
})
const teacher = computed(
  () =>
    loadedTeacher.value ||
    (props.initialAuthor
      ? {
          user: props.initialAuthor,
          imagem_perfil: props.initialAuthor.imagem_perfil,
        }
      : null),
)
</script>

<template>
  <div class="modal-backdrop" @click.self="closeProfile">
    <div class="page" v-if="teacher && teacher.user">
      <!-- X de fechar: aparece só no desktop -->
      <button type="button" class="close-btn" aria-label="Fechar perfil" @click="closeProfile">
        &times;
      </button>

      <div class="top">
        <appArrow @back="closeProfile"></appArrow>
      </div>

      <div class="data">
        <div class="first-data">
          <div class="name-image">
            <!-- IMAGEM DO PROFESSOR -->
            <div class="profile-image-container">
              <AppImage
                class="profile-image"
                :src="teacher.imagem_perfil?.url || teacher.imagem_perfil?.file ? `${teacher.imagem_perfil?.url || teacher.imagem_perfil?.file}?t=${cacheBust}` : ''"
                :alt="teacher.user?.name" />
            </div>

            <div>
              <h1>{{ teacher.user?.username }}</h1>
              <h2 v-if="teacher.user?.email">{{ teacher.user.email }}</h2>
              <h3>{{ teacher.user?.name }}</h3>
              <h4 v-if="loadedTeacher">
                {{ teacher.instituicao?.nome || teacher.instituicao || 'Não informada' }}
              </h4>
            </div>
          </div>

          <p v-if="loadedTeacher" class="desc">
            {{ teacher.descricao || 'Sem descrição 😢' }}
          </p>
          <p v-else role="status">Carregando perfil do professor...</p>
        </div>
      </div>

      <!-- EQUIPES -->
      <div class="team" v-if="loadedTeacher && teacher.teams && teacher.teams.length > 0">
        <h1 class="team-title">Equipes Orientadas:</h1>

        <ul class="teams">
          <li v-for="t in teacher.teams" :key="t.id" @click="openTeam(t.id)">
            <!-- IMAGEM DA EQUIPE -->
            <div class="team-image">
              <AppImage placeholder="team"
                :src="t.image_perfil?.url || t.image_perfil?.file"
                :alt="t.nome" />
            </div>

            <h2>{{ t.nome }}</h2>
          </li>
        </ul>
      </div>

      <!-- SEM EQUIPES -->
      <div class="no-teams" v-else-if="loadedTeacher">
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
