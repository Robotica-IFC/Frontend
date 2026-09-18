import { defineStore } from 'pinia'
import storageApi from '@/api/storageApi'
import { ref } from 'vue'

export const useStorageStore = defineStore('storage', () => {
  async function createStorage(equipeId) {
    try {
      const payload = {
        equipe: equipeId
      }

      const response = await storageApi.create(payload)
      return response.data
    } catch (error) {
      console.error('Erro ao criar estoque:', error)
      throw error
    }
  }

  return {
    createStorage,
  }
})
