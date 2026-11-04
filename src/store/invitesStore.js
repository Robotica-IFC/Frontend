import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import invitesApi from '@/api/invitesApi'

export const useInvitesStore = defineStore('invites', () => {
  const invites = ref([])
  const loading = ref(false)
  const error = ref('')
  const unread = computed(() => invites.value.filter(item => item.status === 'P').length)

  async function refresh() {
    loading.value = true
    error.value = ''
    try {
      const { data } = await invitesApi.received()
      invites.value = Array.isArray(data) ? data : (data?.results || data?.items || [])
    } catch (err) {
      error.value = 'Não foi possível carregar seus convites.'
      throw err
    } finally { loading.value = false }
  }

  async function respond(id, accept) {
    if (accept) await invitesApi.accept(id)
    else await invitesApi.decline(id)
    await refresh()
  }

  async function send(teamId, type, id) {
    const { data } = await invitesApi.create({ equipe: teamId, [type]: id })
    return data
  }

  function clear() {
    invites.value = []
    error.value = ''
  }

  return { invites, unread, loading, error, refresh, respond, send, clear }
})
