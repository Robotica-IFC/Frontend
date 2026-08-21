import { defineStore } from 'pinia'
import { ref } from 'vue'
import postsApi from '@/api/postsApi'
import projectsApi from '@/api/projectsApi'

export const usePostStore = defineStore('post', () => {
  const loading = ref(false)

  async function uploadImages(files) {
    const uploadedImages = []
    
    for (const file of files) {
      const formData = new FormData()
      formData.append('file', file)
      const response = await projectsApi.uploadImage(formData)
      
      // Captura o UUID correto retornado pela API ('attachment_key')
      const imageId = response.data.attachment_key || response.data.id

      uploadedImages.push({
        image_id: imageId
      })
    }
    
    return uploadedImages
  }

  async function createPost({ legenda, projeto, files }) {
    loading.value = true
    try {
      let images = []
      if (files && files.length > 0) {
        images = await uploadImages(files)
      }

      const payload = {
        legenda,
        projeto: Number(projeto),
        images
      }

      const response = await postsApi.create(payload)
      return response.data
    } catch (error) {
      if (error.response && error.response.data) {
        console.error('Erros de validação do Backend:', error.response.data)
      }
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    createPost
  }
})