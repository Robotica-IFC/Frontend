import { defineStore } from 'pinia'
import api from '@/plugins/axios'
import { computed, reactive } from 'vue'

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
      imagem_perfil: null,
      imagem_preview: null,
    },
    students: [],
  })
  const student = computed(() => state.student) // O que sera usado nos components
  const students = computed(() => state.students)

  // Funções de get
  async function getStudents() {
    const response = await api.get('alunos')

    students.value = response.data.results
  }

  // Funções de POST
  async function createStudent() {
    try {
      const response = await api.post('alunos', {
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
    } catch {
      if (Error) {
        console.error(Error)
      }
    }
  }

  // CRUD de imagem de perfil

  async function uploadImage(file) {
    const formData = new FormData()
    formData.append('file', file)

    const response = await api.post('images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    // salva no state
    state.student.imagem_perfil = response.data.attachment_key
    state.student.imagem_preview = response.data.url
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
  }
})
