<script setup>
const emit = defineEmits(["click"]);

const props = defineProps({
  label: String,
  variant: {
    type: String,
    default: "primary",
  },
  type: {
    type: String,
    default: "button",
  },
});
</script>

<template>
  <div class="btn">
    <button :type="props.type" :class="props.variant" @click="emit('click', props.variant)">
      {{ props.label }}
      <slot />
    </button>
  </div>
</template>

<style scoped>
.btn {
  text-align: center;
  margin-top: 10px;
}
.btn button {
  text-align: center;
  border: none;
  transition: 0.1s;
  width: 100%;
}

.primary {
  border-radius: 8px;
  font-size: 16px;
  padding: 10px 80px;
  height: auto;
  background-color: var(--principal-claro);
  color: var(--fundo-claro);
}
.secondary {
  color: var(--destaque-claro);
  font-size: 16px;
  background-color: transparent;
  padding: 5px;
  position: relative;
}

.btn button.primary:active {
  transform: scale(0.95);
  background-color: var(--principal-claro);
}

.btn button.secondary:active::after{
    content: '';
    position: absolute;
    width: 100%;
    height: 1px;
    background-color: var(--destaque-claro);
    bottom: 0;
    left: 0;
}
</style>
