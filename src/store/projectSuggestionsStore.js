import { defineStore } from 'pinia'
import projectSuggestionsApi from '@/api/projectSuggestionsApi'

export const useProjectSuggestionsStore = defineStore('projectSuggestions', () => {
  async function createSuggestion(suggestion, attachments = []) {
    for (const attachment of attachments) {
      // Reutiliza os PDFs já enviados quando o usuário tenta reenviar o formulário.
      if (attachment.attachmentKey) continue

      const formData = new FormData()
      formData.append('file', attachment.file)
      formData.append('description', attachment.file.name.slice(0, 255))
      const { data } = await projectSuggestionsApi.uploadDocument(formData)
      if (!data.attachment_key) throw new Error('Não foi possível anexar o PDF. Tente novamente.')
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
    let totalPages = 1
    do {
      const { data } = await projectSuggestionsApi.getByTeam(teamId, page, signal)
      if (signal?.aborted) return []
      suggestions.push(...data.results)
      totalPages = data.total_pages
      page += 1
    } while (page <= totalPages)
    return suggestions
  }

  return { createSuggestion, getSuggestionsByTeam }
})
