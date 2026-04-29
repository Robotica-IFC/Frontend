  import { defineStore } from 'pinia'
  import teacherApi from '@/api/teacherApi'
  import { computed, reactive } from 'vue'
  import router from '@/router'
  import imageApi from '@/api/imageApi'
  import { useAuthStore } from './authStore'

  export const useTeacherStore = defineStore('teacher', () => {
    const state = reactive({
      teacher: {
        id: null,
        name: '',
        username: '',
        instituicao: '',
        email: '',
        cpf: '',
        password: '',
        telefone: '',
        data_nascimento: '',
        ativo: true,
        email_verificado: true,
        imagem_perfil: '',
      },
      teachers: [],
      meUser: null,
    })

    const teacher = computed(() => state.teacher)
    const teachers = computed(() => state.teachers)
    const authStore = useAuthStore()

    async function getTeachers() {
      try {
        const response = await teacherApi.getAll()
        state.teachers = response.data.results ?? response.data
      } catch (error) {
        console.error(error)
      }
    }

    async function createTeacher() {
      try {
        const response = await teacherApi.create({
          // ... seus campos enviados continuam iguais
          name: state.teacher.name,
          username: state.teacher.username,
          instituicao: state.teacher.instituicao,
          email: state.teacher.email,
          cpf: state.teacher.cpf,
          password: state.teacher.password,
          telefone: state.teacher.telefone,
          data_nascimento: state.teacher.data_nascimento,
          ativo: state.teacher.ativo,
          email_verificado: state.teacher.email_verificado,
          imagem_perfil: state.teacher.imagem_perfil,
        })

        const credentials = reactive({
          email: state.teacher.email,
          password: state.teacher.password,
        })

        authStore.login(credentials)


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

      if (state.teacher.cpf && !apenasNumeros.test(state.teacher.cpf)) {
        alert('O CPF deve conter apenas números!')
        return
      }

      if (state.teacher.telefone && !apenasNumeros.test(state.teacher.telefone)) {
        alert('O telefone deve conter apenas números!')
        return
      }

      try {
        if (file) {
          const image = await uploadImage(file)
          state.teacher.imagem_perfil = image.attachment_key
        }

        await createTeacher()

        // Limpa o estado
        Object.assign(state.teacher, {
          id: null,
          name: '',
          username: '',
          instituicao: '',
          email: '',
          cpf: '',
          password: '',
          telefone: '',
          data_nascimento: '',
          imagem_perfil: 'e52625ec-f04a-490b-a52b-5d6db97ec88f',
        })
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
      teacher,
      teachers,
      getTeachers,
      createTeacher,
      uploadImage,
      submit,
    }
  })
