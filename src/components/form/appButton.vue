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
  width: {
    type: String,
    default: "100%",
  },
  font: {
    type: String,
  }
});

</script>

<template>
  <div class="btn">
    <button :type="props.type" :class="props.variant" :style="{ width: props.width, fontSize: props.font }" @click="emit('click', props.variant)">
      {{ props.label }}
      <slot />
    </button>
  </div>
</template>

<style scoped src="./appButton.css"></style>
