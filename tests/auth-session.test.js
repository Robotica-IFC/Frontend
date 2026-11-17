import { test } from 'node:test'
import assert from 'node:assert/strict'
import { getSessionToken, saveSessionToken, clearSessionTokens } from '../src/utils/authSession.js'

function storage() {
  const values = new Map()
  return {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: key => values.delete(key),
  }
}

test('duas contas em abas distintas preservam seus próprios tokens e logout', () => {
  globalThis.localStorage = storage()
  const firstTab = storage()
  const secondTab = storage()
  globalThis.sessionStorage = firstTab
  saveSessionToken('access_token', 'access-aluno')
  saveSessionToken('refresh_token', 'refresh-aluno')
  firstTab.setItem('user_profile_cache', 'perfil-aluno')

  globalThis.sessionStorage = secondTab
  saveSessionToken('access_token', 'access-professor')
  saveSessionToken('refresh_token', 'refresh-professor')
  secondTab.setItem('user_profile_cache', 'perfil-professor')

  globalThis.sessionStorage = firstTab
  assert.equal(getSessionToken('access_token'), 'access-aluno')
  assert.equal(getSessionToken('refresh_token'), 'refresh-aluno')
  assert.equal(sessionStorage.getItem('user_profile_cache'), 'perfil-aluno')
  clearSessionTokens()
  assert.equal(getSessionToken('access_token'), null)
  assert.equal(localStorage.getItem('access_token'), 'access-professor')

  globalThis.sessionStorage = secondTab
  assert.equal(getSessionToken('access_token'), 'access-professor')
  assert.equal(getSessionToken('refresh_token'), 'refresh-professor')
  assert.equal(sessionStorage.getItem('user_profile_cache'), 'perfil-professor')
})

test('token renovado em uma aba não troca a identidade da outra', () => {
  globalThis.localStorage = storage()
  const firstTab = storage()
  const secondTab = storage()
  globalThis.sessionStorage = firstTab
  saveSessionToken('access_token', 'conta-a')
  globalThis.sessionStorage = secondTab
  saveSessionToken('access_token', 'conta-b')
  globalThis.sessionStorage = firstTab
  saveSessionToken('access_token', 'conta-a-renovada')
  globalThis.sessionStorage = secondTab
  assert.equal(getSessionToken('access_token'), 'conta-b')
})
