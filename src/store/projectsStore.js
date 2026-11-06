import { defineStore } from 'pinia'
import { ref } from 'vue'
import projectApi from '@/api/projectsApi'
import imageApi from '@/api/imageApi'
import { useFormLimits } from '@/composables/useFormLimits'

export const useProjectStore = defineStore('project', () => {
  const limits = useFormLimits()
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

  async function getProjectById(id) {
    try {
      const response = await projectApi.getById(id)
      return response.data
    } catch (er) {
      console.error(`Erro ao buscar projeto: ${er}`)
    }
  }

  // Criação do projeto
  async function uploadProjectImage(imageFile) {
    if (!imageFile) return null
    try {
      const formData = new FormData()
      formData.append('file', imageFile)
      const response = await imageApi.uploadImage(formData)
      return response.data?.attachment_key
    } catch (error) {
      console.error('Erro ao realizar upload da imagem:', error)
      throw error
    }
  }

  async function createProject(projectData, image) {
    try {
      await limits.assertValid('projeto', projectData)
      let attachmentKey = null
      if (image) {
        attachmentKey = await uploadProjectImage(image)
      }

      const payload = {
        ...projectData,
        image_perfil: attachmentKey,
      }

      const response = await projectApi.create(payload)
      return response.data
    } catch (error) {
      console.error('Erro ao criar projeto:', error)
      throw error
    }
  }

  async function updateProject(id, projectData, image = undefined) {
    await limits.assertValid('projeto', projectData)
    const payload = { ...projectData }
    if (image !== undefined) payload.image_perfil = image ? await uploadProjectImage(image) : null
    const { data } = await projectApi.update(id, payload)
    return data
  }

  async function deleteProject(id) {
    await projectApi.delete(id)
    projects.value = projects.value.filter(project => String(project.id) !== String(id))
    teamProjects.value = teamProjects.value.filter(project => String(project.id) !== String(id))
  }

  return {
    deleteProject,
    updateProject,
    projects,
    loading,
    currentPage,
    totalPages,
    totalProjects,
    total,
    getProjects,
    teamProjects,
    getProjectsByTeam,
    getProjectById,
    createProject,
  }
})
