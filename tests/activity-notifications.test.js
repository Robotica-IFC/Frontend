import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createPinia, setActivePinia } from 'pinia'
import api from '../src/api/config.js'
import { useNotificationsStore } from '../src/store/notificationsStore.js'

globalThis.localStorage = { getItem: () => null }
const notification = { id: 1, projeto: 10, titulo: 'Novo projeto', lida_em: null }
const readDate = '2026-11-11T12:00:00Z'
const response = data => ({ data, status: 200, statusText: 'OK', headers: {}, config: {} })
const page = (items, unread = 1, next = null) => response({ results: items, nao_lidas: unread, next })
function store() { setActivePinia(createPinia()); return useNotificationsStore() }
function deferred() {
  let resolve
  const promise = new Promise(finish => { resolve = finish })
  return { promise, resolve }
}

test('lista usa o total de não lidas do backend, inclusive além da primeira página', async () => {
  const notifications = store()
  api.defaults.adapter = async () => page([notification], 25, 'http://api/notificacoes/?page=2')
  await notifications.refresh()
  assert.equal(notifications.notifications.length, 1)
  assert.equal(notifications.unread, 25)
  assert.equal(notifications.hasMore, true)
})

test('leitura é salva na API e atualização atrasada não restaura o estado não lido', async () => {
  const notifications = store()
  api.defaults.adapter = async () => page([notification])
  await notifications.refresh()
  const stale = deferred()
  const started = deferred()
  api.defaults.adapter = config => {
    if (config.url.endsWith('/ler/')) return Promise.resolve(response({ ...notification, lida_em: readDate }))
    if (config.url.endsWith('nao-lidas/')) return Promise.resolve(response({ nao_lidas: 0 }))
    started.resolve()
    return stale.promise
  }
  const refreshing = notifications.refresh()
  await started.promise
  assert.equal(await notifications.markRead(notifications.notifications[0]), true)
  stale.resolve(page([notification]))
  await refreshing
  assert.equal(notifications.notifications[0].lida_em, readDate)
  assert.equal(notifications.unread, 0)
})

test('falha ao marcar leitura mantém o aviso não lido e apresenta o erro', async () => {
  const notifications = store()
  api.defaults.adapter = async () => page([notification])
  await notifications.refresh()
  api.defaults.adapter = async () => { throw { response: { status: 500, data: { detail: 'Tente novamente.' } } } }
  await assert.rejects(notifications.markRead(notifications.notifications[0]))
  assert.equal(notifications.notifications[0].lida_em, null)
  assert.equal(notifications.unread, 1)
  assert.equal(notifications.error, 'Tente novamente.')
  assert.deepEqual(notifications.reading, [])
})

test('cliques repetidos não duplicam leitura nem diminuem duas vezes o contador', async () => {
  const notifications = store()
  api.defaults.adapter = async () => page([notification])
  await notifications.refresh()
  const pending = deferred()
  let calls = 0
  api.defaults.adapter = config => {
    if (config.url.endsWith('nao-lidas/')) return Promise.resolve(response({ nao_lidas: 0 }))
    calls++
    return pending.promise
  }
  const reading = notifications.markRead(notification)
  assert.equal(await notifications.markRead(notification), false)
  pending.resolve(response({ ...notification, lida_em: readDate }))
  await reading
  assert.equal(await notifications.markRead(notification), true)
  assert.equal(calls, 1)
  assert.equal(notifications.unread, 0)
})

test('carregar mais preserva avisos anteriores e remove duplicatas entre páginas', async () => {
  const notifications = store()
  api.defaults.adapter = async () => page([notification], 2, 'next')
  await notifications.refresh()
  api.defaults.adapter = async config => {
    assert.equal(config.params.page, 2)
    return page([notification, { ...notification, id: 2 }], 2)
  }
  await notifications.loadMore()
  assert.deepEqual(notifications.notifications.map(item => item.id), [1, 2])
  assert.equal(notifications.hasMore, false)
})

test('logout descarta lista e resposta atrasada de outra sessão', async () => {
  const notifications = store()
  const pending = deferred()
  const started = deferred()
  api.defaults.adapter = () => { started.resolve(); return pending.promise }
  const refreshing = notifications.refresh()
  await started.promise
  notifications.clear()
  pending.resolve(page([notification]))
  await refreshing
  assert.deepEqual(notifications.notifications, [])
  assert.equal(notifications.unread, 0)
  assert.equal(notifications.loading, false)
})

test('contador antigo não sobrescreve uma leitura concluída', async () => {
  const notifications = store()
  api.defaults.adapter = async () => page([notification])
  await notifications.refresh()
  const pending = deferred()
  const started = deferred()
  let counts = 0
  api.defaults.adapter = config => {
    if (config.url.endsWith('/ler/')) return Promise.resolve(response({ ...notification, lida_em: readDate }))
    if (++counts > 1) return Promise.resolve(response({ nao_lidas: 0 }))
    started.resolve()
    return pending.promise
  }
  const counting = notifications.refreshCount()
  await started.promise
  await notifications.markRead(notification)
  pending.resolve(response({ nao_lidas: 1 }))
  await counting
  assert.equal(notifications.unread, 0)
})

test('aviso aparece para novas atividades e fechar não marca como lida', async () => {
  const notifications = store()
  api.defaults.adapter = async () => response({ nao_lidas: 2, ultima_nao_lida: 10 })
  await notifications.refreshCount()
  assert.equal(notifications.toast.id, 10)
  notifications.dismissToast()
  assert.equal(notifications.toast, null)
  assert.equal(notifications.unread, 2)
  await notifications.refreshCount()
  assert.equal(notifications.toast, null)
  api.defaults.adapter = async () => response({ nao_lidas: 2, ultima_nao_lida: 11 })
  await notifications.refreshCount()
  assert.equal(notifications.toast.id, 11)
  notifications.clear()
  assert.equal(notifications.toast, null)
})
