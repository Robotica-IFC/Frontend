<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: Number,
  totalPages: Number,
})

const emit = defineEmits(['change'])

function changePage(page) {
  page = Number(page)

  if (page >= 1 && page <= props.totalPages) {
    emit('change', page)
  }
}

const visiblePages = computed(() => {
  const total = props.totalPages
  const current = props.currentPage

  // poucas páginas
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  // começo
  if (current <= 2) {
    return [1, 2, 3, '...', total]
  }

  // final
  if (current >= total - 1) {
    return [1, '...', total - 2, total - 1, total]
  }

  // meio
  return [1, '...', current - 1, current, current + 1, '...', total]
})
</script>

<template>
  <nav class="pagination" v-if="totalPages > 1">
    <div class="pages">
      <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">
        <span class="mdi mdi-arrow-left"></span>
      </button>

      <template v-for="(page, index) in visiblePages" :key="index">
        <span v-if="page === '...'" class="dots"> ... </span>

        <button
          v-else
          @click="changePage(page)"
          class="page-btn"
          :class="{ active: page === currentPage }"
        >
          {{ page }}
        </button>
      </template>

      <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">
        <span class="mdi mdi-arrow-right"></span>
      </button>
    </div>
  </nav>
</template>

<style scoped src="./paginationComponent.css"></style>
