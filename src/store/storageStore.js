import { defineStore } from 'pinia'
import storageApi from '@/api/storageApi'
import { computed, reactive } from 'vue'

export const useStorageStore = defineStore('storage', () => {
  const state = reactive({
    storage: null,
  })

  // Computeds

  const storage = computed(() => state.storage)


  async function createStorage(equipeId) {
    try {
      const payload = {
        equipe: equipeId,
      }

      const response = await storageApi.create(payload)
      return response.data.id
    } catch (error) {
      console.error('Erro ao criar estoque:', error)
      throw error
    }
  }

  // async function getStorageByTeamId(id) {  Acho que não sera usado
  //   try {
  //     const response = await storageApi.getStorageByTeamId(id)

  //     console.log(response.data)
  //     return response.data
  //   } catch (err) {
  //     console.error(err)
  //   }
  // }


  async function getStorageById(id) {
      try {
        state.storage = null

        const response = await storageApi.getStorageById(id)

        state.storage = response.data
      } 
      catch(err){
        console.error(err)
      }
  }

  function addItem(item) {
    if (!state.storage) return
    state.storage.itens = [...(state.storage.itens || []), item]
  }

  function updateItemInStorage(item) {
    if (!state.storage?.itens) return
    const index = state.storage.itens.findIndex((i) => i.id === item.id)
    if (index !== -1) {
      state.storage.itens.splice(index, 1, item)
    }
  }

  function removeItem(id) {
    if (!state.storage?.itens) return
    state.storage.itens = state.storage.itens.filter((i) => i.id !== id)
  }

  return {
    createStorage,
    // getStorageByTeamId,
    getStorageById,
    addItem,
    updateItemInStorage,
    removeItem,
    storage,
  }
})