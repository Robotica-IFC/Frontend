<script setup>
import { defineEmits } from 'vue'

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: String,
  label: {
    type: String,
    required: true,
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
  }
})
</script>

<template>
  <div class="input">
    <label v-if="props.label != '' || props.icon != ''" :for="props.name">
      <span v-if="props.icon != ''" :class="props.icon"></span>
      {{ props.label }}
    </label>

    <input
      :id="props.name"
      :name="props.name"
      :type="props.type"
      :placeholder="props.placeholder"
      :value="props.modelValue"
      @input="emit('update:modelValue', $event.target.value)"
      :required="props.required"
    />

    <slot />
  </div>
</template>
<style scoped>
input {
  border: none;
}
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
}
input {
  border: none;
  outline: none;
  width: 100%;
}

div.input ::placeholder {
  color: #9a9a9a;
}

.mdi {
  color: var(--principal-claro);
}
</style>
