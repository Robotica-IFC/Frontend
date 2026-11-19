import api from './config.js'

const projectsApi = {
  getHighlights(signal) {
    return api.get('/projetos/destaques/', { signal })
  },
  delete(id) {
    return api.delete(`/projetos/${id}/`)
  },
  getAll(page = 1, pageSize, filters = {}) {
    return api.get('/projetos/', {
      params: { ...filters, page, ...(pageSize ? { page_size: pageSize } : {}) },
    })
  },
  getByTeam(id, page = 1, pageSize = 2, filters = {}) {
    return api.get('/projetos/', { params: { ...filters, equipe: id, page, page_size: pageSize } })
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
  },
}

export default projectsApi
