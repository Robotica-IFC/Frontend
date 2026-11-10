import api from './config'

const teamApi = {
  getAll(page, pageSize) {
    let url = `/equipes/?page=${page}`

    if (pageSize) {
      url += `&page_size=${pageSize}`
    }

    return api.get(url)
  },
  getOptions(search = '', page = 1, signal) {
    return api.get('equipes/opcoes/', {
      params: { ativo: true, search, page, page_size: 15 },
      signal,
    })
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
  getTeamByUserId(id) {
    return api.get(`equipes/usuario/${id}`)
  },
  postView(id) {
    return api.post(`equipes/${id}/visualizar/`)
  },
  exitTeam(id) {
    return api.post(`equipes/${id}/sair/`)
  },
}

export default teamApi
