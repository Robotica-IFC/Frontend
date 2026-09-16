import { defineStore } from 'pinia'
import storageApi from '@/api/storageApi'

export const useStorageStore = defineStore('storage', () => {
  async function createStorage(id) {
    try {
      const response = await storageApi.create(id)
    } catch (error) {
      console.error(error)
    }
  }
})
