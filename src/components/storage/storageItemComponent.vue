<script setup>
defineProps({
  item: {
    type: Object,
    required: true,
  },
})

defineEmits(['edit'])
</script>

<template>
  <button type="button" class="item-row" @click="$emit('edit', item)">
    <div class="item-info">
      <img
        v-if="item.imagem_detail?.file || item.imagem_detail?.url"
        :src="item.imagem_detail.file || item.imagem_detail.url"
        :alt="item.nome"
        class="item-img"
      />
      <div v-else class="item-img placeholder">
        <span class="mdi mdi-image-outline"></span>
      </div>
      <span class="item-nome">{{ item.nome }}</span>
    </div>

    <div class="item-meta">
      <span class="item-qtd">
        <span class="mdi mdi-package-variant-closed"></span>
        {{ item.quantidade }} un.
      </span>
      <span class="mdi mdi-chevron-right"></span>
    </div>
  </button>
</template>

<style scoped src="./storageItemComponent.css"></style>