import { computed, reactive, ref } from 'vue'
import { useItemStore } from '@/store/itemStore'
import { ITEM_CATEGORIES } from '@/constants/itemCategories'
import { useConfirmation } from '@/composables/useConfirmation'
import { formatApiError } from '@/utils/formValidation'

export function useItemFormModal(props, emit) {
  const itemStore = useItemStore()
  const { confirm } = useConfirmation()
  const isEdit = computed(() => !!props.item)
  const loading = ref(false)
  const deleting = ref(false)
  const errorMessage = ref('')
  const selectedFile = ref(null)
  const imageRemoved = ref(false)
  const imagePreview = ref(
    props.item?.imagem_detail?.file || props.item?.imagem_detail?.url || null,
  )
  const form = reactive({
    nome: props.item?.nome || '',
    quantidade: props.item?.quantidade ?? 1,
    descricao: props.item?.descricao || '',
    categoria: props.item?.categoria || ITEM_CATEGORIES[0].value,
    estoque: props.estoqueId,
  })
  const showImageSheet = ref(false)

  function handleFileSelected(file) {
    if (selectedFile.value && imagePreview.value) URL.revokeObjectURL(imagePreview.value)
    selectedFile.value = file
    imagePreview.value = URL.createObjectURL(file)
    imageRemoved.value = false
  }

  function removeImage() {
    if (selectedFile.value && imagePreview.value) URL.revokeObjectURL(imagePreview.value)
    selectedFile.value = null
    imagePreview.value = null
    imageRemoved.value = true
  }

  async function handleSubmit() {
    errorMessage.value = ''
    if (!form.nome.trim()) return (errorMessage.value = 'O nome do item é obrigatório.')
    if (form.quantidade === null || form.quantidade === '' || !Number.isSafeInteger(Number(form.quantidade)) || Number(form.quantidade) < 0) {
      return (errorMessage.value = 'Informe uma quantidade válida.')
    }
    if (!form.categoria) return (errorMessage.value = 'Selecione uma categoria.')
    if (!form.estoque) return (errorMessage.value = 'Estoque não informado.')

    try {
      loading.value = true
      const itemData = {
        nome: form.nome.trim(),
        quantidade: Number(form.quantidade),
        descricao: form.descricao.trim(),
        categoria: form.categoria,
        estoque: form.estoque,
      }

      if (isEdit.value) {
        if (imageRemoved.value) itemData.imagem = null
        const updated = await itemStore.updateItem(props.item.id, itemData, selectedFile.value)
        emit('updated', updated)
      } else {
        const created = await itemStore.createItem(itemData, selectedFile.value)
        emit('created', created)
      }
      emit('close')
    } catch (error) {
      console.error('Erro ao salvar item:', error)
      errorMessage.value = formatApiError(error, 'Erro ao salvar o item.')
    } finally {
      loading.value = false
    }
  }

  async function handleDelete() {
    if (!isEdit.value || deleting.value || loading.value) return
    await confirm({
      title: 'Excluir item?',
      message: `O item “${props.item.nome}” será excluído permanentemente do estoque. Esta ação não pode ser desfeita.`,
      confirmLabel: 'Excluir item',
      onConfirm: async () => {
        deleting.value = true
        try {
          await itemStore.deleteItem(props.item.id)
          emit('deleted', props.item.id)
          emit('close')
        } finally { deleting.value = false }
      },
    })
  }

  return {
    isEdit,
    loading,
    deleting,
    errorMessage,
    selectedFile,
    imagePreview,
    form,
    showImageSheet,
    handleFileSelected,
    removeImage,
    handleSubmit,
    handleDelete,
  }
}
