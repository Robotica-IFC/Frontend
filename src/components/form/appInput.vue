<script setup>
import { defineEmits, computed } from 'vue'

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: [String, Number],
  label: {
    type: String,
  },
  type: {
    type: String,
    default: 'text',
  },
  placeholder: String,
  icon: String,
  variant: {
    type: String,
    default: 'primary',
  },
  name: String,
  required: {
    type: Boolean,
    default: false,
  },
  maxlength: Number,
  list: String,
})

const value = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})
</script>

<template>
  <div :class="['input', variant]">
    <label v-if="label || icon" :for="name">
      <span v-if="icon" :class="icon"></span>
      {{ label }}
    </label>

    <input
      :id="name"
      :name="name"
      :type="type"
      :placeholder="placeholder"
      :required="required"
      :class="variant"
      :maxlength="props.maxlength"
      :list="list"
      v-model="value"
      autocomplete="off"
    />

    <slot />
  </div>
</template>

<style scoped src="./appInput.css"></style>
