<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useProjectSuggestionsStore } from '@/store/projectSuggestionsStore'

const props = defineProps({
  teamId: { type: [String, Number], required: true },
})
const emit = defineEmits(['create'])
const suggestionsStore = useProjectSuggestionsStore()
const suggestions = ref([])
const loading = ref(false)
const errorMessage = ref('')
const search = ref('')
const filteredSuggestions = computed(() => {
  const query = normalize(search.value.trim())
  return suggestions.value.filter((suggestion) =>
    normalize(`${suggestion.titulo} ${suggestion.descricao} ${authorName(suggestion)}`).includes(
      query,
    ),
  )
})
let controller

function normalize(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function authorName(suggestion) {
  if (suggestion.anonimo || !suggestion.autor) return 'Usuário não identificado'
  return suggestion.autor.name || suggestion.autor.username || 'Usuário não identificado'
}

async function loadSuggestions() {
  controller?.abort()
  const requestController = new AbortController()
  controller = requestController
  loading.value = true
  errorMessage.value = ''
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

watch(
  () => props.teamId,
  () => {
    search.value = ''
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
      <button type="button" :disabled="loading" @click="loadSuggestions">
        <span class="mdi mdi-refresh" aria-hidden="true"></span> Atualizar
      </button>
    </header>
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
    <p v-else-if="!suggestions.length" class="suggestions-message" role="status">
      Esta equipe ainda não recebeu sugestões de projetos.
    </p>
    <p v-else-if="!filteredSuggestions.length" class="suggestions-message" role="status">
      Nenhuma sugestão encontrada para esta pesquisa.
    </p>
    <template v-else>
      <div class="suggestions-list">
        <article
          v-for="suggestion in filteredSuggestions"
          :key="suggestion.id"
          class="suggestion-card"
        >
          <header class="suggestion-card-header">
            <h3>{{ suggestion.titulo }}</h3>
            <time :datetime="suggestion.criado_em">{{ formatDate(suggestion.criado_em) }}</time>
          </header>
          <p class="suggestion-author">
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
          <div v-if="suggestion.anexos?.length" class="suggestion-attachments">
            <h4>Anexos</h4>
            <ul>
              <li v-for="(attachment, index) in suggestion.anexos" :key="attachment.attachment_key">
                <a :href="attachment.url" target="_blank" rel="noopener noreferrer">
                  <span class="mdi mdi-file-pdf-box" aria-hidden="true"></span>
                  {{ attachment.description || `Anexo ${index + 1} (PDF)` }}
                  <span class="mdi mdi-open-in-new" aria-hidden="true"></span>
                </a>
              </li>
            </ul>
          </div>
          <div class="suggestion-card-actions">
            <button
              type="button"
              class="create-suggestion-project"
              :aria-label="`Criar projeto a partir de ${suggestion.titulo}`"
              @click="emit('create', suggestion)"
            >
              <span class="mdi mdi-plus" aria-hidden="true"></span> Criar
            </button>
          </div>
        </article>
      </div>
    </template>
  </section>
</template>

<style scoped src="./teamSuggestionsComponent.css"></style>
