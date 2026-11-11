import { defineStore } from 'pinia'
import { ref } from 'vue'
import notificationsApi from '../api/notificationsApi.js'
import { formatApiError } from '../utils/formValidation.js'

export const useNotificationsStore = defineStore('notifications', () => {
  const notifications = ref([])
  const unread = ref(0)
  const loading = ref(false)
  const reading = ref([])
  const error = ref('')
  const hasMore = ref(false)
  const toast = ref(null)
  let lastAnnounced = null
  const readDates = new Map()
  let page = 0
  let generation = 0
  let readVersion = 0
  let inFlight = null
  let countInFlight = null

  async function refreshCount() {
    if (countInFlight) return countInFlight
    const session = generation
    const version = readVersion
    const request = notificationsApi.unread().then(({ data }) => {
      if (session === generation && version === readVersion) {
        unread.value = data.nao_lidas
        if (!data.nao_lidas) toast.value = null
        // Ler a mais recente pode revelar um ID antigo: isso não é uma nova atividade.
        else if (data.ultima_nao_lida && (lastAnnounced === null || data.ultima_nao_lida > lastAnnounced)) {
          lastAnnounced = data.ultima_nao_lida
          toast.value = { id: data.ultima_nao_lida, count: data.nao_lidas }
        }
      }
    }).finally(() => {
      if (countInFlight === request) countInFlight = null
    })
    countInFlight = request
    return request
  }

  async function fetchPages(more = false) {
    if (inFlight) return inFlight
    if (more && !hasMore.value) return
    const session = generation
    const version = readVersion
    loading.value = true
    error.value = ''
    const request = (async () => {
      try {
        let items = more ? [...notifications.value] : []
        const first = more ? page + 1 : 1
        const last = more ? first : Math.max(1, page)
        let response
        let loadedPage = first
        for (let current = first; current <= last; current++) {
          response = (await notificationsApi.list(current)).data
          if (session !== generation) return
          items.push(...response.results)
          loadedPage = current
          if (!response.next) break
        }
        notifications.value = [...new Map(items.map(item => [item.id, {
          ...item, lida_em: readDates.get(item.id) || item.lida_em,
        }])).values()]
        page = loadedPage
        hasMore.value = Boolean(response.next)
        if (version === readVersion) unread.value = response.nao_lidas
      } catch (err) {
        if (session === generation) {
          error.value = formatApiError(err, 'Não foi possível carregar as notificações. Tente novamente.')
        }
        throw err
      } finally {
        if (session === generation) loading.value = false
        if (inFlight === request) inFlight = null
      }
    })()
    inFlight = request
    return request
  }

  async function markRead(notification) {
    if (reading.value.includes(notification.id)) return false
    if (notification.lida_em || readDates.has(notification.id)) return true
    const session = generation
    reading.value = [...reading.value, notification.id]
    error.value = ''
    try {
      const { data } = await notificationsApi.read(notification.id)
      if (session !== generation) return false
      readDates.set(notification.id, data.lida_em)
      readVersion++
      const item = notifications.value.find(item => item.id === notification.id)
      if (item) item.lida_em = data.lida_em
      unread.value = Math.max(0, unread.value - 1)
      countInFlight = null
      refreshCount().catch(() => {})
      return true
    } catch (err) {
      if (session === generation) {
        error.value = formatApiError(err, 'Não foi possível marcar a notificação como lida. Tente novamente.')
      }
      throw err
    } finally {
      if (session === generation) reading.value = reading.value.filter(id => id !== notification.id)
    }
  }

  function clear() {
    generation++
    readVersion++
    inFlight = null
    countInFlight = null
    readDates.clear()
    toast.value = null
    lastAnnounced = null
    notifications.value = []
    unread.value = 0
    page = 0
    hasMore.value = false
    loading.value = false
    reading.value = []
    error.value = ''
  }

  return {
    notifications, unread, loading, reading, error, hasMore, toast,
    dismissToast: () => { toast.value = null },
    refresh: () => fetchPages(), loadMore: () => fetchPages(true), refreshCount, markRead, clear,
  }
})
