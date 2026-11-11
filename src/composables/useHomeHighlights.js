import { onBeforeUnmount, onMounted } from 'vue'
import { useHomeHighlightsStore } from '@/store/homeHighlightsStore'

export function useHomeHighlights() {
  const store = useHomeHighlightsStore()
  let interval

  function refreshVisible() {
    if (document.visibilityState === 'visible') store.refresh()
  }

  onMounted(() => {
    store.refresh()
    interval = window.setInterval(refreshVisible, 30_000)
    window.addEventListener('focus', refreshVisible)
    document.addEventListener('visibilitychange', refreshVisible)
  })

  onBeforeUnmount(() => {
    window.clearInterval(interval)
    window.removeEventListener('focus', refreshVisible)
    document.removeEventListener('visibilitychange', refreshVisible)
    store.clear()
  })

  return store
}
