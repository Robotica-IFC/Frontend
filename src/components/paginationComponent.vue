<script setup>
const props = defineProps({
  currentPage: Number,
  totalPages: Number,
});

const emit = defineEmits(["change"]);

function changePage(page) {
  if (page >= 1 && page <= props.totalPages) {
    emit("change", page);
  }
}
</script>

<template>
  <nav class="pagination" v-if="totalPages > 1">

    <button
      @click="changePage(currentPage - 1)"
      :disabled="currentPage === 1"
    >
      <span class="mdi mdi-arrow-left"></span>
    </button>

    <button
      v-for="page in totalPages"
      :key="page"
      @click="changePage(page)"
      :class="{ active: page === currentPage }"
    >
      {{ page }}
    </button>

    <button
      @click="changePage(currentPage + 1)"
      :disabled="currentPage === totalPages"
    >
      <span class="mdi mdi-arrow-right"></span>
    </button>

  </nav>
</template>
