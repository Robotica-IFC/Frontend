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
        <span class="mdi mdi-magnify"></span>
        <input type="text" v-model="searchQuery" placeholder="Buscar item..." />
      </div>

      <div class="category-filter" ref="filterRef">
        <button type="button" class="filter-toggle" @click="toggleCategoryDropdown">
          <span class="mdi" :class="showCategoryDropdown ? 'mdi-chevron-up' : 'mdi-chevron-down'"></span>
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
      <span class="mdi mdi-pencil-outline"></span>
      Adicionar item
    </button>

    <p v-if="!storage" class="empty-state">Carregando estoque...</p>
    <p v-else-if="groupedCategorias.length === 0" class="empty-state">Nenhum item encontrado.</p>

    <div v-for="cat in groupedCategorias" :key="cat.value" class="category-section">
      <button type="button" class="category-header" @click="toggleCollapse(cat.value)">
        <div class="category-title">
          <span class="mdi" :class="cat.icon"></span>
          <h3>{{ cat.label }}</h3>
          <span class="circle small">{{ cat.itens.length }}</span>
        </div>
        <span class="mdi" :class="collapsedCategories[cat.value] ? 'mdi-chevron-down' : 'mdi-chevron-up'"></span>
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

<style scoped src="./filterStorageComponent.css"></style>
