<script setup>
import { defineProps, onMounted, ref, computed } from 'vue'
import { useProjectStore } from '@/store/projectsStore'
import { useAuthStore } from '@/store/authStore'
import appButton from '@/components/form/appButton.vue'
import CreatePostModal from '@/components/posts/CreatePostModal.vue'

const projectStore = useProjectStore()
const authStore = useAuthStore()

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

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

onMounted(async () => {
  await fetchProject()
})
</script>

<template v-if="actualProject">
  <div class="page" v-if="actualProject">
    <div class="top">
      <h1>{{ actualProject.titulo }}</h1>
      <p>{{ actualProject.descricao }}</p>
      <appButton :font="'11px'" class="see-team">Ver Participantes</appButton>
    </div>

    <div class="action-bar" v-if="onTheTeam">
      <appButton :font="'14px'" @click="isModalOpen = true">
        Adicionar post
      </appButton>
    </div>

    <ul class="posts">
      <li v-for="p in reversedPosts" :key="p.id">
        <div class="post-header">
          <div class="post-header-left">
            <img :src="actualProject.equipe_image" :alt="actualProject.equipe">
            <div class="names">
              <h2 class="team-name">{{ actualProject.equipe }}</h2>
              <h3 v-if="p.aluno_criador">Por: {{ p.aluno_criador.name }}</h3>
              <h3 v-else-if="p.professor_criador">Por: {{ p.professor_criador.name }}</h3>
            </div>
          </div>
          <p class="date">{{ formatDate(p.criado_em) }}</p>
        </div>

        <p class="legenda">{{ p.legenda }}</p>

        <div class="post-image" v-if="p.images && p.images.length === 1"> 
          <img :src="p.images[0].url" alt="Imagem do post">
        </div>

        <div class="carousel-wrapper" v-else-if="p.images && p.images.length > 1">
          <button class="nav-btn prev" @click="scrollCarousel(p.id, 'prev')">❮</button>

          <div class="carousel-container" :id="`carousel-${p.id}`">
            <div v-for="(img, index) in p.images" :key="index" class="carousel-item">
              <img :src="img.url" :alt="`Imagem ${index + 1}`">
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
  </div>
</template>

<style scoped>
div.top {
  margin-top: 30px;
  overflow-wrap: break-word;
  word-break: break-word;
  display: flex;
  flex-direction: column;
  gap: 20px;
  border-bottom: 1px var(--principal-claro) solid;
  padding-bottom: 20px;

  & h1 {
    color: var(--principal-claro);
    text-align: center;
    font-size: 28px;
  }

  & p {
    white-space: pre-line;
    text-align: justify;
    font-size: 15px;
  }

  & .see-team {
    width: 30%;
  }
}

.action-bar {
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
}

ul.posts {
  padding-top: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  list-style: none;

  & li {
    padding-top: 10px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--principal-claro);

    &:first-child {
      padding-top: 0;
    }

    &:last-child {
      padding-bottom: 0;
      border-bottom: none;
    }

    & div.post-header {
      display: flex;
      justify-content: space-between;
      width: 100%;
      align-items: center;

      & div.post-header-left {
        display: flex;
        width: 50%;
        align-items: center;
        gap: 10px;
      }

      & img {
        width: 30%;
        object-fit: cover;
        aspect-ratio: 1 / 1;
        border-radius: 50%;
        border: 1px solid black;
      }

      & h3 {
        font-size: 10px;
        font-weight: 350;
      }

      .team-name {
        font-size: 15px;
      }

      & p {
        font-size: 12px;
      }
    }

    & p.legenda {
      white-space: pre-line;
      font-size: 14px;
      margin: 10px 0;
    }

    & div.post-image {
      width: 100%;
      
      & img {
        width: 100%;
        aspect-ratio: 2 / 1;
        object-fit: cover;
        border-radius: 8px;
      }
    }

    & .carousel-wrapper {
      position: relative;
      width: 100%;

      & .carousel-container {
        display: flex;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        scroll-behavior: smooth;
        border-radius: 8px;
        scrollbar-width: none; 
        &::-webkit-scrollbar {
          display: none;
        }

        & .carousel-item {
          flex: 0 0 100%;
          scroll-snap-align: start;

          & img {
            width: 100%;
            aspect-ratio: 2 / 1;
            object-fit: cover;
            display: block;
          }
        }
      }

      & .nav-btn {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(0, 0, 0, 0.5);
        color: white;
        border: none;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2;
        transition: background 0.2s;

        &:hover {
          background: rgba(0, 0, 0, 0.8);
        }

        &.prev {
          left: 10px;
        }

        &.next {
          right: 10px;
        }
      }
    }
  }
}
</style>