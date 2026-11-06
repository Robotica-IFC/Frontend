import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import invitesApi from '../api/invitesApi.js'
import { formatApiError } from '../utils/formValidation.js'

export const useInvitesStore = defineStore('invites', () => {
  const invites = ref([])
  const loading = ref(false)
  const error = ref('')
  const responding = ref([])
  const answered = new Set()
  let inFlight = null
  let generation = 0
  const unread = computed(() => invites.value.filter(item => item.status === 'P').length)

  async function refresh() {
    if (inFlight) return inFlight
    const currentGeneration = generation
    loading.value = true
    error.value = ''
    const request = invitesApi.received().then(({ data }) => {
      if (currentGeneration !== generation) return
      const items = Array.isArray(data) ? data : (data?.results || data?.items || [])
      invites.value = items.filter(item => item.status === 'P' && !answered.has(String(item.id)))
    }).catch(err => {
      if (currentGeneration === generation) error.value = formatApiError(err, 'Não foi possível carregar seus convites. Tente atualizar novamente.')
      throw err
    }).finally(() => {
      if (currentGeneration === generation) loading.value = false
      if (inFlight === request) inFlight = null
    })
    inFlight = request
    return request
  }

  async function respond(id, accept) {
    if (responding.value.includes(id)) return false
    const currentGeneration = generation
    responding.value = [...responding.value, id]
    error.value = ''
    try {
      if (accept) await invitesApi.accept(id)
      else await invitesApi.decline(id)
      if (currentGeneration !== generation) return false
      answered.add(String(id))
      invites.value = invites.value.filter(invite => String(invite.id) !== String(id))
      return true
    } catch (err) {
      if (currentGeneration === generation) error.value = formatApiError(err, 'Não foi possível responder ao convite. Tente novamente.')
      throw err
    } finally {
      if (currentGeneration === generation) responding.value = responding.value.filter(value => value !== id)
    }
  }

  async function send(teamId, type, id) {
    const { data } = await invitesApi.create({ equipe: teamId, [type]: id })
    return data
  }

  function clear() {
    generation++
    inFlight = null
    answered.clear()
    invites.value = []
    error.value = ''
    loading.value = false
    responding.value = []
  }

  return { invites, unread, loading, error, responding, refresh, respond, send, clear }
})
