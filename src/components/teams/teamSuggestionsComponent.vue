<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useProjectSuggestionsStore } from '@/store/projectSuggestionsStore'
import studentDetailComponent from '@/components/layout/detailsComponents/studentDetailComponent.vue'
import teacherDetailComponent from '@/components/layout/detailsComponents/teacherDetailComponent.vue'
import Pagination from '@/components/paginationComponent.vue'

const props = defineProps({
  teamId: { type: [String, Number], required: true },
})
const emit = defineEmits(['create', 'close'])
const suggestionsStore = useProjectSuggestionsStore()
const suggestions = ref([])
const loading = ref(false)
const errorMessage = ref('')
const search = ref('')
const suggestionsPerPage = 4
const currentPage = ref(1)
const activeTab = ref('sugestoes')
const pendingActions = ref(new Set())
const tabs = [
  { id: 'sugestoes', label: 'Sugestões' },
  { id: 'favoritas', label: 'Favoritas' },
  { id: 'recusadas', label: 'Recusadas' },
]
const selectedAuthor = ref(null)
const profileDialog = ref(null)
let authorTrigger
const tabCounts = computed(() => ({
  sugestoes: suggestions.value.filter((suggestion) => !suggestion.recusada && !suggestion.favorita)
    .length,
  favoritas: suggestions.value.filter((suggestion) => !suggestion.recusada && suggestion.favorita)
    .length,
  recusadas: suggestions.value.filter((suggestion) => suggestion.recusada).length,
}))
const tabSuggestions = computed(() =>
  suggestions.value
    .filter((suggestion) => {
      if (activeTab.value === 'recusadas') return suggestion.recusada
      return (
        !suggestion.recusada && Boolean(suggestion.favorita) === (activeTab.value === 'favoritas')
      )
    })
    .sort(
      (first, second) =>
        new Date(second.criado_em) - new Date(first.criado_em) ||
        Number(second.id) - Number(first.id),
    ),
)
const filteredSuggestions = computed(() => {
  const query = normalize(search.value.trim())
  return tabSuggestions.value.filter((suggestion) =>
    normalize(
      `${suggestion.titulo} ${suggestion.descricao} ${authorName(suggestion)} ${
        suggestion.anonimo ? '' : suggestion.autor?.name || ''
      }`,
    ).includes(query),
  )
})
const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredSuggestions.value.length / suggestionsPerPage)),
)
const visibleSuggestions = computed(() => {
  const start = (currentPage.value - 1) * suggestionsPerPage
  return filteredSuggestions.value.slice(start, start + suggestionsPerPage)
})
let controller

function changePage(page) {
  if (Number.isInteger(page) && page >= 1 && page <= totalPages.value) currentPage.value = page
}

async function switchTab(tab, focus = false) {
  activeTab.value = tab
  if (focus) {
    await nextTick()
    document.getElementById(`suggestions-tab-${tab}`)?.focus()
  }
}

function moveTab(tab, offset) {
  const index = tabs.findIndex((item) => item.id === tab)
  return switchTab(tabs[(index + offset + tabs.length) % tabs.length].id, true)
}

async function updateSuggestion(suggestion, update) {
  if (pendingActions.value.has(suggestion.id)) return
  const requestController = controller
  pendingActions.value.add(suggestion.id)
  try {
    const updated = await update()
    if (requestController?.signal.aborted) return
    suggestions.value = suggestions.value.map((item) =>
      item.id === suggestion.id ? updated : item,
    )
  } catch (error) {
    if (!requestController?.signal.aborted) {
      console.error(
        'Não foi possível atualizar a sugestão:',
        error.response?.data?.detail || error.message,
      )
    }
  } finally {
    pendingActions.value.delete(suggestion.id)
  }
}

function setRejected(suggestion, rejected) {
  return updateSuggestion(suggestion, () =>
    rejected
      ? suggestionsStore.rejectSuggestion(suggestion.id)
      : suggestionsStore.acceptSuggestion(suggestion.id),
  )
}

function toggleFavorite(suggestion) {
  return updateSuggestion(suggestion, () =>
    suggestionsStore.setFavoriteSuggestion(suggestion.id, !suggestion.favorita),
  )
}

