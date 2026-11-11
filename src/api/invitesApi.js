import api from './config.js'

const invitesApi = {
  received: () => api.get('convites/recebidos/'),
  create: (payload) => api.post('convites/', payload),
  accept: (id) => api.post(`convites/${id}/aceitar/`),
  decline: (id) => api.post(`convites/${id}/recusar/`),
}
export default invitesApi
