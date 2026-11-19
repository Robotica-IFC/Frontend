import assert from 'node:assert/strict'
import { test } from 'node:test'
import { canResumePendingVerification } from '../src/utils/pendingRegistration.js'

const pending = {
  pendingEmail: 'Pessoa@Example.test',
  pendingType: 'aluno',
  pendingRegistrationToken: 'pending-uuid',
}

test('retoma verificação quando 429 e token guardado pertencem ao mesmo cadastro', () => {
  assert.equal(
    canResumePendingVerification({ response: { status: 429 } }, pending, 'pessoa@example.test', 'aluno'),
    true,
  )
})

test('não retoma cadastro com token ausente, e-mail diferente ou tipo diferente', () => {
  const cooldown = { response: { status: 429 } }
  assert.equal(canResumePendingVerification(cooldown, { ...pending, pendingRegistrationToken: '' }, pending.pendingEmail, 'aluno'), false)
  assert.equal(canResumePendingVerification(cooldown, pending, 'outro@example.test', 'aluno'), false)
  assert.equal(canResumePendingVerification(cooldown, pending, pending.pendingEmail, 'professor'), false)
})

test('não redireciona falhas que não sejam o cooldown de cadastro', () => {
  assert.equal(canResumePendingVerification({ response: { status: 400 } }, pending, pending.pendingEmail, 'aluno'), false)
  assert.equal(canResumePendingVerification(new Error('Sem conexão'), pending, pending.pendingEmail, 'aluno'), false)
})
