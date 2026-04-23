import { defineStore } from 'pinia'
import imageApi from '@/api/imageApi'
import instituteApi from '@/api/instituteApi'
import { computed, reactive, ref } from 'vue'

export const useInstituteStore = defineStore('institute', () => {
  const state = reactive({
    institute: {
      nome: '',
      logo: '',
      cidade: '',
      estado: '',
    },
    institutes: [],
  })

  const institutes = computed(() => state.institutes)

  async function getInstitutes() {
    try {
      const response = await instituteApi.getAllInstitutes()
      console.log(response.data.results)
      state.institutes = response.data.results
    } catch (error) {
      console.error(error)
    }
  }

  return {
    state,
    getInstitutes,
    institutes,
  }
})
