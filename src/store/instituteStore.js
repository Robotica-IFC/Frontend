import { defineStore } from 'pinia'
import imageApi from '@/api/imageApi'
import instituteApi from '@/api/instituteApi'
import { computed, reactive } from 'vue'

export const useInstituteStore = defineStore('institute', () => {
  const state = reactive({
    institute: {
      nome: '',
      sigla: '',
      cidade: '',
      estado: 'SC',
      logo: 'e52625ec-f04a-490b-a52b-5d6db97ec88f', // Mesma imagem padrão do Luca
    },
    institutes: [],
    estadosBrasil: [
      'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
      'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 
      'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
    ]
  })

  const institutes = computed(() => state.institutes)
  const institute = computed(() => state.institute)

  async function getInstitutes() {
    try {
      const response = await instituteApi.getAllInstitutes()
      state.institutes = response.data.results ?? response.data
    } catch (error) {
      console.error(error)
    }
  }

  // Função interna de upload
  async function uploadImage(file) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('description', `Logo de ${state.institute.nome}`)
    
    const response = await imageApi.uploadImage(formData)
    return response.data
  }

  // Função "Submit" do Instituto
  async function createInstitute(file) {
    try {
      // Se o usuário enviou uma imagem, faz o upload e troca a padrão
      if (file) {
        const image = await uploadImage(file)
        state.institute.logo = image.attachment_key
      }

      // Faz o POST no banco de dados
      const response = await instituteApi.createInstitute({
        nome: state.institute.nome,
        sigla: state.institute.sigla,
        cidade: state.institute.cidade,
        estado: state.institute.estado,
        logo: state.institute.logo,
      })

      alert('Instituto cadastrado com sucesso!')
      state.institutes.push(response.data)
      
      return response.data // Retorna para o componente pegar o ID

    } catch (error) {
      console.error('Falha na criação do instituto:', error)
      throw error
    }
  }

  return {
    state,
    institute,
    institutes,
    getInstitutes,
    createInstitute,
  }
})