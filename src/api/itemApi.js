import api from './config'

const itemApi = {
  create(payload) {
    return api.post('itens/', payload)
  },
  update(id, payload) {
    return api.patch(`itens/${id}/`, payload)
  },
  delete(id) {
    return api.delete(`itens/${id}/`)
  },
}

export default itemApi