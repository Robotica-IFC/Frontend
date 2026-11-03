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
}

export default projectSuggestionsApi
