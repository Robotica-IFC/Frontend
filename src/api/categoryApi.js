import api from './config'

const categoryApi = {
  getAll() {
    return api.get('categorias/')
  },
  create(nome) {
    return api.post('categorias/', { nome: nome.toUpperCase() })
  }
}

export default categoryApi