<script setup>
import { defineEmits, computed, useAttrs, useId, onMounted } from 'vue'
import FieldHint from './FieldHint.vue'
import { useFormLimits } from '@/composables/useFormLimits'

defineOptions({ inheritAttrs: false })
const attrs = useAttrs()
const limits = useFormLimits()
const hintId = useId()
const inputId = useId()
onMounted(() => { if (props.resource) limits.load() })

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
  maxlength: [Number, String],
  resource: String,
  field: String,
  list: String,
})

const value = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})
</script>

<template>
  <div :class="['input', variant, attrs.class, { 'with-limits': resource && field, 'has-label': label }]" :style="attrs.style">
    <label v-if="label || icon" :for="name || attrs.id || inputId">
      <span v-if="icon" :class="icon"></span>
      {{ label }}
    </label>

    <input
      v-bind="{ ...attrs, class: undefined, style: undefined, ...(resource ? limits.attrs(resource, field) : {}) }"
      :id="name || attrs.id || inputId"
      :name="name"
      :type="type"
      :placeholder="placeholder"
      :required="required"
      :class="variant"
      :maxlength="resource ? limits.attrs(resource, field).maxlength : props.maxlength"
      :aria-describedby="resource ? hintId : attrs['aria-describedby']"
      :aria-label="attrs['aria-label'] || label || placeholder"
      :list="list"
      v-model="value"
      autocomplete="off"
    />

    <slot />
    <FieldHint v-if="resource && field" :id="hintId" :resource="resource" :field="field" :value="modelValue" />
  </div>
</template>

<style scoped src="./appInput.css"></style>
<style scoped>
.input.with-limits { flex-wrap: wrap; max-width: 100%; row-gap: 2px; }
.input.with-limits input { flex: 1; min-width: 0; }
.input.with-limits > .field-hint { flex: 0 0 100%; order: 2; }
.input.with-limits.has-label label { flex: 0 0 100%; margin-bottom: 4px; font-size: 14px; font-weight: 600; }
.input.with-limits.has-label input { min-height: 40px; font-size: 16px; }
</style>
