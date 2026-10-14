import { computed, onMounted, ref, watch } from 'vue'
import { useInstituteStore } from '@/store/instituteStore'
import { useTeacherStore } from '@/store/teacherStore'
import { useTemplateStore } from '@/store/template'

export function useYourDataTeacher() {
  const templateStore = useTemplateStore()
  const teacherStore = useTeacherStore()
  const instituteStore = useInstituteStore()

  const password = ref(false)
  const password2 = ref(false)
  const newInstitute = ref(false)
  const mostrarDropdown = ref(false)
  const buscaInstituicao = ref('')
  const passwordValue = ref('')
  const passwordValue2 = ref('')
  const previewImage = ref('/img/default2.jpg')
  const file = ref(null)
  const showImageSheet = ref(false)

  onMounted(async () => {
    await instituteStore.getInstitutes()
  })

  const institutosFiltrados = computed(() => {
    if (!buscaInstituicao.value || instituicaoExata.value) return []
    return instituteStore.institutes.filter((inst) =>
      inst.nome.toLowerCase().includes(buscaInstituicao.value.toLowerCase()),
    )
  })

  const instituicaoExata = computed(() =>
    instituteStore.institutes.find(
      (inst) => inst.nome.toLowerCase() === buscaInstituicao.value.toLowerCase(),
    ),
  )

  const mostrarBotaoNovo = computed(
    () =>
      buscaInstituicao.value.length > 2 &&
      !instituicaoExata.value &&
      institutosFiltrados.value.length === 0 &&
      !newInstitute.value,
  )

  watch(instituicaoExata, (val) => {
    teacherStore.teacher.instituicao = val ? val.id : ''
  })

  function handleSearchInput() {
    mostrarDropdown.value = true
    newInstitute.value = false
  }

  function selecionarInstituicao(inst) {
    buscaInstituicao.value = inst.nome
    teacherStore.teacher.instituicao = inst.id
    mostrarDropdown.value = false
  }

  function handleFileSelected(selectedFile) {
    file.value = selectedFile
    previewImage.value = URL.createObjectURL(selectedFile)
  }

  async function handleCreateInstitute() {
    try {
      const novoInst = await instituteStore.createInstitute(file.value)
      teacherStore.teacher.instituicao = novoInst.id
      buscaInstituicao.value = novoInst.nome
      newInstitute.value = false
    } catch (error) {
      console.error(error)
    }
  }

  function prepararNovoCadastro() {
    instituteStore.state.institute.nome = buscaInstituicao.value
    newInstitute.value = true
    mostrarDropdown.value = false
  }

  function validacao() {
    if (passwordValue.value !== passwordValue2.value) {
      alert('As senhas não coincidem')
      return
    }
    if (!teacherStore.teacher.instituicao) {
      alert('Selecione ou cadastre um instituto primeiro')
      return
    }
    teacherStore.teacher.password = passwordValue.value
    templateStore.teacherOrStudent = true
    templateStore.sign = 6
  }

  return {
    templateStore,
    teacherStore,
    instituteStore,
    password,
    password2,
    newInstitute,
    mostrarDropdown,
    buscaInstituicao,
    passwordValue,
    passwordValue2,
    previewImage,
    file,
    showImageSheet,
    institutosFiltrados,
    instituicaoExata,
    mostrarBotaoNovo,
    handleSearchInput,
    selecionarInstituicao,
    handleFileSelected,
    handleCreateInstitute,
    prepararNovoCadastro,
    validacao,
  }
}
