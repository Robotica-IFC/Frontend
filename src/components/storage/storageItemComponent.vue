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

<style scoped>
.item-row {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  transition: border-color 0.15s ease;
}

.item-row:hover {
  border-color: var(--destaque-claro);
}

.item-info {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.item-img {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
  background: #f1f5f9;
}

.item-img.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-size: 1.2rem;
}

.item-nome {
  flex: 1;
  min-width: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--texto-claro);
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;

  & .mdi-chevron-right {
    color: #94a3b8;
    font-size: 1.3rem;
  }
}

.item-qtd {
  display: flex;
  align-items: center;
  gap: 4px;
  background: var(--destaque-claro);
  color: #ffffff;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
}
</style>