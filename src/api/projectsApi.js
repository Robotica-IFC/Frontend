import api from './config'

const projectsApi = {
   getAll(page) {
    return api.get(`/projetos/?page=${page}`)
  },
  getByTeam(id) {
    return api.get(`/projetos/?equipe=${id}`)
  },
  uploadImage(formData) {
    return api.post('media/images/', formData)
  }
}

export default projectsApi
