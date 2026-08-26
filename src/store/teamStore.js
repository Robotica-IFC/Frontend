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

    const response = await categoryApi.getAll()
    const categories = response.data.results || response.data

    const existingCategory = categories.find((cat) => cat.nome.toUpperCase() === formattedName)

    if (existingCategory) {
      return existingCategory.id
    }

    const newCategoryResponse = await categoryApi.create(formattedName)
    return newCategoryResponse.data.id
  }

  // Função dedicada para realizar o upload e retornar o attachment_key
  async function uploadTeamImage(imageFile) {
    if (!imageFile) return null

    try {
      const formData = new FormData()
      formData.append('file', imageFile)

      const response = await imageApi.uploadImage(formData)
      // Ajuste para garantir que captura a chave, cobrindo variações de resposta do backend
      console.log(response.data.attachment_key)
      return response.data?.attachment_key
    } catch (error) {
      console.error('Erro ao realizar upload da imagem:', error)
      throw error
    }
  }

  // Action de criação atualizada chamando a função de upload
  async function createTeam(teamData, imageFile) {
    try {
      // Chama a função auxiliar para obter a chave do anexo
      const attachmentKey = await uploadTeamImage(imageFile)
      console.log(attachmentKey)

      const payload = {
        ...teamData,
        image_perfil: attachmentKey // Atribui o resultado retornado
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
    uploadTeamImage,
    getTeamById,
    getTeamByUserId,
    getProjects,
    createCategory,
  }
})