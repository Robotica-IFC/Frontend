import api from './config'

const postsApi = {
  create(payload) {
    return api.post('/posts/', payload)
  }
}

export default postsApi