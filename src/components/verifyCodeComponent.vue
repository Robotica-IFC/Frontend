<script setup>
import { computed, nextTick } from 'vue'
const props = defineProps({
  modelValue: { type: String, default: '' },
  invalid: Boolean,
  disabled: Boolean,
  describedby: String,
})
const emit = defineEmits(['update:modelValue'])
const digits = computed(() =>
  Array.from({ length: 6 }, (_, index) =>
    props.modelValue[index] === ' ' ? '' : props.modelValue[index] || '',
  ),
)
const inputs = []
function update(index, value) {
  const next = [...digits.value]
  next[index] = value
  emit(
    'update:modelValue',
    next
      .map((digit) => digit || ' ')
      .join('')
      .trimEnd(),
  )
}
async function fillDigits(text, index = 0) {
  const numbers = text.replace(/[^0-9]/g, '').slice(0, 6 - index)
  if (!numbers) return
  const next = [...digits.value]
  for (let offset = 0; offset < numbers.length; offset++) next[index + offset] = numbers[offset]
  emit(
    'update:modelValue',
    next
      .map((digit) => digit || ' ')
      .join('')
      .trimEnd(),
  )
  await nextTick()
  inputs[Math.min(index + numbers.length, 5)]?.focus()
}
function enterDigit(event, index) {
  const numbers = event.target.value.replace(/[^0-9]/g, '')
  if (numbers.length > 1) return fillDigits(numbers, index)
  update(index, numbers)
  event.target.value = numbers
  if (numbers && index < 5) inputs[index + 1]?.focus()
}
function pasteDigits(event, index) {
  event.preventDefault()
  fillDigits(event.clipboardData.getData('text'), index)
}
function handleKey(event, index) {
  if (event.key === 'Backspace' && !digits.value[index] && index > 0) {
    event.preventDefault()
    update(index - 1, '')
    inputs[index - 1]?.focus()
  } else if (event.key === 'ArrowLeft' && index > 0) {
    event.preventDefault()
    inputs[index - 1]?.focus()
  } else if (event.key === 'ArrowRight' && index < 5) {
    event.preventDefault()
    inputs[index + 1]?.focus()
  }
}
</script>
<template>
  <fieldset
    class="code-fields"
    :class="{ invalid }"
    :disabled="disabled"
    :aria-describedby="describedby"
  >
    <legend class="sr-only">Código de verificação de seis dígitos enviado por e-mail</legend>
    <input
      v-for="(_, index) in digits"
      :key="index"
      :ref="(element) => (inputs[index] = element)"
      :value="digits[index]"
      :aria-label="`Dígito ${index + 1} do código`"
      :aria-invalid="invalid"
      :aria-describedby="describedby"
      :autocomplete="index === 0 ? 'one-time-code' : 'off'"
      type="text"
      inputmode="numeric"
      pattern="[0-9]"
      required
      :disabled="disabled"
      @input="enterDigit($event, index)"
      @paste="pasteDigits($event, index)"
      @keydown="handleKey($event, index)"
      @focus="$event.target.select()"
    />
  </fieldset>
</template>
<style scoped src="./verifyCodeComponent.css"></style>
