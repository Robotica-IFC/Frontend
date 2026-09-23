import { defineStore } from 'pinia'
import { ref } from 'vue'
import itemApi from '@/api/itemApi'
import imageApi from '@/api/imageApi'

export const useItemStore = defineStore('item', () => {
  const loading = ref(false)

  async function uploadItemImage(imageFile) {
    if (!imageFile) return null
    try {
      const formData = new FormData()
      formData.append('file', imageFile)
      const response = await imageApi.uploadImage(formData)
      return response.data?.attachment_key
    } catch (error) {
      console.error('Erro ao realizar upload da imagem:', error)
      throw error
    }
  }

  async function createItem(itemData, image) {
    try {
      loading.value = true

      const attachmentKey = await uploadItemImage(image)

      const payload = {
        ...itemData,
        imagem: attachmentKey,
      }

      const response = await itemApi.create(payload)
      return response.data
    } catch (error) {
      console.error('Erro ao criar item:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function updateItem(id, itemData, image) {
    try {
      loading.value = true

      const payload = { ...itemData }

      if (image) {
        payload.imagem = await uploadItemImage(image)
      }

      const response = await itemApi.update(id, payload)
      return response.data
    } catch (error) {
      console.error('Erro ao atualizar item:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function deleteItem(id) {
    try {
      loading.value = true
      await itemApi.delete(id)
    } catch (error) {
      console.error('Erro ao excluir item:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    createItem,
    updateItem,
    deleteItem,
  }
})