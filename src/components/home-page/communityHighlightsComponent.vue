<script setup>
import { ref } from 'vue'
import { useHomeHighlightsStore } from '@/store/homeHighlightsStore'
import { usePostStore } from '@/store/postsStore'
import PostCommentsSheet from '@/components/posts/PostCommentsSheet.vue'
import { rememberHomeSection } from '@/utils/homeNavigation'

const highlights = useHomeHighlightsStore()
const postStore = usePostStore()
const pendingLikes = ref(new Set())
const actionError = ref('')
const selectedComments = ref(null)

function formatDate(date) {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date))
}

async function toggleLike(post) {
  if (pendingLikes.value.has(post.id)) return
  pendingLikes.value.add(post.id)
  actionError.value = ''
  try {
    await postStore.toggleLike(post)
    await highlights.refresh(true)
  } catch {
    actionError.value = 'Não foi possível atualizar a curtida. Tente novamente.'
  } finally {
    pendingLikes.value.delete(post.id)
  }
}

function closeComments() {
  selectedComments.value = null
  highlights.refresh(true)
}
</script>

<template>
  <section
    id="community-highlights"
    class="community-highlights"
    aria-labelledby="community-highlights-heading"
  >
    <h2 id="community-highlights-heading">
      <span class="heading-star mdi mdi-star-circle" aria-hidden="true"></span>
      Destaques da comunidade
    </h2>
    <p v-if="actionError" class="section-message" role="alert">{{ actionError }}</p>
    <p v-if="highlights.errors.posts" class="section-message" role="alert">
      {{ highlights.errors.posts }}
      <button type="button" @click="highlights.refresh()">Tentar novamente</button>
    </p>
    <p
      v-if="highlights.loading.posts && !highlights.posts.length"
      class="section-message"
      role="status"
    >
      Carregando destaques da comunidade...
    </p>
    <p v-else-if="!highlights.posts.length && !highlights.errors.posts" class="section-message">
      Nenhuma publicação disponível no momento.
    </p>
    <div v-else-if="highlights.posts.length" class="community-grid">
      <article v-for="post in highlights.posts" :key="post.id" class="community-card">
        <RouterLink
          v-if="post.projeto"
          class="post-open-link"
          :to="{ name: 'projectDetails', params: { id: post.projeto }, hash: `#post-${post.id}` }"
          :aria-label="`Abrir publicação de ${post.equipe || 'Comunidade'}: ${post.legenda || 'Ver publicação'}`"
          @click="rememberHomeSection('community-highlights')"
        />
        <header class="post-header">
          <RouterLink
            v-if="post.equipe_id"
            class="post-team"
            :to="{ name: 'teamDetails', params: { id: post.equipe_id } }"
            :aria-label="`Ver equipe ${post.equipe}`"
          >
            <img
              v-if="post.equipe_image"
              :src="post.equipe_image"
              :alt="`Logo da equipe ${post.equipe}`"
            />
            <span v-else class="team-placeholder mdi mdi-account-group" aria-hidden="true"></span>
            <strong>{{ post.equipe }}</strong>
          </RouterLink>
          <strong v-else class="post-team">Comunidade</strong>
          <time :datetime="post.criado_em">{{ formatDate(post.criado_em) }}</time>
        </header>
        <img
          v-if="post.images?.some((image) => image.url)"
          class="post-image"
          :src="post.images.find((image) => image.url).url"
          :alt="post.legenda || 'Imagem da publicação'"
        />
        <div v-else class="post-image image-placeholder" aria-label="Publicação sem imagem">
          <span class="mdi mdi-image-outline" aria-hidden="true"></span>
        </div>
        <p class="post-caption">{{ post.legenda }}</p>
        <div class="post-actions">
          <button type="button" @click="selectedComments = post">
            <span class="mdi mdi-comment-outline" aria-hidden="true"></span>
            {{ post.comentarios?.length || 0 }}
            {{ post.comentarios?.length === 1 ? 'comentário' : 'comentários' }}
          </button>
          <button
            type="button"
            :aria-pressed="Boolean(post.curtiu)"
            :aria-label="`${post.curtiu ? 'Descurtir' : 'Curtir'} publicação de ${post.equipe || 'Comunidade'}`"
            :disabled="pendingLikes.has(post.id)"
            @click="toggleLike(post)"
          >
            {{ post.curtidas }} {{ post.curtidas === 1 ? 'curtida' : 'curtidas' }}
            <span
              :class="['like-icon mdi', post.curtiu ? 'mdi-heart' : 'mdi-heart-outline']"
              aria-hidden="true"
            ></span>
          </button>
        </div>
      </article>
    </div>
    <Teleport to="body">
      <PostCommentsSheet v-if="selectedComments" :post="selectedComments" @close="closeComments" />
    </Teleport>
  </section>
</template>

<style scoped src="./communityHighlightsComponent.css"></style>
