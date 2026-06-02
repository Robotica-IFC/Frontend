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

<style scoped>
div.input {
  border-bottom: 1px var(--principal-claro) solid;
  display: flex;
  justify-content: left;
  gap: 10px;
  text-align: left;
  margin: 0 auto;
  width: 300px;
  font-size: 28px;
  margin-top: 12px;
  box-sizing: border-box;
}

label {
  display: flex;
  align-items: center;
  gap: 6px;
}

input {
  border: none;
  outline: none;
  width: 100%;
  box-sizing: border-box;
}

div.input ::placeholder {
  color: #9a9a9a;
}

.mdi {
  color: var(--principal-claro);
}

div.input.terciary {
  border: 1px solid var(--principal-claro);
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.586);
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  box-sizing: border-box;
}

input.terciary {
  width: 100%;
  height: 100%;
  text-align: center;
  background-color: transparent;
  margin: 0;
  padding: 0;
  border: none;
  outline: none;
  box-sizing: border-box;
  font-size: 20px;
}

div.input.signImage {
  border: none;
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background-color: #e8dfd7;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

div.input.signImage input {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

div.input.signImage img.preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

div.input.signImage .mdi-account {
  font-size: 45px;
  color: #555;
}

div.input.signImage .camera {
  position: absolute;
  bottom: 5px;
  right: 5px;
  background: #0e3a5d;
  color: white;
  font-size: 16px;
  border-radius: 50%;
  padding: 6px;
}

input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
}
</style>
