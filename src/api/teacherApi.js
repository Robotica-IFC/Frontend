import { normalizePersonalData } from '../utils/personalData.js'
import api from './config.js'

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
    return api.post('professores/', normalizePersonalData(data))
  },
  update(id, data) {
    return api.patch(`/professores/${id}/`, normalizePersonalData(data))
  },
  uploadImage(formData) {
    return api.post('media/images/', formData)
  },
}

export default teacherApi
