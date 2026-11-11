import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import postsApi from '../api/postsApi.js'
import projectsApi from '../api/projectsApi.js'

export const useHomeHighlightsStore = defineStore('homeHighlights', () => {
  const posts = ref([])
  const projects = ref([])
  const loading = reactive({ posts: false, projects: false })
  const errors = reactive({ posts: '', projects: '' })
  let controller
  let inFlight

  async function loadSection(section, target, api, signal) {
    loading[section] = true
    errors[section] = ''
    try {
      const { data } = await api.getHighlights(signal)
      if (!signal.aborted) target.value = data
    } catch {
      if (!signal.aborted) {
        errors[section] = 'Não foi possível atualizar os destaques. Tente novamente.'
      }
    } finally {
      if (!signal.aborted) loading[section] = false
    }
  }

  function refresh(force = false) {
    if (inFlight && !force) return inFlight
    controller?.abort()
    const requestController = new AbortController()
    controller = requestController
    const request = Promise.all([
      loadSection('posts', posts, postsApi, requestController.signal),
      loadSection('projects', projects, projectsApi, requestController.signal),
    ]).finally(() => {
      if (inFlight === request) inFlight = null
    })
    inFlight = request
    return request
  }

  function clear() {
    controller?.abort()
    inFlight = null
    posts.value = []
    projects.value = []
    loading.posts = loading.projects = false
    errors.posts = errors.projects = ''
  }

  return { posts, projects, loading, errors, refresh, clear }
})
