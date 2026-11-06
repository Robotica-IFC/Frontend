<script setup>
import { defineProps, onMounted, ref, computed } from 'vue'
import { useProjectStore } from '@/store/projectsStore'
import { useAuthStore } from '@/store/authStore'
import { useTemplateStore } from '@/store/template'
import appButton from '@/components/form/appButton.vue'
import CreatePostModal from '@/components/posts/CreatePostModal.vue'
import PostCommentsSheet from '@/components/posts/PostCommentsSheet.vue'
import EditPostModal from '@/components/posts/EditPostModal.vue'
import EditProjectModal from '@/components/projects/EditProjectModal.vue'
import ProjectParticipantsModal from '@/components/layout/detailsComponents/projectParticipantsModal.vue'
import { usePostStore } from '@/store/postsStore'
import appArrow from '@/components/appArrow.vue'
import router from '@/router'

const projectStore = useProjectStore()
const authStore = useAuthStore()
const templateStore = useTemplateStore()
const postStore = usePostStore()
const selectedComments = ref(null)
const editingPost = ref(null)
const editingProject = ref(false)
const isParticipantsModalOpen = ref(false)
const errorMessage = ref('')
const currentUserId = computed(() => authStore.user?.user_id)
const canEditProject = computed(() => Boolean(authStore.user?.tipo === 'professor' && actualProject.value?.professores?.some(p => p.user_id === currentUserId.value || p.user?.id === currentUserId.value || p.id === authStore.user?.id)))
function canEditPost(post) {
  return Boolean(currentUserId.value && (post.aluno_criador?.user_id === currentUserId.value || post.professor_criador?.user_id === currentUserId.value || post.aluno_criador?.id === authStore.user?.id || post.professor_criador?.id === authStore.user?.id))
}
async function toggleLike(post) {
  errorMessage.value = ''
  try { await postStore.toggleLike(post) }
  catch { errorMessage.value = 'Não foi possível atualizar a curtida.' }
}

const actualProject = ref(null)
const onTheTeam = ref(false)
const isModalOpen = ref(false)

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

  onTheTeam.value = false
  if (actualProject.value && loggedUser) {
    const isStudentInTeam = actualProject.value.alunos?.some(
      (aluno) => aluno.id === loggedUser.id || aluno.user_id === loggedUser.id
    )

    const isTeacherInTeam = actualProject.value.professores?.some(
      (prof) => prof.id === loggedUser.id || prof.user_id === loggedUser.id
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
    behavior: 'smooth'
  })
}

onMounted(async () => {
  await fetchProject()
})
</script>

