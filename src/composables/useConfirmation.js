import { readonly, shallowRef, ref } from 'vue'

const pending = shallowRef(null)
const busy = ref(false)
const error = ref('')
let resolveConfirmation

function errorText(value) {
  if (typeof value === 'string') return value
  if (Array.isArray(value)) return value.map(errorText).join(' ')
  if (value && typeof value === 'object') return Object.values(value).map(errorText).join(' ')
  return ''
}

export function useConfirmation() {
  function cancel() {
    if (busy.value || !pending.value) return
    pending.value = null
    error.value = ''
    resolveConfirmation?.(false)
    resolveConfirmation = undefined
  }

  function confirm(options) {
    // Uma segunda ação não pode substituir uma confirmação aberta.
    if (pending.value) return Promise.resolve(false)
    error.value = ''
    pending.value = options
    return new Promise((resolve) => { resolveConfirmation = resolve })
  }

  async function accept() {
    if (!pending.value || busy.value) return
    busy.value = true
    error.value = ''
    try {
      await pending.value.onConfirm?.()
      pending.value = null
      resolveConfirmation?.(true)
      resolveConfirmation = undefined
    } catch (cause) {
      error.value = errorText(cause?.response?.data) || 'Não foi possível concluir a ação. Tente novamente.'
    } finally {
      busy.value = false
    }
  }

  return { pending: readonly(pending), busy: readonly(busy), error: readonly(error), confirm, accept, cancel }
}
