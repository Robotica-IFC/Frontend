import assert from 'node:assert/strict'
import { test } from 'node:test'
import { getRegistrationFeedback } from '../src/utils/registrationFeedback.js'

const error = (data) => ({ response: { status: 400, data } })

test('e-mail já cadastrado recebe aviso e opções de recuperar a conta', () => {
  for (const data of [
    { email: ['Já existe uma conta com este e-mail.'] },
    { user: { email: ['user with this email already exists.'] } },
    { code: 'email_already_exists', detail: 'Conflito.' },
  ]) {
    const feedback = getRegistrationFeedback(error(data))
    assert.equal(feedback.emailAlreadyRegistered, true)
    assert.match(feedback.message, /Entre na sua conta ou recupere sua senha/)
  }
})

test('outros erros não são apresentados como e-mail duplicado', () => {
  for (const data of [
    { email: ['Informe um endereço válido.'] },
    { username: ['Já existe um usuário com esse nome.'] },
    { password: ['Esta senha é muito comum.'] },
  ]) {
    const feedback = getRegistrationFeedback(error(data))
    assert.equal(feedback.emailAlreadyRegistered, false)
    assert.ok(feedback.message)
    assert.equal(feedback.message.includes('[object Object]'), false)
  }
})

test('falha de conexão permite tentar novamente sem afirmar que o e-mail existe', () => {
  assert.deepEqual(getRegistrationFeedback(new Error('Sem conexão')), {
    message: 'Não foi possível criar sua conta. Tente novamente.',
    emailAlreadyRegistered: false,
  })
})
