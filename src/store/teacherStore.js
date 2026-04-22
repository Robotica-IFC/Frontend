import { defineStore } from 'pinia'
import teacherApi from '@/api/teacherApi'
import { computed, reactive } from 'vue'
import router from '@/router'
import imageApi from '@/api/imageApi'

export const useTeacherStore = defineStore('teacher', () => {
  const state = reactive({
    //Estado global que não pode ser alterado diretamente
    teacher: {
      id: null,
      nome: '',
      username: '',
      instituicao: '',
      email: '',
      cpf: '',
      senha: '',
      telefone: '',
      data_nascimento: '',
      ativo: true,
      email_verificado: true,
      imagem_perfil: 'e52625ec-f04a-490b-a52b-5d6db97ec88f', //Esse e o attachment key da imagem padrão da minha api alterar quando mudar de maquina, ASS: Luca
    },
    teachers: [],
  })

  const teacher = computed(() => state.teacher) // O que sera usado nos components
  const teachers = computed(() => state.teachers)

  // Funções de get
  async function getTeachers() {
    try {
      const response = await teacherApi.getAll()

      state.teachers = response.data.results ?? response.data
    } catch (error) {
      console.error(error)
    }
  }

  // Funções de POST
  async function createTeacher() {
    try {
      const response = await teacherApi.create({
        nome: state.teacher.nome,
        username: state.teacher.username,
        instituicao: state.teacher.instituicao,
        email: state.teacher.email,
        cpf: state.teacher.cpf,
        senha: state.teacher.senha,
        telefone: state.teacher.telefone,
        data_nascimento: state.teacher.data_nascimento,
        ativo: state.teacher.ativo,
        email_verificado: state.teacher.email_verificado,
        imagem_perfil: state.teacher.imagem_perfil,
      })

      alert('Conta criada com sucesso')
    } catch (error) {
      console.error(error.response?.data || error)
      throw error
    }
  }

  // CRUD de imagem de perfil

  async function uploadImage(file) {
    const formData = new FormData()
    formData.append('file', file)

    const response = await imageApi.uploadImage(formData)

    return response.data
  }

  //Função para criar usuario

  async function submit(file) {
    const apenasNumeros = /^\d+$/

    if (!apenasNumeros.test(state.teacher.cpf)) {
      alert('O CPF deve conter apenas números!')
      return
    }

    if (!apenasNumeros.test(state.teacher.telefone)) {
      alert('O telefone deve conter apenas números!')
      return
    }

    try {
      if (file) {
        const image = await uploadImage(file)
        state.teacher.imagem_perfil = image.attachment_key
      }

      await createTeacher()
      router.push('/test')
    } catch (error) {
      console.error('Falha no processo de criação:', error)
      alert('Falha ao criar conta: ' + (error.response?.data?.detail || error.message))
    }
  }

  return {
    // STATE evitar o maximo usar
    state,

    // Usar para listar
    teacher,
    teachers,

    // Funções de get
    getTeachers,

    // Funções de post
    createTeacher,

    // Funções de imagem
    uploadImage,

    // Criação geral do user
    submit,
  }
})