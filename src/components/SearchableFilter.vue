<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  options: { type: Array, default: () => [] },
  label: { type: String, default: 'Pesquisar instituição' },
  placeholder: { type: String, default: 'Instituição...' },
  allLabel: { type: String, default: 'Todas as instituições' },
  emptyLabel: { type: String, default: 'Nenhuma instituição encontrada.' },
  resultsLabel: { type: String, default: 'instituições encontradas' },
})
const emit = defineEmits(['update:modelValue'])
const id = useId()
const root = ref(null)
const input = ref(null)
const query = ref('')
const open = ref(false)
const active = ref(-1)
let clearingWhileTyping = false
const selected = computed(() =>
  props.options.find((item) => String(item.id) === String(props.modelValue)),
)
const normalize = (value) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .trim()
const matches = computed(() => {
  const search = normalize(query.value)
  return props.options.filter((item) => normalize(item.nome).includes(search))
})
watch(
  () => [props.modelValue, props.options],
  () => {
    if (clearingWhileTyping && !props.modelValue) {
      clearingWhileTyping = false
      return
    }
    query.value = selected.value?.nome || ''
  },
  { immediate: true },
)
watch(matches, () => {
  active.value = -1
})
function choose(item) {
  clearingWhileTyping = false
  emit('update:modelValue', item?.id || '')
  query.value = item?.nome || ''
  open.value = false
  active.value = -1
}
function search() {
  open.value = true
  active.value = -1
  if (props.modelValue) {
    clearingWhileTyping = true
    emit('update:modelValue', '')
  }
}
function close() {
  open.value = false
  query.value = selected.value?.nome || ''
  active.value = -1
}
async function navigate(direction) {
  if (!open.value) open.value = true
  active.value = Math.max(0, Math.min(matches.value.length, active.value + direction))
  await nextTick()
  document.getElementById(`${id}-option-${active.value}`)?.scrollIntoView({ block: 'nearest' })
}
function enter(event) {
  if (!open.value || active.value < 0) return
  event.preventDefault()
  choose(active.value === 0 ? null : matches.value[active.value - 1])
}
function outside(event) {
  if (!root.value?.contains(event.target)) close()
}
function blur(event) {
  if (!root.value?.contains(event.relatedTarget)) close()
}
function clear() {
  choose(null)
  input.value?.focus()
}
onMounted(() => document.addEventListener('pointerdown', outside))
onBeforeUnmount(() => document.removeEventListener('pointerdown', outside))
</script>

<template>
  <div ref="root" class="searchable-filter" :class="{ selected: modelValue }" @focusout="blur">
    <div class="field">
      <span class="mdi mdi-magnify" aria-hidden="true"></span>
      <input
        :id="id"
        ref="input"
        v-model="query"
        role="combobox"
        :aria-label="label"
        aria-autocomplete="list"
        aria-haspopup="listbox"
        :aria-expanded="open"
        :aria-controls="`${id}-options`"
        :aria-activedescendant="open && active >= 0 ? `${id}-option-${active}` : undefined"
        :placeholder="placeholder"
        autocomplete="off"
        @focus="open = true"
        @input="search"
        @keydown.down.prevent="navigate(1)"
        @keydown.up.prevent="navigate(-1)"
        @keydown.enter="enter"
        @keydown.esc.prevent="close"
      />
      <button
        v-if="query || modelValue"
        type="button"
        :aria-label="`Limpar: ${label}`"
        @click="clear"
      >
        <span class="mdi mdi-close" aria-hidden="true"></span>
      </button>
    </div>
    <ul v-if="open" :id="`${id}-options`" role="listbox" :aria-label="label" class="options">
      <li
        :id="`${id}-option-0`"
        role="option"
        :aria-selected="!modelValue"
        :class="{ active: active === 0 }"
        @pointerdown.prevent
        @click="choose(null)"
      >
        {{ allLabel }}
      </li>
      <li
        v-for="(item, index) in matches"
        :id="`${id}-option-${index + 1}`"
        :key="item.id"
        role="option"
        :aria-selected="String(item.id) === String(modelValue)"
        :class="{ active: active === index + 1 }"
        @pointerdown.prevent
        @click="choose(item)"
      >
        {{ item.nome }}
      </li>
      <li v-if="!matches.length" role="presentation" class="empty">
        {{ emptyLabel }}
      </li>
    </ul>
    <span class="sr-only" role="status">{{ open ? `${matches.length} ${resultsLabel}` : '' }}</span>
  </div>
</template>

<style scoped>
.searchable-filter {
  position: relative;
  flex: 1;
  min-width: 0;
  color: var(--principal-claro, #003f63);
}
.field {
  display: flex;
  align-items: center;
  gap: 4px;
  min-height: 44px;
  height: 100%;
  padding: 0 8px;
  background: white;
  border: 1px solid #7394b4;
  border-radius: 4px;
}
.selected .field {
  background: #e8f1f8;
  border-color: var(--principal-claro, #003f63);
}
.field:focus-within {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}
input {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: 14px;
  padding: 10px 0;
  text-overflow: ellipsis;
}
input::placeholder {
  color: inherit;
  opacity: 0.85;
}
button {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  padding: 0;
  min-width: 28px;
  min-height: 40px;
  border: 0;
  background: transparent;
  color: inherit;
  font-size: 18px;
  cursor: pointer;
}
.options {
  position: absolute;
  z-index: 30;
  top: calc(100% + 6px);
  left: 0;
  width: max-content;
  min-width: 100%;
  max-width: min(320px, 75vw);
  max-height: 250px;
  overflow-y: auto;
  padding: 4px;
  margin: 0;
  list-style: none;
  border: 1px solid #7394b4;
  border-radius: 6px;
  background: white;
  box-shadow: 0 6px 18px #003f6320;
}
.options li {
  padding: 12px 10px;
  min-height: 44px;
  border-radius: 4px;
  font-size: 14px;
  overflow-wrap: anywhere;
  cursor: pointer;
}
.options li:hover,
.options li.active,
.options li[aria-selected='true'] {
  background: #e8f1f8;
}
.options li.empty {
  color: #555;
  cursor: default;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
</style>
