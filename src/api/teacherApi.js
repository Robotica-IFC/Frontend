import api from './config'

const teacherApi = {
  search(term) {
    return api.get('professores/', { params: { search: term } })
  },
  getAll() {
    return api.get('professores/')
  },
  getById(id) {
    return api.get(`professores/${id}/`)
  },

  create(data) {
    return api.post('professores/', data)
  },
  update(id, data) {
    return api.patch(`/professores/${id}/`, data)
  },
  uploadImage(formData) {
    return api.post('media/images/', formData)
  },
}

export default teacherApi