function normalize(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function authorName(suggestion) {
  if (suggestion.anonimo || !suggestion.autor) return 'Usuário não identificado'
  return suggestion.autor.username || suggestion.autor.name || 'Usuário não identificado'
}

function authorImage(suggestion) {
  if (suggestion.anonimo || !suggestion.autor) return null
  const image = suggestion.autor.imagem_perfil
  return typeof image === 'string' ? image : image?.url || image?.file
}

function hasAuthorProfile(suggestion) {
  const author = suggestion.autor
  return !suggestion.anonimo && author?.perfil_id && ['aluno', 'professor'].includes(author.tipo)
}

async function openAuthorProfile(suggestion, event) {
  if (!hasAuthorProfile(suggestion)) return
  authorTrigger = event.currentTarget
  selectedAuthor.value = suggestion.autor
  await nextTick()
  profileDialog.value?.focus()
}

async function closeAuthorProfile() {
  selectedAuthor.value = null
  await nextTick()
  authorTrigger?.focus()
}

async function loadSuggestions() {
  controller?.abort()
  const requestController = new AbortController()
  controller = requestController
  loading.value = true
  errorMessage.value = ''
  currentPage.value = 1
  suggestions.value = []
  try {
    const data = await suggestionsStore.getSuggestionsByTeam(props.teamId, requestController.signal)
    if (requestController.signal.aborted) return
    suggestions.value = data
  } catch {
    if (!requestController.signal.aborted) {
      errorMessage.value = 'Não foi possível carregar as sugestões desta equipe. Tente novamente.'
    }
  } finally {
    if (!requestController.signal.aborted) loading.value = false
  }
}

function formatDate(value) {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(new Date(value))
}

watch([search, activeTab], () => {
  currentPage.value = 1
})
watch(totalPages, (pages) => {
  currentPage.value = Math.min(currentPage.value, pages)
})

watch(
  () => props.teamId,
  () => {
    selectedAuthor.value = null
    search.value = ''
    activeTab.value = 'sugestoes'
    loadSuggestions()
  },
  { immediate: true },
)
onBeforeUnmount(() => controller?.abort())
</script>

<template>
  <section class="team-suggestions" aria-labelledby="team-suggestions-heading" :aria-busy="loading">
    <header class="suggestions-header">
      <div>
        <h2 id="team-suggestions-heading">Sugestões de projetos</h2>
        <p>Ideias enviadas para esta equipe.</p>
      </div>
      <div class="suggestions-header-actions">
        <button
          type="button"
          :disabled="loading || pendingActions.size > 0"
          @click="loadSuggestions"
        >
          <span class="mdi mdi-refresh" aria-hidden="true"></span> Atualizar
        </button>
        <button type="button" aria-label="Fechar sugestões" @click="emit('close')">
          <span class="mdi mdi-close" aria-hidden="true"></span> Fechar
        </button>
      </div>
    </header>
    <div class="suggestions-tabs" role="tablist" aria-label="Situação das sugestões">
      <button
        v-for="tab in tabs"
        :id="`suggestions-tab-${tab.id}`"
        :key="tab.id"
        type="button"
        role="tab"
        :aria-selected="activeTab === tab.id"
        :tabindex="activeTab === tab.id ? 0 : -1"
        aria-controls="suggestions-tab-panel"
        @click="switchTab(tab.id)"
        @keydown.left.prevent="moveTab(tab.id, -1)"
        @keydown.right.prevent="moveTab(tab.id, 1)"
        @keydown.home.prevent="switchTab('sugestoes', true)"
        @keydown.end.prevent="switchTab('recusadas', true)"
      >
        {{ tab.label }}
        <span class="tab-count">{{ tabCounts[tab.id] }}</span>
      </button>
    </div>
    <div
      id="suggestions-tab-panel"
      role="tabpanel"
      :aria-labelledby="`suggestions-tab-${activeTab}`"
    >
      <div class="suggestions-search">
        <label for="team-suggestions-search">Pesquisar sugestões</label>
        <div>
          <span class="mdi mdi-magnify" aria-hidden="true"></span>
          <input
            id="team-suggestions-search"
            v-model="search"
            type="search"
            placeholder="Busque por título, descrição ou autor"
          />
        </div>
      </div>
      <p v-if="loading" class="suggestions-message" role="status">Carregando sugestões...</p>
      <div v-else-if="errorMessage" class="suggestions-message error-message" role="alert">
        <p>{{ errorMessage }}</p>
        <button type="button" @click="loadSuggestions">Tentar novamente</button>
      </div>
      <p v-else-if="!tabSuggestions.length" class="suggestions-message" role="status">
        {{
          activeTab === 'recusadas'
            ? 'Nenhuma sugestão recusada nesta equipe.'
            : activeTab === 'favoritas'
              ? 'Nenhuma sugestão favorita nesta equipe.'
              : 'Nenhuma sugestão disponível nesta equipe.'
        }}
      </p>
      <p v-else-if="!filteredSuggestions.length" class="suggestions-message" role="status">
        Nenhuma sugestão encontrada para esta pesquisa.
      </p>
      <template v-else>
        <div class="suggestions-list">
          <article
            v-for="suggestion in visibleSuggestions"
            :key="suggestion.id"
            class="suggestion-card"
          >
            <header class="suggestion-card-header">
              <h3>{{ suggestion.titulo }}</h3>
              <div class="suggestion-card-meta">
                <time :datetime="suggestion.criado_em">{{ formatDate(suggestion.criado_em) }}</time>
                <button
                  type="button"
                  class="favorite-suggestion"
                  :aria-pressed="Boolean(suggestion.favorita)"
                  :aria-label="`${suggestion.favorita ? 'Remover dos favoritos' : 'Favoritar'}: ${suggestion.titulo}`"
                  :title="suggestion.favorita ? 'Remover dos favoritos' : 'Favoritar sugestão'"
                  :disabled="pendingActions.has(suggestion.id)"
                  @click="toggleFavorite(suggestion)"
                >
                  <span
                    :class="['mdi', suggestion.favorita ? 'mdi-star' : 'mdi-star-outline']"
                    aria-hidden="true"
                  ></span>
                </button>
              </div>
            </header>
            <button
              v-if="hasAuthorProfile(suggestion)"
              type="button"
              class="suggestion-author author-link"
              :aria-label="`Ver perfil de ${authorName(suggestion)}`"
              @click="openAuthorProfile(suggestion, $event)"
            >
              <img
                v-if="authorImage(suggestion)"
                class="author-avatar"
                :src="authorImage(suggestion)"
                :alt="`Foto de perfil de ${authorName(suggestion)}`"
              />
              <span
                v-else
                class="mdi mdi-account-circle author-placeholder"
                aria-hidden="true"
              ></span>
              <span class="author-identity">
                <strong>{{ authorName(suggestion) }}</strong>
                <span
                  v-if="suggestion.autor.name && suggestion.autor.name !== authorName(suggestion)"
                >
                  {{ suggestion.autor.name }}
                </span>
              </span>
            </button>
            <p v-else class="suggestion-author">
              <span
                :class="[
                  'mdi',
                  suggestion.anonimo || !suggestion.autor
                    ? 'mdi-account-off-outline'
                    : 'mdi-account-outline',
                ]"
                aria-hidden="true"
              ></span>
              {{ authorName(suggestion) }}
            </p>
            <p class="suggestion-description">{{ suggestion.descricao }}</p>
            <p v-if="suggestion.recusada && suggestion.recusada_em" class="rejection-date">
              Recusada em {{ formatDate(suggestion.recusada_em) }}
            </p>
            <div v-if="suggestion.anexos?.length" class="suggestion-attachments">
              <h4>Anexos</h4>
              <ul>
                <li
                  v-for="(attachment, index) in suggestion.anexos"
                  :key="attachment.attachment_key"
                >
                  <a :href="attachment.url" target="_blank" rel="noopener noreferrer">
                    <span
                      :class="[
                        'mdi',
                        attachment.content_type?.startsWith('image/')
                          ? 'mdi-image-outline'
                          : 'mdi-file-pdf-box',
                      ]"
                      aria-hidden="true"
                    ></span>
                    {{ attachment.description || `Anexo ${index + 1}` }}
                    <span class="mdi mdi-open-in-new" aria-hidden="true"></span>
                  </a>
                </li>
              </ul>
            </div>
            <div class="suggestion-card-actions">
              <button
                v-if="suggestion.recusada"
                type="button"
                class="restore-suggestion"
                :disabled="pendingActions.has(suggestion.id)"
                :aria-label="`Aceitar novamente ${suggestion.titulo}`"
                @click="setRejected(suggestion, false)"
              >
                <span class="mdi mdi-restore" aria-hidden="true"></span>
                {{ pendingActions.has(suggestion.id) ? 'Salvando...' : 'Aceitar novamente' }}
              </button>
              <template v-else>
                <button
                  type="button"
                  class="reject-suggestion"
                  :disabled="pendingActions.has(suggestion.id)"
                  :aria-label="`Recusar ${suggestion.titulo}`"
                  @click="setRejected(suggestion, true)"
                >
                  <span class="mdi mdi-close-circle-outline" aria-hidden="true"></span>
                  {{ pendingActions.has(suggestion.id) ? 'Salvando...' : 'Recusar' }}
                </button>
                <button
                  type="button"
                  class="create-suggestion-project"
                  :disabled="pendingActions.has(suggestion.id)"
                  :aria-label="`Criar projeto a partir de ${suggestion.titulo}`"
                  @click="emit('create', suggestion)"
                >
                  <span class="mdi mdi-plus" aria-hidden="true"></span> Criar
                </button>
              </template>
            </div>
          </article>
        </div>
        <Pagination :current-page="currentPage" :total-pages="totalPages" @change="changePage" />
      </template>
    </div>
    <Teleport to="body">
      <div
        v-if="selectedAuthor"
        ref="profileDialog"
        class="suggestion-profile-overlay"
        role="dialog"
        aria-modal="true"
        :aria-label="`Perfil de ${selectedAuthor.username || selectedAuthor.name}`"
        tabindex="-1"
      >
        <component
          :is="selectedAuthor.tipo === 'aluno' ? studentDetailComponent : teacherDetailComponent"
          :id="String(selectedAuthor.perfil_id)"
          :initial-author="selectedAuthor"
          embedded
          @close="closeAuthorProfile"
        />
      </div>
    </Teleport>
  </section>
</template>

<style scoped src="./teamSuggestionsComponent.css"></style>
