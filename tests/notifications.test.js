import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createPinia, setActivePinia } from 'pinia'
import api from '../src/api/config.js'
import { useInvitesStore } from '../src/store/invitesStore.js'

globalThis.localStorage = { getItem: () => null }
const pending = { id: 1, status: 'P', equipe: 'team', equipe_nome: 'Robótica' }
const response = data => ({ data, status: 200, statusText: 'OK', headers: {}, config: {} })
function store() { setActivePinia(createPinia()); return useInvitesStore() }

test('aceitar remove o convite e o contador, inclusive após uma atualização atrasada', async () => {
  const invites = store()
  api.defaults.adapter = async () => response([pending])
  await invites.refresh()
  assert.equal(invites.unread, 1)
  let finishRefresh
  api.defaults.adapter = config => config.url.endsWith('recebidos/')
    ? new Promise(resolve => { finishRefresh = resolve }) : Promise.resolve(response({ status: 'A' }))
  const refreshing = invites.refresh()
  await invites.respond(1, true)
  assert.equal(invites.invites.length, 0)
  assert.equal(invites.unread, 0)
  finishRefresh(response([pending]))
  await refreshing
  assert.equal(invites.invites.length, 0)
})

test('respostas históricas ficam fora da lista e recusar remove apenas o convite respondido', async () => {
  const invites = store()
  api.defaults.adapter = async () => response([pending, { id: 2, status: 'A' }, { id: 3, status: 'N' }, { ...pending, id: 4 }])
  await invites.refresh()
  assert.equal(invites.unread, 2)
  api.defaults.adapter = async () => response({ status: 'N' })
  await invites.respond(1, false)
  assert.deepEqual(invites.invites.map(item => item.id), [4])
  assert.equal(invites.unread, 1)
})

test('falha na API mantém o convite e apresenta o erro de forma legível', async () => {
  const invites = store()
  api.defaults.adapter = async () => response([pending])
  await invites.refresh()
  api.defaults.adapter = async () => { throw { response: { status: 400, data: { non_field_errors: ['Tente novamente.'] } } } }
  await assert.rejects(invites.respond(1, true))
  assert.equal(invites.invites.length, 1)
  assert.equal(invites.unread, 1)
  assert.equal(invites.error, 'Tente novamente.')
  assert.deepEqual(invites.responding, [])
})

test('cliques repetidos enviam uma única resposta', async () => {
  const invites = store()
  let calls = 0
  let finish
  api.defaults.adapter = () => { calls++; return new Promise(resolve => { finish = resolve }) }
  const answering = invites.respond(1, true)
  assert.equal(await invites.respond(1, true), false)
  await Promise.resolve()
  assert.equal(calls, 1)
  finish(response({ status: 'A' }))
  await answering
})

test('limpar a sessão impede que uma requisição antiga preencha a lista de outra conta', async () => {
  const invites = store()
  let finish
  let started
  const ready = new Promise(resolve => { started = resolve })
  api.defaults.adapter = () => new Promise(resolve => { finish = resolve; started() })
  const refreshing = invites.refresh()
  await ready
  invites.clear()
  finish(response([pending]))
  await refreshing
  assert.deepEqual(invites.invites, [])
  assert.equal(invites.unread, 0)
})
