import api from './config'

const teamApi = {
  getAll(page) {
    return api.get(`/equipes/?page=${page}`)
  },
  uploadImage(formData) {
    return api.post('media/images/', formData)
  },
  getOne(id) {
    return api.get(`equipes/${id}`)
  },
  getTeamByUserId(id){
    return api.get(`equipes/usuario/${id}`)
  }
}

export default teamApi
