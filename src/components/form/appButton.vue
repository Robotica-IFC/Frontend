<script setup>
const emit = defineEmits(['click'])

const props = defineProps({
  label: String,
  variant: {
    type: String,
    default: 'primary'
  }
})
</script>

<template>
  <div class="btn">
    <button
      type="button"
      :class="variant"
      @click="emit('click')"
    >
      {{ label }}
      <slot />
    </button>
  </div>
</template>

<style scoped>
.btn {
  text-align: center;
  margin-top: 20px;
}

.btn button {
  border: none;
  transition: 0.3s;
}

.primary {
  border-radius: 8px;
  font-size: 16px;
  padding: 10px 80px;
  background-color: var(--principal-claro);
  color: var(--fundo-claro);
}

.primary:active {
  transform: scale(0.95);
}
</style>