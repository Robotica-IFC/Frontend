import api from './config.js'

const projectsApi = {
  getHighlights(signal) {
    return api.get('/projetos/destaques/', { signal })
  },
  delete(id) {
    return api.delete(`/projetos/${id}/`)
  },
  getAll(page = 1, pageSize) {
    return api.get('/projetos/', {
      params: { page, ...(pageSize ? { page_size: pageSize } : {}) },
    })
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
