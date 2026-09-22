<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useStorageStore } from '@/store/storageStore'
import { ITEM_CATEGORIES } from '@/constants/itemCategories'
import storageItemComponent from './storageItemComponent.vue'
import itemFormModal from './itemFormModal.vue'

const props = defineProps({
  storageId: {
    type: [Number, String],
    required: true,
  },
})

const storageStore = useStorageStore()
const { storage } = storeToRefs(storageStore)

const searchQuery = ref('')
const selectedCategory = ref(null)
const showCategoryDropdown = ref(false)
const collapsedCategories = reactive({})
const showModal = ref(false)
const editingItem = ref(null)
const filterRef = ref(null)

const totalItens = computed(() => storage.value?.itens?.length || 0)

const filteredItens = computed(() => {
  const itens = storage.value?.itens || []
  const query = searchQuery.value.trim().toLowerCase()

  return itens.filter((item) => {
    const matchesSearch = !query || item.nome.toLowerCase().includes(query)
    const matchesCategory = !selectedCategory.value || item.categoria === selectedCategory.value
    return matchesSearch && matchesCategory
  })
})

const groupedCategorias = computed(() =>
  ITEM_CATEGORIES.map((cat) => ({
    ...cat,
    itens: filteredItens.value.filter((item) => item.categoria === cat.value),
  })).filter((cat) => cat.itens.length > 0),
)

function toggleCategoryDropdown() {
  showCategoryDropdown.value = !showCategoryDropdown.value
}

function selectCategory(value) {
  selectedCategory.value = selectedCategory.value === value ? null : value
  showCategoryDropdown.value = false
}

function toggleCollapse(value) {
  collapsedCategories[value] = !collapsedCategories[value]
}

function openCreateModal() {
  editingItem.value = null
  showModal.value = true
}

function openEditModal(item) {
  editingItem.value = item
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingItem.value = null
}

function handleItemCreated(item) {
  storageStore.addItem(item)
}

function handleItemUpdated(item) {
  storageStore.updateItemInStorage(item)
}

function handleItemDeleted(id) {
  storageStore.removeItem(id)
}

function handleClickOutside(event) {
  if (filterRef.value && !filterRef.value.contains(event.target)) {
    showCategoryDropdown.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))
</script>

<template>
  <div class="storage-wrapper">
    <div class="top-storage">
      <div class="title">
        <h2>Estoque</h2>
        <span class="circle">{{ totalItens }}</span>
      </div>
      <p>Itens disponíveis para uso nos projetos da equipe.</p>
    </div>

    <div class="search-row">
      <div class="search-box">
        <i class="mdi mdi-magnify"></i>
        <input type="text" v-model="searchQuery" placeholder="Buscar item..." />
      </div>

      <div class="category-filter" ref="filterRef">
        <button type="button" class="filter-toggle" @click="toggleCategoryDropdown">
          <i class="mdi" :class="showCategoryDropdown ? 'mdi-chevron-up' : 'mdi-chevron-down'"></i>
        </button>

        <div v-if="showCategoryDropdown" class="dropdown-menu">
          <button
            v-for="cat in ITEM_CATEGORIES"
            :key="cat.value"
            type="button"
            class="dropdown-item"
            :class="{ active: selectedCategory === cat.value }"
            @click="selectCategory(cat.value)"
          >
            {{ cat.label }}
          </button>
        </div>
      </div>
    </div>

    <button type="button" class="btn-add" @click="openCreateModal">
      <i class="mdi mdi-pencil-outline"></i>
      Adicionar item
    </button>

    <p v-if="!storage" class="empty-state">Carregando estoque...</p>
    <p v-else-if="groupedCategorias.length === 0" class="empty-state">Nenhum item encontrado.</p>

    <div v-for="cat in groupedCategorias" :key="cat.value" class="category-section">
      <button type="button" class="category-header" @click="toggleCollapse(cat.value)">
        <div class="category-title">
          <i class="mdi" :class="cat.icon"></i>
          <h3>{{ cat.label }}</h3>
          <span class="circle small">{{ cat.itens.length }}</span>
        </div>
        <i class="mdi" :class="collapsedCategories[cat.value] ? 'mdi-chevron-down' : 'mdi-chevron-up'"></i>
      </button>

      <div v-if="!collapsedCategories[cat.value]" class="category-items">
        <storageItemComponent v-for="item in cat.itens" :key="item.id" :item="item" @edit="openEditModal" />
      </div>
    </div>

    <itemFormModal
      v-if="showModal"
      :estoque-id="storageId"
      :item="editingItem"
      @close="closeModal"
      @created="handleItemCreated"
      @updated="handleItemUpdated"
      @deleted="handleItemDeleted"
    />
  </div>
</template>

<style scoped>
.storage-wrapper {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding-bottom: 40px;
}

.top-storage {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;

  & p {
    font-size: 13px;
    color: var(--placeholder);
  }
}

.title {
  display: flex;
  align-items: center;
  gap: 10px;

  & h2 {
    font-size: 23px;
    color: var(--h2-titulo);
  }
}

.circle {
  background-color: var(--destaque-claro);
  color: white;
  width: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  aspect-ratio: 1/1;
  font-size: 15px;
  font-weight: 600;
  flex-shrink: 0;
}

.circle.small {
  width: 22px;
  font-size: 12px;
}

.search-row {
  display: flex;
  gap: 10px;
}

.search-box {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  background: #ffffff;

  & i {
    color: var(--placeholder);
    font-size: 1.1rem;
    flex-shrink: 0;
  }

  & input {
    flex: 1;
    min-width: 0;
    border: none;
    outline: none;
    font-size: 0.95rem;
    font-family: inherit;
    color: var(--texto-claro);
  }

  & input::placeholder {
    color: var(--placeholder);
  }
}

.category-filter {
  position: relative;
}

.filter-toggle {
  width: 44px;
  height: 44px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--principal-claro);
  font-size: 1.2rem;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
  min-width: 180px;
  overflow: hidden;
  z-index: 20;
}

.dropdown-item {
  width: 100%;
  text-align: left;
  padding: 10px 14px;
  background: #ffffff;
  border: none;
  font-size: 0.9rem;
  color: var(--texto-claro);
  cursor: pointer;
  font-family: inherit;
}

.dropdown-item:hover {
  background: #f1f5f9;
}

.dropdown-item.active {
  background: var(--destaque-claro);
  color: #ffffff;
}

.btn-add {
  align-self: flex-start;
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--botao-claro);
  color: #ffffff;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
}

.btn-add:hover {
  background: var(--hover-principal-claro);
}

.empty-state {
  color: var(--placeholder);
  font-size: 0.9rem;
  text-align: center;
  padding: 20px 0;
}

.category-section {
  display: flex;
  flex-direction: column;
}

.category-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  background: none;
  border: none;
  padding: 8px 0;
  cursor: pointer;
  font-family: inherit;

  & > .mdi {
    color: var(--placeholder);
    flex-shrink: 0;
  }
}

.category-title {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  flex: 1;

  & i {
    color: var(--principal-claro);
    font-size: 1.2rem;
    flex-shrink: 0;
  }

  & h3 {
    flex: 1;
    min-width: 0;
    font-size: 1.1rem;
    color: var(--h2-titulo);
    font-weight: 700;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.category-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 8px;
  margin-bottom: 16px;
}
</style>