import assert from 'node:assert/strict'
import { test } from 'node:test'
import { setImmediate } from 'node:timers/promises'
import { createPinia, setActivePinia } from 'pinia'
import api from '../src/api/config.js'
import { useHomeHighlightsStore } from '../src/store/homeHighlightsStore.js'

globalThis.localStorage = { getItem: () => null }
const response = (data) => ({ data, status: 200, statusText: 'OK', headers: {}, config: {} })
function store() {
  setActivePinia(createPinia())
  return useHomeHighlightsStore()
}

test('atualizar substitui os destaques e preserva a ordem retornada pela API', async () => {
  const highlights = store()
  let posts = [
    { id: 8, curtidas: 20 },
    { id: 3, curtidas: 10 },
  ]
  const projects = [
    { id: 4, equipe_views: 50 },
    { id: 2, equipe_views: 30 },
  ]
  api.defaults.adapter = async (config) =>
    response(config.url.includes('/posts/') ? posts : projects)
  await highlights.refresh()
  assert.deepEqual(highlights.posts, posts)
  assert.deepEqual(highlights.projects, projects)

  posts = [
    { id: 12, curtidas: 30 },
    { id: 8, curtidas: 20 },
  ]
  await highlights.refresh()
  assert.deepEqual(
    highlights.posts.map((post) => post.id),
    [12, 8],
  )
})

test('falha em uma seção preserva seus dados e permite atualizar a outra', async () => {
  const highlights = store()
  highlights.posts = [{ id: 1 }]
  api.defaults.adapter = async (config) => {
    if (config.url.includes('/posts/')) throw new Error('Sem conexão')
    return response([{ id: 3 }])
  }
  await highlights.refresh()
  assert.deepEqual(highlights.posts, [{ id: 1 }])
  assert.ok(highlights.errors.posts)
  assert.deepEqual(highlights.projects, [{ id: 3 }])
  assert.equal(highlights.errors.projects, '')
  assert.equal(highlights.loading.posts, false)
})

test('atualizações simultâneas compartilham a requisição em andamento', async () => {
  const highlights = store()
  const resolvers = []
  api.defaults.adapter = () => new Promise((resolve) => resolvers.push(resolve))
  const first = highlights.refresh()
  const second = highlights.refresh()
  await setImmediate()
  assert.equal(resolvers.length, 2)
  resolvers.forEach((resolve) => resolve(response([])))
  await Promise.all([first, second])
})

test('atualização após uma curtida ignora respostas antigas do ranking', async () => {
  const highlights = store()
  const resolvers = []
  api.defaults.adapter = () => new Promise((resolve) => resolvers.push(resolve))
  const old = highlights.refresh()
  await setImmediate()
  api.defaults.adapter = async () => response([{ id: 9 }])
  await highlights.refresh(true)
  resolvers.forEach((resolve) => resolve(response([{ id: 1 }])))
  await old
  assert.deepEqual(highlights.posts, [{ id: 9 }])
  assert.deepEqual(highlights.projects, [{ id: 9 }])
})

test('sair da homepage cancela respostas pendentes e limpa os dados', async () => {
  const highlights = store()
  const resolvers = []
  api.defaults.adapter = () => new Promise((resolve) => resolvers.push(resolve))
  const old = highlights.refresh()
  await setImmediate()
  highlights.clear()
  resolvers.forEach((resolve) => resolve(response([{ id: 1 }])))
  await old
  assert.deepEqual(highlights.posts, [])
  assert.deepEqual(highlights.projects, [])
  assert.equal(highlights.loading.posts, false)
  assert.equal(highlights.errors.posts, '')
})
