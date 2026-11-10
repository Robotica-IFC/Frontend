import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/store/authStore'
import { useInstituteStore } from '@/store/instituteStore'
import { useStudentStore } from '@/store/studentStore'
import { useTeacherStore } from '@/store/teacherStore'
import { useTemplateStore } from '@/store/template'
import { getProfileImageUrl } from '@/utils/profileImage'

export function useEditProfile() {
  const authStore = useAuthStore()
  const studentStore = useStudentStore()
  const teacherStore = useTeacherStore()
  const instituteStore = useInstituteStore()
  const { user } = storeToRefs(authStore)

  const loading = ref(false)
  const imageFile = ref(null)
  const fileInstitute = ref(null)
  const newInstitute = ref(false)
  const mostrarDropdown = ref(false)
  const buscaInstituicao = ref('')
  const previewImageInstitute = ref('/img/default2.jpg')
  const showProfileSheet = ref(false)
  const showInstituteSheet = ref(false)
  const formData = ref({
    name: user.value?.name || '',
    username: user.value?.username || '',
    descricao: user.value?.descricao || '',
    telefone: user.value?.telefone || '',
    instituicao: user.value?.instituicao || '',
  })
  const imagePreview = ref(getProfileImageUrl(user.value?.imagem_perfil))

  watch(
    () => user.value?.imagem_perfil,
    (image) => {
      if (!imageFile.value) imagePreview.value = getProfileImageUrl(image)
    },
  )

  const closeEdit = () => {
    useTemplateStore().panel = true
  }

  const handleKeydown = (event) => {
    if (event.key === 'Escape') closeEdit()
  }

  onMounted(async () => {
    window.addEventListener('keydown', handleKeydown)
    await Promise.allSettled([instituteStore.getInstitutes(), authStore.refreshUserProfile()])

    if (user.value?.tipo === 'professor' && user.value?.instituicao) {
      buscaInstituicao.value =
        typeof user.value.instituicao === 'object'
          ? user.value.instituicao.nome
          : user.value.instituicao
    }
  })

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeydown)
    if (imagePreview.value.startsWith('blob:')) URL.revokeObjectURL(imagePreview.value)
  })

  const instituicaoExata = computed(() =>
    instituteStore.institutes.find(
      (inst) => inst.nome.toLowerCase() === buscaInstituicao.value.toLowerCase(),
    ),
  )

  const institutosFiltrados = computed(() => {
    if (!buscaInstituicao.value || instituicaoExata.value) return []
    return instituteStore.institutes.filter((inst) =>
      inst.nome.toLowerCase().includes(buscaInstituicao.value.toLowerCase()),
    )
  })

  const mostrarBotaoNovo = computed(
    () =>
      buscaInstituicao.value.length > 2 &&
      !instituicaoExata.value &&
      institutosFiltrados.value.length === 0 &&
      !newInstitute.value,
  )

  watch(instituicaoExata, (value) => {
    if (user.value?.tipo === 'professor') {
      formData.value.instituicao = value
        ? value.id
        : !newInstitute.value
          ? ''
          : formData.value.instituicao
    }
  })

  const handleSearchInput = () => {
    mostrarDropdown.value = true
    newInstitute.value = false
  }

  const selecionarInstituicao = (inst) => {
    buscaInstituicao.value = inst.nome
    formData.value.instituicao = inst.id
    mostrarDropdown.value = false
  }

  const handleFileInstituteSelected = (file) => {
    fileInstitute.value = file
    previewImageInstitute.value = URL.createObjectURL(file)
  }

  const prepararNovoCadastro = () => {
    instituteStore.state.institute.nome = buscaInstituicao.value
    newInstitute.value = true
    mostrarDropdown.value = false
  }

  const handleCreateInstitute = async () => {
    try {
      loading.value = true
      const novoInst = await instituteStore.createInstitute(fileInstitute.value)
      formData.value.instituicao = novoInst.id
      buscaInstituicao.value = novoInst.nome
      newInstitute.value = false
      alert('Nova instituição cadastrada e vinculada!')
    } catch (error) {
      console.error('Erro ao criar instituto:', error)
      alert('Falha ao cadastrar instituição.')
    } finally {
      loading.value = false
    }
  }

  const handleFileSelected = (file) => {
    imageFile.value = file
    if (imagePreview.value.startsWith('blob:')) URL.revokeObjectURL(imagePreview.value)
    imagePreview.value = URL.createObjectURL(file)
  }

  const handleSave = async () => {
    if (user.value?.tipo === 'professor' && !formData.value.instituicao) {
      alert('Por favor, selecione ou cadastre uma instituição primeiro!')
      return
    }

    loading.value = true
    const profileId = authStore.user?.id
    const userId = authStore.user?.user_id

    try {
      const profilePayload = {
        descricao: formData.value.descricao,
        telefone: formData.value.telefone,
        instituicao: formData.value.instituicao,
      }
      const userPayload = {
        name: formData.value.name,
        username: formData.value.username,
      }

      if (imageFile.value) {
        const uploadStore = authStore.user?.tipo === 'aluno' ? studentStore : teacherStore
        const imageResponse = await uploadStore.uploadImage(imageFile.value)
        const uploadedImageKey =
          imageResponse?.id || imageResponse?.attachment_key || imageResponse?.image
        if (!uploadedImageKey) throw new Error('Não foi possível enviar a foto de perfil.')
        profilePayload.imagem_perfil = uploadedImageKey
      }

      if (authStore.user?.tipo === 'aluno') {
        await studentStore.updateStudent(profileId, profilePayload)
      } else {
        await teacherStore.updateTeacher(profileId, profilePayload)
      }

      await authStore.updateUserAccount(userId, userPayload)

      await authStore.refreshUserProfile()
      if (imagePreview.value.startsWith('blob:')) URL.revokeObjectURL(imagePreview.value)
      imagePreview.value = getProfileImageUrl(authStore.user?.imagem_perfil)
      imageFile.value = null
      alert('Perfil e usuário atualizados com sucesso!')
      closeEdit()
    } catch (error) {
      const backendErrors = error.response?.data
      if (backendErrors && backendErrors.username) {
        alert('Este nome de usuário já está em uso. Escolha outro!')
      } else if (backendErrors && backendErrors.refresh) {
        alert('Sua sessão expirou. Por favor, faça login novamente.')
        authStore.logout()
      } else if (backendErrors) {
        alert(`Erro na validação:\n${Object.values(backendErrors).flat().join('\n')}`)
      } else {
        alert('Erro ao salvar as alterações. Verifique os dados.')
      }
    } finally {
      loading.value = false
    }
  }

  return {
    authStore,
    instituteStore,
    user,
    loading,
    formData,
    imagePreview,
    imageFile,
    newInstitute,
    mostrarDropdown,
    buscaInstituicao,
    fileInstitute,
    previewImageInstitute,
    showProfileSheet,
    showInstituteSheet,
    instituicaoExata,
    institutosFiltrados,
    mostrarBotaoNovo,
    closeEdit,
    handleSearchInput,
    selecionarInstituicao,
    handleFileInstituteSelected,
    prepararNovoCadastro,
    handleCreateInstitute,
    handleFileSelected,
    handleSave,
  }
}
