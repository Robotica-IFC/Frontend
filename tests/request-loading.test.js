import assert from 'node:assert/strict'
import { test } from 'node:test'
import { setTimeout as delay } from 'node:timers/promises'
import axios from 'axios'
import api from '../src/api/config.js'
import { beginRequest, requestsLoading } from '../src/utils/requestLoading.js'

globalThis.localStorage = { getItem: () => null }

test('mantém o bloqueio até concluir todas as requisições e as dependentes', async () => {
  const first = beginRequest()
  const second = beginRequest()
  assert.equal(requestsLoading.value, true)
  first()
  first() // Completion is idempotent.
  await delay(150)
  assert.equal(requestsLoading.value, true)
  second()
  await delay(50)
  const dependent = beginRequest()
  await delay(150)
  assert.equal(requestsLoading.value, true)
  dependent()
  await delay(150)
  assert.equal(requestsLoading.value, false)
})

test('libera o bloqueio após sucesso, erro HTTP, erro de rede e cancelamento', async () => {
  const adapter = api.defaults.adapter
  try {
    for (const result of ['success', 'http', 'network', 'cancel']) {
      let resolveRequest
      api.defaults.adapter = (config) => new Promise((resolve, reject) => {
        resolveRequest = () => {
          if (result === 'success') resolve({ data: {}, status: 200, headers: {}, config })
          else if (result === 'cancel') reject(new axios.CanceledError('cancelado', config))
          else reject(new axios.AxiosError('falha', result === 'http' ? 'ERR_BAD_RESPONSE' : 'ERR_NETWORK', config, null,
            result === 'http' ? { status: 500, config } : undefined))
        }
      })
      const request = api.get('equipes/').catch(() => null)
      await delay(0)
      assert.equal(requestsLoading.value, true, result)
      resolveRequest()
      await request
      await delay(150)
      assert.equal(requestsLoading.value, false, result)
    }
  } finally {
    api.defaults.adapter = adapter
  }
})
