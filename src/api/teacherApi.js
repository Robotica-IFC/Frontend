import api from './config'

const teacherApi = {
  getAll() {
    return api.get('professores/')
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
