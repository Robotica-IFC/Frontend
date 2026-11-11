<script setup>
import { computed, onMounted } from 'vue'
import { useFormLimits } from '@/composables/useFormLimits'

const props = defineProps({
  resource: { type: String, required: true },
  field: { type: String, required: true },
  value: { type: [String, Number], default: '' },
})
const limits = useFormLimits()
onMounted(limits.load)
const rule = computed(() => limits.field(props.resource, props.field))
const length = computed(() => Array.from(String(props.value ?? '')).length)
const exceeded = computed(() => rule.value.max_length != null && length.value > rule.value.max_length)
const number = value => (typeof value === 'string' ? BigInt(value) : value).toLocaleString('pt-BR')
</script>
<template>
  <small class="field-hint" :class="{ 'limit-exceeded': exceeded }">
    <template v-if="!limits.ready.value">{{ limits.unavailable.value ? 'As regras serão verificadas ao salvar.' : 'Consultando limites...' }}</template>
    <template v-else-if="rule.type === 'integer'">Somente números inteiros<span v-if="rule.min_value != null">, mínimo {{ number(rule.min_value) }}</span><span v-if="rule.max_value != null"> e máximo {{ number(rule.max_value) }}</span>.</template>
    <template v-else-if="rule.max_length != null">{{ length }}/{{ rule.max_length }} caracteres<span v-if="length >= rule.max_length"> — {{ exceeded ? 'limite excedido' : 'limite atingido' }}</span><span v-if="rule.min_length"> · mínimo {{ rule.min_length }}</span></template>
    <template v-else-if="rule.min_length">Mínimo de {{ rule.min_length }} caracteres.</template>
    <template v-else>{{ length }} caracteres · Sem limite de caracteres definido.</template>
  </small>
</template>
<style scoped>
.field-hint { display: block; width: 100%; margin-top: 4px; color: #526b7e; font-size: 12px; font-weight: 400; line-height: 1.5; overflow-wrap: anywhere; }
.limit-exceeded { color: #b32634; }
</style>
