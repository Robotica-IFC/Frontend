<script setup>
import { defineProps, onMounted, ref, computed } from 'vue'
import { useProjectStore } from '@/store/projectsStore'
import { useAuthStore } from '@/store/authStore'
import { useTemplateStore } from '@/store/template'
import appButton from '@/components/form/appButton.vue'
import CreatePostModal from '@/components/posts/CreatePostModal.vue'
import appArrow from '@/components/appArrow.vue'
import ProjectParticipantsModal from '@/components/layout/detailsComponents/projectParticipantsModal.vue'
import router from '@/router'

const projectStore = useProjectStore()
const authStore = useAuthStore()
const templateStore = useTemplateStore()

const actualProject = ref(null)
const onTheTeam = ref(false)
const isModalOpen = ref(false)
const isParticipantsModalOpen = ref(false)

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

const reversedPosts = computed(() => {
  if (!actualProject.value?.posts) return []
  return [...actualProject.value.posts].reverse()
})

const fetchProject = async () => {
  actualProject.value = await projectStore.getProjectById(props.id)

  const loggedUser = authStore.user

  if (actualProject.value && loggedUser) {
    const isStudentInTeam = actualProject.value.alunos?.some(
      (aluno) => aluno.id === loggedUser.id || aluno.user_id === loggedUser.id,
    )

    const isTeacherInTeam = actualProject.value.professores?.some(
      (prof) => prof.id === loggedUser.id || prof.user_id === loggedUser.id,
    )

    onTheTeam.value = Boolean(isStudentInTeam || isTeacherInTeam)
  }
}

const scrollCarousel = (postId, direction) => {
  const container = document.getElementById(`carousel-${postId}`)
  if (!container) return
  const scrollAmount = container.clientWidth
  container.scrollBy({
    left: direction === 'next' ? scrollAmount : -scrollAmount,
    behavior: 'smooth',
  })
}

onMounted(async () => {
  await fetchProject()
})
</script>

<template v-if="actualProject">
  <div class="page" v-if="actualProject">
    <div class="top">
      <appArrow style="margin-top: 60px" @click="router.back()"></appArrow>

      <h1>{{ actualProject.titulo }}</h1>
      <p>{{ actualProject.descricao }}</p>
      <appButton :font="'11px'" class="see-team" @click="isParticipantsModalOpen = true">
        Ver Participantes
      </appButton>
    </div>

    <div class="action-bar" v-if="onTheTeam">
      <appButton :font="'14px'" @click="isModalOpen = true"> Adicionar post </appButton>
    </div>

    <ul class="posts">
      <li v-for="p in reversedPosts" :key="p.id">
        <div class="post-header">
          <div class="post-header-left">
            <img :src="actualProject.equipe_image" :alt="actualProject.equipe" />
            <div class="names">
              <h2 class="team-name">{{ actualProject.equipe }}</h2>
              <h3 v-if="p.aluno_criador">Por: {{ p.aluno_criador.name }}</h3>
              <h3 v-else-if="p.professor_criador">Por: {{ p.professor_criador.name }}</h3>
            </div>
          </div>
          <p class="date">{{ templateStore.formatDate(p.criado_em) }}</p>
        </div>

        <p class="legenda">{{ p.legenda }}</p>

        <div class="post-image" v-if="p.images && p.images.length === 1">
          <img :src="p.images[0].url" alt="Imagem do post" />
        </div>

        <div class="carousel-wrapper" v-else-if="p.images && p.images.length > 1">
          <button class="nav-btn prev" @click="scrollCarousel(p.id, 'prev')">❮</button>

          <div class="carousel-container" :id="`carousel-${p.id}`">
            <div v-for="(img, index) in p.images" :key="index" class="carousel-item">
              <img :src="img.url" :alt="`Imagem ${index + 1}`" />
            </div>
          </div>

          <button class="nav-btn next" @click="scrollCarousel(p.id, 'next')">❯</button>
        </div>
      </li>
    </ul>

    <CreatePostModal
      :project-id="props.id"
      :is-open="isModalOpen"
      @close="isModalOpen = false"
      @created="fetchProject"
    />

    <ProjectParticipantsModal
      :is-open="isParticipantsModalOpen"
      :team-name="actualProject.equipe || 'Equipe'"
      :teachers="actualProject.professores || []"
      :students="actualProject.alunos || []"
      @close="isParticipantsModalOpen = false"
    />
  </div>
</template>

<style scoped src="./projectDetailComponent.css"></style>
