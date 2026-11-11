import { defineStore } from 'pinia'
import projectSuggestionsApi from '@/api/projectSuggestionsApi'

export const useProjectSuggestionsStore = defineStore('projectSuggestions', () => {
  async function createSuggestion(suggestion, attachments = []) {
    if (attachments.length > 4) throw new Error('Envie no máximo 4 anexos por sugestão.')
    for (const attachment of attachments) {
      // Reutiliza os anexos já enviados quando o usuário tenta reenviar o formulário.
      if (attachment.attachmentKey) continue

      const formData = new FormData()
      formData.append('file', attachment.file)
      formData.append('description', attachment.file.name.slice(0, 255))
      const { data } = await projectSuggestionsApi.uploadDocument(formData)
      if (!data.attachment_key)
        throw new Error('Não foi possível anexar o arquivo. Tente novamente.')
      attachment.attachmentKey = data.attachment_key
    }

    const { data } = await projectSuggestionsApi.create({
      ...suggestion,
      anexos: attachments.map((attachment) => attachment.attachmentKey),
    })
    return data
  }

  async function getSuggestionsByTeam(teamId, signal) {
    const suggestions = []
    let page = 1
    let totalPages
    do {
      const { data } = await projectSuggestionsApi.getByTeam(teamId, page, signal)
      if (signal?.aborted) return []
      suggestions.push(...data.results)
      totalPages = data.total_pages
      page += 1
    } while (page <= totalPages)
    return suggestions
  }

  async function rejectSuggestion(id) {
    const { data } = await projectSuggestionsApi.reject(id)
    return data
  }

  async function acceptSuggestion(id) {
    const { data } = await projectSuggestionsApi.accept(id)
    return data
  }

  async function setFavoriteSuggestion(id, favorite) {
    const { data } = await projectSuggestionsApi.setFavorite(id, favorite)
    return data
  }

  return {
    createSuggestion,
    getSuggestionsByTeam,
    rejectSuggestion,
    acceptSuggestion,
    setFavoriteSuggestion,
  }
})
