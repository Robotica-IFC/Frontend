import api from './config'

const teamApi = {
  getAll(page) {
    return api.get(`/equipes/?page=${page}`)
  },
  uploadImage(formData) {
    return api.post('media/images/', formData)
  },
}

export default teamApi
