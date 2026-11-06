import api from './config'

const projectsApi = {
  delete(id) {
    return api.delete(`/projetos/${id}/`)
  },
   getAll(page) {
    return api.get(`/projetos/?page=${page}`)
  },
  getByTeam(id) {
    return api.get(`/projetos/?equipe=${id}`)
  },
  uploadImage(formData) {
    return api.post('media/images/', formData)
  },
  getById(id) {
    return api.get(`/projetos/${id}`)
  },
  update(id, payload) {
    return api.patch(`/projetos/${id}/`, payload)
  },
  create(payload) {
    return api.post('projetos/', payload)
  }
}

export default projectsApi
