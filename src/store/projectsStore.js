import { defineStore } from 'pinia'
import { ref } from 'vue'
import projectApi from '@/api/projectsApi'

export const useProjectStore = defineStore('project', () => {
  const projects = ref([])
  const loading = ref(false)

  const currentPage = ref(1)
  const totalPages = ref(1)
  const totalProjects = ref(0)
  const total = ref(0)

  async function getProjects(page = 1) {
    try {
      loading.value = true

      const response = await projectApi.getAll(page)

      projects.value = response.data.results

      currentPage.value = response.data.page
      totalPages.value = response.data.total_pages
      totalProjects.value = response.data.results.length
      total.value = response.data.results.length
    } catch (error) {
      console.error('Erro ao buscar projetos:', error)
    } finally {
      loading.value = false
    }
  }

  const teamProjects = ref([])

  async function getProjectsByTeam(id) {
    loading.value = true

    try {
      const response = await projectApi.getByTeam(id)
      teamProjects.value = response.data.results
    } finally {
      loading.value = false
    }
  }

  return {
    projects,
    loading,
    currentPage,
    totalPages,
    totalProjects,
    total,
    getProjects,
    teamProjects,
    getProjectsByTeam,
  }
})
