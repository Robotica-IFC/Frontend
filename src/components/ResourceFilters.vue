<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, useId, watch } from 'vue'
import api from '@/api/config'
import SearchableFilter from './SearchableFilter.vue'

const props = defineProps({ kind: { type: String, default: 'projects' }, teamOnly: Boolean })
const emit = defineEmits(['change'])
const id = useId()
const teams = computed(() => props.kind === 'teams')
const filters = reactive({
  search: '',
  status: '',
  institution: '',
  team: '',
  category: '',
})
const options = ref({ instituicoes: [], equipes: [], categorias: [] })
const optionsError = ref(false)
let timer
let controller
function publish() {
  clearTimeout(timer)
  const params = { search: filters.search.trim() }
  if (teams.value) {
    if (filters.institution) params.instituicao = filters.institution
    if (filters.category) params.categorias = filters.category
  } else {
    if (filters.status) params.status = filters.status
    if (!props.teamOnly && filters.institution) params.equipe__instituicao = filters.institution
    if (!props.teamOnly && filters.team) params.equipe = filters.team
  }
  emit('change', params)
}
watch(
  () => filters.search,
  () => {
    clearTimeout(timer)
    timer = setTimeout(publish, 300)
  },
)
watch(() => [filters.status, filters.institution, filters.team, filters.category], publish)
const hasFilters = computed(() => Object.values(filters).some(Boolean))
function reset() {
  Object.keys(filters).forEach((key) => {
    filters[key] = ''
  })
  publish()
}
async function loadOptions() {
  controller?.abort()
  controller = new AbortController()
  optionsError.value = false
  try {
    const { data } = await api.get(teams.value ? '/equipes/filtros/' : '/projetos/filtros/', {
      signal: controller.signal,
    })
    options.value = data
  } catch (error) {
    if (error.code !== 'ERR_CANCELED') optionsError.value = true
  }
}
onMounted(() => {
  if (!props.teamOnly) loadOptions()
})
onBeforeUnmount(() => {
  clearTimeout(timer)
  controller?.abort()
})
</script>

<template>
  <div
    class="resource-filters"
    role="search"
    :aria-label="teams ? 'Filtrar equipes' : 'Filtrar projetos'"
  >
    <label class="search-field" :for="`${id}-search`">
      <span class="mdi mdi-magnify" aria-hidden="true"></span>
      <input
        :id="`${id}-search`"
        v-model="filters.search"
        type="search"
        :aria-label="teams ? 'Buscar equipe' : 'Buscar projeto'"
        :placeholder="teams ? 'Buscar equipe...' : 'Buscar projeto...'"
      />
    </label>
    <div class="selects">
      <template v-if="teams">
        <SearchableFilter v-model="filters.institution" :options="options.instituicoes" />
        <select
          v-model="filters.category"
          aria-label="Área de atuação"
          :class="{ selected: filters.category }"
        >
          <option value="">Área de atuação</option>
          <option v-for="item in options.categorias" :key="item.id" :value="item.id">
            {{ item.nome }}
          </option>
        </select>
      </template>
      <template v-else>
        <select
          v-model="filters.status"
          aria-label="Status do projeto"
          :class="{ selected: filters.status }"
        >
          <option value="">Status: todos</option>
          <option value="EM_ANDAMENTO">Em andamento</option>
          <option value="CONCLUIDO">Concluído</option>
          <option value="CANCELADO">Cancelado</option>
        </select>
        <template v-if="!teamOnly">
          <SearchableFilter v-model="filters.institution" :options="options.instituicoes" />
          <SearchableFilter
            v-model="filters.team"
            :options="options.equipes"
            label="Pesquisar equipe"
            placeholder="Equipe..."
            all-label="Todas as equipes"
            empty-label="Nenhuma equipe encontrada."
            results-label="equipes encontradas"
          />
        </template>
      </template>
    </div>
    <button v-if="hasFilters" type="button" class="clear" @click="reset">Limpar filtros</button>
    <p v-if="optionsError" class="options-error" role="status">
      Não foi possível carregar as opções.
      <button type="button" @click="loadOptions">Tentar novamente</button>
    </p>
  </div>
</template>

<style scoped>
.resource-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 20px 0 28px;
  color: var(--principal-claro, #003f63);
  min-width: 0;
}
.search-field {
  display: flex;
  align-items: center;
  flex: 1 1 100%;
  border: 1px solid #7394b4;
  border-radius: 4px;
  padding: 0 10px;
  min-width: 0;
  min-height: 44px;
  gap: 6px;
}
.search-field .mdi {
  font-size: 24px;
}
input {
  border: 0;
  outline: 0;
  min-width: 0;
  width: 100%;
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: 14px;
  padding: 10px 0;
}
input::placeholder {
  color: inherit;
  opacity: 0.8;
}
.search-field:focus-within {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}
.selects {
  display: flex;
  width: 100%;
  gap: 8px;
}
select {
  flex: 1;
  width: 0;
  min-width: 0;
  min-height: 44px;
  border: 1px solid #7394b4;
  border-radius: 4px;
  color: inherit;
  font: inherit;
  font-size: 14px;
  padding: 8px 26px 8px 8px;
  background: white
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='10' viewBox='0 0 14 10'%3E%3Cpath d='m1 2 6 6 6-6' fill='none' stroke='%23003f63' stroke-width='1.5'/%3E%3C/svg%3E")
    no-repeat right 8px center;
  appearance: none;
  text-overflow: ellipsis;
}
select.selected {
  background-color: #e8f1f8;
  border-color: var(--principal-claro, #003f63);
  font-weight: 600;
}
.clear,
.options-error button {
  border: 0;
  background: transparent;
  color: inherit;
  text-decoration: underline;
  cursor: pointer;
  min-height: 44px;
  padding: 4px;
  font: inherit;
  font-size: 14px;
}
.options-error {
  flex-basis: 100%;
  margin: 0;
  font-size: 14px;
}
@media (min-width: 950px) {
  .resource-filters {
    align-items: center;
    gap: 16px;
    margin-bottom: 36px;
  }
  .search-field {
    flex: 1 1 280px;
  }
  .selects {
    flex: 1 1 360px;
    width: auto;
  }
  select {
    padding-top: 12px;
    padding-bottom: 12px;
  }
}
</style>
