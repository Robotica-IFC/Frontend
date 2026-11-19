import { computed, nextTick } from 'vue'
import { formatPersonalField, maskedEdit } from '@/utils/personalData'

export function useFormattedInput(getValue, getField, update) {
  const masked = computed(() => ['cpf', 'telefone'].includes(getField()))
  const displayValue = computed(() => formatPersonalField(getValue() ?? '', getField()))
  const maskAttrs = computed(() =>
    masked.value
      ? {
          inputmode: 'numeric',
          maxlength: getField() === 'cpf' ? 14 : 20,
          minlength: undefined,
        }
      : {},
  )
  async function handleInput(event) {
    if (event.isComposing) return
    const element = event.target
    if (!masked.value) {
      const number = element.type === 'number' ? Number.parseFloat(element.value) : NaN
      update(Number.isNaN(number) ? element.value : number)
      return
    }
    const edit = maskedEdit(
      element.value,
      element.selectionStart ?? element.value.length,
      event.inputType,
      getValue(),
      getField(),
    )
    update(edit.raw)
    element.value = edit.text
    await nextTick()
    if (document.activeElement === element) element.setSelectionRange(edit.caret, edit.caret)
  }
  return { displayValue, maskAttrs, handleInput }
}
