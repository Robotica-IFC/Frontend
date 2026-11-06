import { defineStore } from 'pinia'
import { ref } from 'vue'
import postsApi from '@/api/postsApi'
import imageApi from '@/api/imageApi'
import { useFormLimits } from '@/composables/useFormLimits'

export const usePostStore = defineStore('post', () => {
  const limits = useFormLimits()
  const loading = ref(false)

  async function uploadImages(files) {
    await limits.assertImages(files)
    const uploadedImages = []
    
    for (const file of files) {
      const formData = new FormData()
      formData.append('file', file)
      const response = await imageApi.uploadImage(formData)
      
      // Captura o UUID correto retornado pela API ('attachment_key')
      const imageId = response.data.attachment_key || response.data.id

      uploadedImages.push({
        image_id: imageId
      })
    }
    
    return uploadedImages
  }

  async function createPost({ legenda, projeto, files, formato_imagem = 'RETANGULAR' }) {
    loading.value = true
    try {
      await limits.assertValid('post', { legenda })
      let images = []
      if (files && files.length > 0) {
        images = await uploadImages(files)
      }

      const payload = {
        legenda,
        formato_imagem,
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

  async function updatePost(id, legenda, files = null, formato_imagem = 'RETANGULAR') {
    loading.value = true
    try {
      const payload = { legenda, formato_imagem }
      await limits.assertValid('post', payload)
      if (files !== null) payload.images = await uploadImages(files)
      const { data } = await postsApi.update(id, payload)
      return data
    } finally {
      loading.value = false
    }
  }

  async function toggleLike(post) {
    const { data } = post.curtiu ? await postsApi.unlike(post.id) : await postsApi.like(post.id)
    post.curtiu = data.curtiu
    post.curtidas = data.curtidas
    return data
  }

  async function addComment(post, texto) {
    await limits.assertValid('comentario', { texto })
    const { data } = await postsApi.addComment(post.id, texto)
    post.comentarios = [...(post.comentarios || []), data]
    return data
  }

  async function removeComment(post, id) {
    await postsApi.removeComment(post.id, id)
    post.comentarios = (post.comentarios || []).filter(c => c.id !== id)
  }

  return {
    loading,
    updatePost,
    toggleLike,
    addComment,
    removeComment,
    createPost
  }
})
