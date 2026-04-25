import { defineStore } from 'pinia'
import studentsApi from '@/api/studentApi'
import { computed, reactive } from 'vue'
import router from '@/router'
import imageApi from '@/api/imageApi'

export const useStudentStore = defineStore('student', () => {
  const state = reactive({
    student: {
      id: null,
      name: '', 
      username: '',
      email: '',
      password: '',
      cpf: '',
      telefone: '',
      data_nascimento: '',
      descricao: '',
      ativo: true,
      email_verificado: false,
      imagem_perfil: 'e52625ec-f04a-490b-a52b-5d6db97ec88f', 
    },
    students: [],
    meUser: null,
  })

  const student = computed(() => state.student)
  const students = computed(() => state.students)

  async function getStudents() {
    try {
      const response = await studentsApi.getAll()
      state.students = response.data.results ?? response.data
    } catch (error) {
      console.error(error)
    }
  }

  async function createStudent() {
    try {
      const response = await studentsApi.create({
        name: state.student.name, 
        username: state.student.username, 
        email: state.student.email, 
        password: state.student.password, 
        cpf: state.student.cpf,
        telefone: state.student.telefone,
        data_nascimento: state.student.data_nascimento,
        descricao: state.student.descricao,
        imagem_perfil: state.student.imagem_perfil,
      })

      state.meUser = {
        id: response.data.user.id,
        name: response.data.user.name,
        username: response.data.user.username,
        email: response.data.user.email,
        tipo: 'aluno'
      }

      alert('Conta criada com sucesso!')
    } catch (error) {
      const errorMsg = error.response?.data 
      console.error('Erro detalhado:', errorMsg)
      throw error
    }
  }

  async function uploadImage(file) {
    const formData = new FormData()
    formData.append('file', file)
    const response = await imageApi.uploadImage(formData)
    return response.data
  }

  async function submit(file) {
    const apenasNumeros = /^\d+$/

    if (state.student.cpf && !apenasNumeros.test(state.student.cpf)) {
      alert('O CPF deve conter apenas números!')
      return
    }

    if (state.student.telefone && !apenasNumeros.test(state.student.telefone)) {
      alert('O telefone deve conter apenas números!')
      return
    }

    try {
      if (file) {
        const image = await uploadImage(file)
        state.student.imagem_perfil = image.attachment_key
      }

      await createStudent()
      router.push('/login')
    } catch (error) {
      console.error('Falha no processo de criação:', error)
      const backendError = error.response?.data
      let mensagem = 'Falha ao criar conta.'
      
      if (backendError) {
        mensagem += ' Verifique os dados: ' + Object.values(backendError).flat().join(', ')
      }
      
      alert(mensagem)
    }
  }

  return {
    state,
    student,
    students,
    getStudents,
    createStudent,
    uploadImage,
    submit,
  }
})