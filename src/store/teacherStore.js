import { defineStore } from 'pinia'
import teacherApi from '@/api/teacherApi'
import { computed, reactive } from 'vue'
import router from '@/router'
import imageApi from '@/api/imageApi'
import { useAuthStore } from './authStore'
import { useTeamStore } from './teamStore'

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
    actualTeacher: null,
  })

  const teacher = computed(() => state.teacher)
  const teachers = computed(() => state.teachers)
  const actualTeacher = computed(() => state.actualTeacher)
  const authStore = useAuthStore()
  const teamStore = useTeamStore()

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
      const intuicaoId =
        typeof state.teacher.instituicao === 'object'
          ? state.teacher.instituicao?.id
          : state.teacher.instituicao

      const imagemId =
        typeof state.teacher.imagem_perfil === 'object'
          ? state.teacher.imagem_perfil?.attachment_key
          : state.teacher.imagem_perfil

      // MONTAGEM DO PAYLOAD
      const payload = {
        // Campos que o serializer intercepta para criar o User interno
        name: state.teacher.name,
        username: state.teacher.username,
        email: state.teacher.email,
        password: state.teacher.password,

        // Campos do modelo Professor
        cpf: state.teacher.cpf,
        telefone: state.teacher.telefone,
        data_nascimento: state.teacher.data_nascimento,
        instituicao: intuicaoId,
        imagem_perfil: imagemId || null,
        ativo: state.teacher.ativo,
        email_verificado: state.teacher.email_verificado,

        // GAMBIARRA NECESSÁRIA: Enviamos vazio/nulo para passar pelo validador do Django.
        // O método 'create' do backend vai ignorar esse valor e vincular o user correto.
        user: '',
      }

      const response = await teacherApi.create(payload)

      const credentials = reactive({
        email: state.teacher.email,
        password: state.teacher.password,
      })

      await authStore.login(credentials)
    } catch (error) {
      console.error('Erro detalhado vindo do servidor:', error.response?.data)
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
      }else {
        state.teacher.imagem_perfil = '8d7c4190-fb43-46e1-a094-6e400c9365b2'
      }

      await createTeacher()

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
        ativo: true,
        email_verificado: true,
        imagem_perfil: '',
      })
    } catch (error) {
      console.error('Falha no processo de criação:', error)
      const backendError = error.response?.data
      let mensagem = 'Falha ao criar conta.'

      if (backendError) {
        mensagem +=
          ' Verifique os dados: ' +
          Object.values(backendError)
            .flat()
            .map((err) => {
              return typeof err === 'object' ? Object.values(err).flat().join(', ') : err
            })
            .join(', ')
      }
      alert(mensagem)
    }
  }

  async function updateTeacher(id, data) {
    try {
      // Cria uma cópia dos dados para não modificar diretamente o formulário na tela
      const payload = { ...data }

      // Se a instituição veio como um objeto, extrai apenas o ID (UUID) string
      if (payload.instituicao && typeof payload.instituicao === 'object') {
        payload.instituicao = payload.instituicao.id
      }

      // Se a imagem de perfil veio como objeto, extrai apenas a chave string
      if (payload.imagem_perfil && typeof payload.imagem_perfil === 'object') {
        payload.imagem_perfil = payload.imagem_perfil.attachment_key || payload.imagem_perfil.id
      }

      // Agora envia o payload limpo com o UUID correto
      const response = await teacherApi.update(id, payload)
      return response.data
    } catch (error) {
      console.error('Erro na store de professores ao atualizar:', error)
      throw error
    }
  }

    async function getTeacherById(id) {
    try {
      state.actualStudent = []
      const response = await teacherApi.getById(id)

      const teacherData = response.data

      const userId = teacherData.user?.id;

      if(userId){
        const teamUser = await teamStore.getTeamByUserId(userId)

        teacherData.teams = teamUser
      }

      state.actualTeacher = teacherData
    } catch (error) {
      console.error('Erro ao buscar professor:', error)
    }
  }

  return {
    state,
    teacher,
    teachers,
    actualTeacher,
    getTeachers,
    createTeacher,
    uploadImage,
    submit,
    updateTeacher,
    getTeacherById,
  }
})
