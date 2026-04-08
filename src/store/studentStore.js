import { defineStore } from 'pinia'
import studentsApi from '@/api/studentApi'
import { computed, reactive } from 'vue'
import router from '@/router'

export const useStudentStore = defineStore('student', () => {
  const state = reactive({
    //Estado global que não pode ser alterado diretamente
    student: {
      id: null,
      nome: '',
      email: '',
      cpf: '',
      senha: '',
      telefone: '',
      data_nascimento: '',
      ativo: true,
      email_verificado: true,
      imagem_perfil: 'b5cac9ca-5f98-422c-9a41-1696ca1a6a5d', //Esse e o attachment key da imagem padrão da minha api alterar quando mudar de maquina, ASS: Luca
    },
    students: [],
  })

  const student = computed(() => state.student) // O que sera usado nos components
  const students = computed(() => state.students)

  // Funções de get
  async function getStudents() {
    try {
      const response = await studentsApi.getAll()

      state.students.value = response.data.results ?? response.data
    } catch (error) {
      console.error(error)
    }
  }

  // Funções de POST
  async function createStudent() {
    try {
      const response = await studentsApi.create({
        nome: state.student.nome,
        email: state.student.email,
        cpf: state.student.cpf,
        senha: state.student.senha,
        telefone: state.student.telefone,
        data_nascimento: state.student.data_nascimento,
        ativo: state.student.ativo,
        email_verificado: state.student.email_verificado,
        imagem_perfil: state.student.imagem_perfil,
      })

      alert('Conta criada com sucesso')
    } catch(error) {
      console.error(error.response?.data || error)
    }
  }

  // CRUD de imagem de perfil

  async function uploadImage(file) {
    const formData = new FormData()
    formData.append("file", file)

    const response = await studentsApi.uploadImage(formData)

    return response.data
  }

  //Função para criar usuario

  async function submit(file) {
    try {
      if (file) {
        const image = await uploadImage(file)
        state.student.imagem_perfil = image.attachment_key
      }

      await createStudent()
      router.push('/test')
    } catch (error) {
      console.error(error)
    }
  }

  return {
    // STATE evitar o maximo usar
    state,

    // Usar para listar
    student,
    students,

    // Funções de get
    getStudents,

    // Funções de post
    createStudent,

    // Funções de imagem
    uploadImage,

    // Criação geral do user
    submit,
  }
})