import { readonly, ref } from 'vue'

const loading = ref(false)
let pending = 0
let finishTimer
export const requestsLoading = readonly(loading)

export function beginRequest() {
  clearTimeout(finishTimer)
  pending += 1
  loading.value = true
  let finished = false
  return () => {
    if (finished) return
    finished = true
    pending -= 1
    if (!pending) {
      // Keep dependent requests in the same loading cycle, without flashing the page.
      finishTimer = setTimeout(() => { loading.value = pending > 0 }, 120)
    }
  }
}
