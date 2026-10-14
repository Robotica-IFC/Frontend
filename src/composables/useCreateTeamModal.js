import { computed, onMounted, reactive, ref } from 'vue'
import { useAuthStore } from '@/store/authStore'
import { useTeamStore } from '@/store/teamStore'

export function useCreateTeamModal(emit) {
  const authStore = useAuthStore()
  const teamStore = useTeamStore()

  const loading = ref(false)
  const errorMessage = ref('')
  const selectedFile = ref(null)
  const imagePreview = ref(null)
  const showImageSheet = ref(false)
  const existingCategories = ref([])
  const buscaCategoria = ref('')
  const mostrarDropdown = ref(false)
  const newCategory = ref(false)
  const selectedCategories = ref([])

  const form = reactive({
    nome: '',
    descricao: '',
    alunos: [],
  })

  onMounted(async () => {
    try {
      existingCategories.value = await teamStore.getCategories()
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
    }
  })

  const categoriasFiltradas = computed(() => {
    if (!buscaCategoria.value) return []
    return existingCategories.value.filter(
      (cat) =>
        cat.nome.toLowerCase().includes(buscaCategoria.value.toLowerCase()) &&
        !selectedCategories.value.some((selected) => selected.id === cat.id),
    )
  })

  const categoriaExata = computed(() =>
    existingCategories.value.find(
      (cat) => cat.nome.toLowerCase() === buscaCategoria.value.toLowerCase(),
    ),
  )

  const mostrarBotaoNovo = computed(
    () =>
      buscaCategoria.value.trim().length > 1 &&
      !categoriaExata.value &&
      categoriasFiltradas.value.length === 0 &&
      !newCategory.value,
  )

  function handleSearchInput() {
    mostrarDropdown.value = true
    newCategory.value = false
  }

  function adicionarCategoria(cat) {
    if (!selectedCategories.value.some((item) => item.id === cat.id)) {
      selectedCategories.value.push(cat)
    }
    buscaCategoria.value = ''
    mostrarDropdown.value = false
  }

  function removerCategoria(catId) {
    selectedCategories.value = selectedCategories.value.filter((cat) => cat.id !== catId)
  }

  function prepararNovoCadastro() {
    newCategory.value = true
    mostrarDropdown.value = false
  }

  async function handleCreateCategory() {
    if (!buscaCategoria.value.trim()) return

    try {
      loading.value = true
      const novaCat = await teamStore.createCategory(buscaCategoria.value)
      existingCategories.value.push(novaCat)
      adicionarCategoria(novaCat)
      buscaCategoria.value = ''
      newCategory.value = false
    } catch (error) {
      errorMessage.value = 'Erro ao criar categoria.'
    } finally {
      loading.value = false
    }
  }

  function handleFileSelected(file) {
    if (imagePreview.value) URL.revokeObjectURL(imagePreview.value)
    selectedFile.value = file
    imagePreview.value = URL.createObjectURL(file)
  }

  function removeImage() {
    if (imagePreview.value) URL.revokeObjectURL(imagePreview.value)
    selectedFile.value = null
    imagePreview.value = null
  }

  async function handleSubmit() {
    if (!form.nome.trim()) {
      errorMessage.value = 'O nome da equipe é obrigatório.'
      return
    }

    if (!selectedFile.value) {
      errorMessage.value = 'A imagem da equipe é obrigatória.'
      return
    }

    const professorId = authStore.user?.id

    try {
      loading.value = true
      errorMessage.value = ''

      await teamStore.createTeam(
        {
          nome: form.nome,
          descricao: form.descricao,
          categorias: selectedCategories.value.map((cat) => cat.id),
          professores: professorId ? [professorId] : [],
        },
        selectedFile.value,
      )

      emit('created')
      emit('close')
    } catch (error) {
      console.error('Erro ao criar equipe:', error)
      errorMessage.value = error.response?.data?.detail || 'Erro ao processar a requisição.'
    } finally {
      loading.value = false
    }
  }

  return {
    authStore,
    teamStore,
    loading,
    errorMessage,
    selectedFile,
    imagePreview,
    showImageSheet,
    existingCategories,
    buscaCategoria,
    mostrarDropdown,
    newCategory,
    selectedCategories,
    form,
    categoriasFiltradas,
    categoriaExata,
    mostrarBotaoNovo,
    handleSearchInput,
    adicionarCategoria,
    removerCategoria,
    prepararNovoCadastro,
    handleCreateCategory,
    handleFileSelected,
    removeImage,
    handleSubmit,
  }
}
