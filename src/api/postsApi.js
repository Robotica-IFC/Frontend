import api from './config.js'

const postsApi = {
  getHighlights(signal) {
    return api.get('/posts/destaques/', { signal })
  },
  update(id, payload) {
    return api.patch(`/posts/${id}/`, payload)
  },
  like(id) {
    return api.post(`/posts/${id}/curtir/`)
  },
  unlike(id) {
    return api.delete(`/posts/${id}/curtir/`)
  },
  comments(id) {
    return api.get(`/posts/${id}/comentarios/`)
  },
  addComment(id, texto) {
    return api.post(`/posts/${id}/comentarios/`, { texto })
  },
  removeComment(postId, commentId) {
    return api.delete(`/posts/${postId}/comentarios/${commentId}/`)
  },
  create(payload) {
    return api.post('/posts/', payload)
  }
}

export default postsApi
