import { defineStore } from 'pinia'
import teamApi from '@/api/teamApi'
import projectsApi from '@/api/projectsApi'
import { useAuthStore } from './authStore'
import { ref } from 'vue'
import categoryApi from '@/api/categoryApi'
import imageApi from '@/api/imageApi'

export const useTeamStore = defineStore('team', () => {
  const authStore = useAuthStore()

  const teams = ref([])
  const loading = ref(false)
  const totalTeams = ref(0)

  const currentPage = ref(1)
  const totalPages = ref(1)
  const total = ref(0)

  const actualTeam = ref([])

  function getPageSize() {
    if (typeof window !== 'undefined' && window.innerWidth > 950) {
      return 6
    }
    return undefined
  }

  async function getTeams(page = 1) {
    try {
      loading.value = true
      const pageSize = getPageSize()
      const response = await teamApi.getAll(page, pageSize)

      totalTeams.value = response.data.total
      teams.value = response.data.items
      currentPage.value = response.data.pagina_atual
      totalPages.value = response.data.paginas
      total.value = response.data.total
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  async function createCategory(categoryName) {
  try {
    const formattedName = categoryName.trim().toUpperCase()
    const response = await categoryApi.create(formattedName)
    return response.data
  } catch (error) {
    console.error('Erro ao criar categoria:', error)
    throw error
  }
}

  async function getOrCreateCategory(categoryName) {
    const formattedName = categoryName.trim().toUpperCase()

    // 1. Busca categorias existentes
    const response = await categoryApi.getAll()
    const categories = response.data.results || response.data

    // 2. Procura categoria com o mesmo nome (case-insensitive)
    const existingCategory = categories.find((cat) => cat.nome.toUpperCase() === formattedName)

    if (existingCategory) {
      return existingCategory.id
    }

    // 3. Se não existir, cria a nova categoria em caixa alta
    const newCategoryResponse = await categoryApi.create(formattedName)
    return newCategoryResponse.data.id
  }

  // Nova action para criar a equipe
async function createTeam(teamData, imageFile) {
  try {
    let uploadedImageId = null

    if (imageFile) {
      const formData = new FormData()
      formData.append('file', imageFile)

      const imageResponse = await imageApi.uploadImage(formData)
      
      // Captura o attachment_key diretamente como string
      uploadedImageId = imageResponse.data.attachment_key
    }

    const payload = {
      ...teamData,
      image_perfil: uploadedImageId // Envia apenas a string "29504e87-7c7a-47cf-8029-4a1e20891935"
    }

    const response = await teamApi.create(payload)
    return response.data
  } catch (error) {
    console.error('Erro ao criar equipe na store:', error)
    throw error
  }
}

  async function getTeamById(id) {
    actualTeam.value = []
    const response = await teamApi.getOne(id)
    actualTeam.value = response.data
  }

  async function getTeamByUserId(id) {
    const response = await teamApi.getTeamByUserId(id)
    return response.data
  }

  async function getProjects(page = 1) {
    try {
      loading.value = true
      const pageSize = getPageSize()
      const response = await teamApi.getAll(page, pageSize)

      teams.value = response.data.items

      for (const team of teams.value) {
        const projects = await projectsApi.getByTeam(team.id)
        team.totalProjetos = projects.data.results.length
      }

      currentPage.value = response.data.pagina_atual
      totalPages.value = response.data.paginas
      total.value = response.data.total
    } finally {
      loading.value = false
    }
  }

  return {
    teams,
    loading,
    currentPage,
    totalPages,
    totalTeams,
    total,
    actualTeam,
    getTeams,
    createTeam,
    getTeamById,
    getTeamByUserId,
    getProjects,
    createCategory,
  }
})
