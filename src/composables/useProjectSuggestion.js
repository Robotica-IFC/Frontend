import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import teamApi from '@/api/teamApi'
import { useAuthStore } from '@/store/authStore'
import { useProjectSuggestionsStore } from '@/store/projectSuggestionsStore'

export function useProjectSuggestion() {
  const authStore = useAuthStore()
  const suggestionsStore = useProjectSuggestionsStore()
  const form = reactive({ titulo: '', descricao: '', anonimo: true })
  const selectedTeam = ref(null)
  const teams = ref([])
  const loadingTeams = ref(false)
  const teamError = ref('')
  const attachments = ref([])
  const fileInput = ref(null)
  const submitting = ref(false)
  const errors = ref({})
  const successMessage = ref('')
  let teamController

  async function loadTeams() {
    teamController?.abort()
    const controller = new AbortController()
    teamController = controller
    loadingTeams.value = true
    teamError.value = ''
    try {
      const allTeams = []
      let page = 1
      let totalPages = 1
      do {
        const { data } = await teamApi.getOptions('', page, controller.signal)
        if (controller.signal.aborted) return
        allTeams.push(...data.items)
        totalPages = data.paginas
        page += 1
      } while (page <= totalPages)
      teams.value = allTeams
    } catch {
      if (!controller.signal.aborted) {
        teamError.value = 'Não foi possível carregar as equipes. Tente novamente.'
      }
    } finally {
      if (!controller.signal.aborted) loadingTeams.value = false
    }
  }

  function selectTeam(team) {
    selectedTeam.value = team
    delete errors.value.equipe
  }

  function selectAttachments(event) {
    delete errors.value.anexos
    for (const file of event.target.files) {
      if (!/\.pdf$/i.test(file.name) || (file.type && file.type !== 'application/pdf')) {
        errors.value.anexos = 'Selecione apenas arquivos PDF.'
        continue
      }
      if (
        !attachments.value.some(
          ({ file: other }) =>
            other.name === file.name &&
            other.size === file.size &&
            other.lastModified === file.lastModified,
        )
      ) {
        attachments.value.push({ file, attachmentKey: null })
      }
    }
    event.target.value = ''
  }

  function clearForm() {
    Object.assign(form, { titulo: '', descricao: '', anonimo: true })
    selectedTeam.value = null
    attachments.value = []
    errors.value = {}
    successMessage.value = ''
    if (fileInput.value) fileInput.value.value = ''
  }

  async function submitSuggestion() {
    if (submitting.value) return
    errors.value = {}
    successMessage.value = ''
    if (!authStore.isAuthenticated) {
      errors.value.general = 'Entre na sua conta para enviar uma sugestão.'
      return
    }
    if (!form.titulo.trim()) errors.value.titulo = 'Informe o título do projeto.'
    else if (form.titulo.length > 30) errors.value.titulo = 'Use no máximo 30 caracteres no título.'
    if (!selectedTeam.value) errors.value.equipe = 'Selecione uma equipe cadastrada.'
    if (!form.descricao.trim()) errors.value.descricao = 'Descreva sua sugestão de projeto.'
    else if (form.descricao.length > 1000)
      errors.value.descricao = 'Use no máximo 1.000 caracteres na descrição.'
    if (Object.keys(errors.value).length) return

    submitting.value = true
    try {
      await suggestionsStore.createSuggestion(
        {
          titulo: form.titulo.trim(),
          descricao: form.descricao.trim(),
          equipe: selectedTeam.value.id,
          anonimo: form.anonimo,
        },
        attachments.value,
      )
      clearForm()
      successMessage.value = 'Sugestão enviada com sucesso! Obrigado por compartilhar sua ideia.'
    } catch (error) {
      const data = error.response?.data
      for (const field of ['titulo', 'equipe', 'descricao', 'anonimo', 'anexos']) {
        if (data?.[field]) {
          errors.value[field] = Array.isArray(data[field])
            ? data[field].join(' ')
            : String(data[field])
        }
      }
      if (data?.file)
        errors.value.anexos = Array.isArray(data.file) ? data.file.join(' ') : String(data.file)
      errors.value.general =
        data?.detail ||
        data?.non_field_errors?.join(' ') ||
        (error.response
          ? 'Não foi possível enviar a sugestão. Confira os campos e tente novamente.'
          : 'Não foi possível enviar a sugestão. Verifique sua conexão e tente novamente.')
    } finally {
      submitting.value = false
    }
  }

  onMounted(() => loadTeams())
  onBeforeUnmount(() => {
    teamController?.abort()
  })

  return {
    form,
    selectedTeam,
    teams,
    loadingTeams,
    teamError,
    attachments,
    fileInput,
    submitting,
    errors,
    successMessage,
    loadTeams,
    selectTeam,
    selectAttachments,
    clearForm,
    submitSuggestion,
  }
}
