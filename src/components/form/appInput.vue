<script setup>
import { defineEmits } from 'vue'

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: String,
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
    default: false
  },
  maxlength: Number
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
      :value="modelValue"
      @input="emit('update:modelValue', $event.target.value)"
      :required="required"
      :class="variant"
      :maxlength="props.maxlength"

    />

    <slot />
  </div>
</template>

<style scoped>
/* Estilos gerais */
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

/* Estilos para variant terciary */
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
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Para Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>