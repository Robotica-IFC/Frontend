import { defineStore } from 'pinia'
import storageApi from '@/api/storageApi'
import { ref } from 'vue'

export const useStorageStore = defineStore('storage', () => {
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
        const response = await storageApi.getStorageById(id)

        console.log(response.data)
        return response.data
      } 
      catch(err){
        console.error(err)
      }
  }

  return {
    createStorage,
    // getStorageByTeamId,
    getStorageById
  }
})
