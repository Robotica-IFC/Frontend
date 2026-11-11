import api from './config.js'

export default {
  list(page = 1) {
    return api.get('notificacoes/', { params: { page } })
  },
  unread() {
    return api.get('notificacoes/nao-lidas/')
  },
  read(id) {
    return api.post(`notificacoes/${id}/ler/`)
  },
}
