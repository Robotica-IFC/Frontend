import api from './config'

const projectSuggestionsApi = {
  create(payload) {
    return api.post('sugestoes-projetos/', payload)
  },
  getByTeam(teamId, page = 1, signal) {
    return api.get('sugestoes-projetos/', {
      params: { equipe: teamId, page, page_size: 100 },
      signal,
    })
  },
  uploadDocument(formData) {
    return api.post('media/documents/', formData)
  },
  reject(id) {
    return api.post(`sugestoes-projetos/${id}/recusar/`)
  },
  accept(id) {
    return api.post(`sugestoes-projetos/${id}/aceitar/`)
  },
  setFavorite(id, favorite) {
    const action = favorite ? 'favoritar' : 'desfavoritar'
    return api.post(`sugestoes-projetos/${id}/${action}/`)
  },
}

export default projectSuggestionsApi
