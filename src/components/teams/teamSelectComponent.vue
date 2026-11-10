<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Object, default: null },
  teams: { type: Array, default: () => [] },
  loading: Boolean,
  error: { type: String, default: '' },
  disabled: Boolean,
  invalid: Boolean,
  id: { type: String, default: 'suggestion-team' },
})
const emit = defineEmits(['update:modelValue', 'retry'])
const root = ref(null)
const input = ref(null)
const isOpen = ref(false)
const search = ref('')
const activeIndex = ref(-1)

function normalize(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}
const filteredTeams = computed(() => {
  const query = normalize(search.value.trim())
  return props.teams.filter((team) => normalize(team.nome).includes(query))
})

function close() {
  isOpen.value = false
  search.value = ''
  activeIndex.value = -1
}

function open() {
  if (props.disabled || isOpen.value) return
  isOpen.value = true
  search.value = ''
  activeIndex.value = filteredTeams.value.length ? 0 : -1
  nextTick(() => input.value?.focus())
}

function select(team) {
  emit('update:modelValue', team)
  close()
  input.value?.focus()
}

function handleKeydown(event) {
  if (event.key === 'Escape' || event.key === 'Tab') {
    if (event.key === 'Escape') event.preventDefault()
    close()
  } else if (event.key === 'Enter') {
    event.preventDefault()
    if (!isOpen.value) open()
    else if (filteredTeams.value[activeIndex.value]) select(filteredTeams.value[activeIndex.value])
  } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    if (!isOpen.value) open()
    else if (filteredTeams.value.length) {
      const step = event.key === 'ArrowDown' ? 1 : -1
      activeIndex.value =
        (activeIndex.value + step + filteredTeams.value.length) % filteredTeams.value.length
    }
    nextTick(() =>
      root.value?.querySelector('.active-option')?.scrollIntoView({ block: 'nearest' }),
    )
  }
}

function closeOutside(event) {
  if (!root.value?.contains(event.target)) close()
}

watch(filteredTeams, () => {
  activeIndex.value = filteredTeams.value.length ? 0 : -1
})
watch(
  () => props.disabled,
  (disabled) => {
    if (disabled) close()
  },
)
watch(
  () => props.modelValue,
  () => close(),
)
onMounted(() => document.addEventListener('pointerdown', closeOutside))
onBeforeUnmount(() => document.removeEventListener('pointerdown', closeOutside))
</script>

<template>
  <div ref="root" class="team-select">
    <div class="team-select-control" :class="{ invalid }">
      <input
        ref="input"
        :id="id"
        role="combobox"
        type="text"
        autocomplete="off"
        :value="isOpen ? search : modelValue?.nome || ''"
        :readonly="!isOpen"
        :disabled="disabled"
        :placeholder="isOpen ? 'Pesquisar equipe...' : 'Selecionar equipe'"
        :aria-expanded="isOpen"
        :aria-controls="`${id}-options`"
        aria-autocomplete="list"
        :aria-activedescendant="
          isOpen && activeIndex >= 0 ? `${id}-option-${activeIndex}` : undefined
        "
        :aria-invalid="invalid"
        aria-required="true"
        aria-describedby="suggestion-team-error"
        @click="open"
        @input="search = $event.target.value"
        @keydown="handleKeydown"
      />
      <button
        type="button"
        class="team-select-toggle"
        :disabled="disabled"
        tabindex="-1"
        :aria-label="isOpen ? 'Fechar equipes' : 'Listar equipes'"
        @click="isOpen ? close() : open()"
      >
        <span
          :class="['mdi', isOpen ? 'mdi-chevron-up' : 'mdi-chevron-down']"
          aria-hidden="true"
        ></span>
      </button>
    </div>
    <div v-if="isOpen" class="team-select-dropdown">
      <p v-if="loading" class="team-select-message" role="status">Carregando equipes...</p>
      <div v-else-if="error" class="team-select-message team-select-error" role="alert">
        <p>{{ error }}</p>
        <button type="button" @click="emit('retry')">Tentar novamente</button>
      </div>
      <p v-else-if="!filteredTeams.length" class="team-select-message" role="status">
        Nenhuma equipe encontrada.
      </p>
      <ul
        :id="`${id}-options`"
        role="listbox"
        aria-label="Equipes cadastradas"
        :aria-busy="loading"
      >
        <li
          v-for="(team, index) in filteredTeams"
          :id="`${id}-option-${index}`"
          :key="team.id"
          role="option"
          :aria-selected="modelValue?.id === team.id"
          :class="{ 'active-option': index === activeIndex }"
          @mousedown.prevent
          @click="select(team)"
        >
          <span>{{ team.nome }}</span>
          <span v-if="modelValue?.id === team.id" class="mdi mdi-check" aria-hidden="true"></span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped src="./teamSelectComponent.css"></style>
