import api from './config'

const teamApi = {
  getAll(page, pageSize) {
    let url = `/equipes/?page=${page}`

    if (pageSize) {
      url += `&page_size=${pageSize}`
    }

    return api.get(url)
  },
  create(payload) {
    return api.post('equipes/', payload)
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