<template v-if="actualProject">
  <div class="page project-detail-page" v-if="actualProject">

    <div class="project-intro">

    <appArrow class="project-back" @back="router.back()"  />

      <div class="project-heading-row">
        <h1>{{ actualProject.titulo }}</h1>
        <button v-if="canEditProject" type="button" class="project-edit-control"
          aria-label="Editar projeto" title="Editar projeto" @click="editingProject = true">
          <i class="mdi mdi-pencil-outline" aria-hidden="true"></i>
        </button>
      </div>
      <p>{{ actualProject.descricao }}</p>
      <appButton :font="'11px'" class="see-team" @click="isParticipantsModalOpen = true">Ver Participantes</appButton>
    </div>

    <div class="action-bar" v-if="onTheTeam">
      <appButton :font="'14px'" @click="isModalOpen = true">
        Adicionar post
      </appButton>
    </div>

    <ul class="posts">
      <li v-for="p in reversedPosts" :key="p.id" class="post-card" :class="p.formato_imagem === 'QUADRADO' ? 'post-square' : 'post-wide'">
        <div class="post-header">
          <div class="post-header-left">
            <img :src="actualProject.equipe_image" :alt="actualProject.equipe">
            <div class="names">
              <h2 class="team-name">{{ actualProject.equipe }}</h2>
              <h3 v-if="p.aluno_criador">Por: {{ p.aluno_criador.name }}</h3>
              <h3 v-else-if="p.professor_criador">Por: {{ p.professor_criador.name }}</h3>
            </div>
          </div>
          <div class="post-header-actions">
            <p class="date">{{ templateStore.formatDate(p.criado_em) }}</p>
            <button
              v-if="canEditPost(p)"
              type="button"
              class="post-edit-icon"
              aria-label="Editar publicação"
              title="Editar publicação"
              @click="editingPost = p"
            >
              <i class="mdi mdi-pencil-outline" aria-hidden="true"></i>
            </button>
          </div>
        </div>

        <p class="legenda">{{ p.legenda }}</p>

        <div class="post-image post-media" v-if="p.images && p.images.length === 1">
          <img :src="p.images[0].url" alt="Imagem do post" loading="lazy">
        </div>

        <div class="carousel-wrapper post-media" v-else-if="p.images && p.images.length > 1">
          <button class="nav-btn prev" @click="scrollCarousel(p.id, 'prev')">❮</button>

          <div class="carousel-container" :id="`carousel-${p.id}`">
            <div v-for="(img, index) in p.images" :key="index" class="carousel-item">
              <img :src="img.url" :alt="`Imagem ${index + 1}`" loading="lazy">
            </div>
          </div>

          <button class="nav-btn next" @click="scrollCarousel(p.id, 'next')">❯</button>
        </div>
        <div class="post-actions">
          <button @click="selectedComments = p" type="button"><i class="mdi mdi-comment-outline" /> {{ p.comentarios?.length || 0 }} comentários</button>
          <button @click="toggleLike(p)" type="button" :aria-pressed="p.curtiu"><span>{{ p.curtidas || 0 }} curtidas</span><i :class="p.curtiu ? 'mdi mdi-heart' : 'mdi mdi-heart-outline'" /></button>
        </div>
      </li>
    </ul>
    <p v-if="errorMessage" role="alert">{{ errorMessage }}</p>

    <ProjectParticipantsModal
      :is-open="isParticipantsModalOpen"
      :team-name="actualProject.equipe || 'Equipe'"
      :teachers="actualProject.professores || []"
      :students="actualProject.alunos || []"
      @close="isParticipantsModalOpen = false"
    />
    <PostCommentsSheet v-if="selectedComments" :post="selectedComments" @close="selectedComments = null" />
    <EditPostModal v-if="editingPost" :post="editingPost" @close="editingPost = null" @saved="fetchProject" />
    <EditProjectModal v-if="editingProject" :project="actualProject" @close="editingProject = false" @saved="fetchProject" />
    <CreatePostModal
      :project-id="props.id"
      :is-open="isModalOpen"
      @close="isModalOpen = false"
      @created="fetchProject"
    />
  </div>
</template>

<style scoped>
.post-actions {
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:12px;
  padding:14px 4px
}
.post-actions button {
  display:flex;
  align-items:center;
  gap:6px;
  border:0;
  background:transparent;
  color:#003f63;
  font:inherit;
  font-size:13px;
  cursor:pointer
}
.post-actions .mdi-heart {
  color:#df183e
}
.post-actions i {
  font-size:21px
}
.post-header-actions {
  display:flex;
  align-items:center;
  justify-content:flex-end;
  gap:8px;
  flex-shrink:0
}
.post-header-actions .date {
  margin:0;
  white-space:nowrap
}
.post-header-actions .post-edit-icon {
  display:inline-flex;
  align-items:center;
  justify-content:center;
  flex:0 0 34px;
  width:34px;
  height:34px;
  padding:0;
  border:1px solid #bfd4e0;
  border-radius:8px;
  background:#f4f9fc;
  color:#004369;
  cursor:pointer;
  line-height:1;
  transition:background .2s,border-color .2s
}
.post-header-actions .post-edit-icon .mdi {
  font-size:18px;
  line-height:1
}
.post-header-actions .post-edit-icon:hover {
  background:#e2f0f8;
  border-color:#004369
}
.post-header-actions .post-edit-icon:focus-visible {
  outline:2px solid #004369;
  outline-offset:2px
}
.project-edit-control {
  background:transparent;
  color:#004369;
  border:1px solid #004369;
  border-radius:6px;
  padding:8px 12px;
  font:inherit;
  cursor:pointer
}
@media(max-width:600px) {
  .post-actions button {
    font-size:11px
  }
  .post-actions i {
    font-size:18px
  }
  .post-header-actions {
    gap:5px
  }
  .post-header-actions .post-edit-icon {
    flex-basis:32px;
    width:32px;
    height:32px
  }
  .post-header-actions .date {
    font-size:11px
  }
}
</style>

<style scoped src="./projectDetailComponent.css"></style>
