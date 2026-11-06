import api from './config'

const teamApi = {
  delete(id) {
    return api.delete(`/equipes/${id}/`)
  },
  transferOwner(id, professorId) {
    return api.post(`/equipes/${id}/transferir-owner/`, { professor: professorId })
  },
  getAll(page, pageSize) {
    let url = `/equipes/?page=${page}`

    if (pageSize) {
      url += `&page_size=${pageSize}`
    }

    return api.get(url)
  },
  removeMember(teamId, memberId, type) {
    return api.delete(`/equipes/${teamId}/membros/${memberId}/`, { params: { tipo: type } })
  },
  update(id, payload) {
    return api.patch(`/equipes/${id}/`, payload)
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
  },
  postView(id) {
    return api.post(`equipes/${id}/visualizar/`)
  },
  exitTeam(id) {
    return api.post(`equipes/${id}/sair/`)
  }
}

export default teamApi
