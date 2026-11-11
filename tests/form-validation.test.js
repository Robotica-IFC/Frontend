import { test } from 'node:test'
import assert from 'node:assert/strict'
import { formatApiError, validateValues } from '../src/utils/formValidation.js'

test('os limites reais aceitam nomes de item acima de 40 e rejeitam acima de 100', () => {
  const rules = { nome: { type: 'text', max_length: 100, allow_blank: false } }
  assert.deepEqual(validateValues(rules, { nome: 'a'.repeat(100) }), {})
  assert.ok(validateValues(rules, { nome: 'a'.repeat(101) }).nome)
})
test('campos sem limite não recebem um máximo ou um mínimo inventado', () => {
  const rules = { descricao: { type: 'text', allow_blank: false } }
  assert.deepEqual(validateValues(rules, { descricao: 'Descrição curta válida.' }), {})
  assert.deepEqual(validateValues(rules, { descricao: 'a'.repeat(10000) }), {})
  assert.ok(validateValues(rules, { descricao: ' ' }).descricao)
})
test('campos opcionais continuam opcionais e atualizações parciais não exigem campos ausentes', () => {
  const rules = { descricao: { type: 'text', allow_blank: true, max_length: 1000 }, nome: { type: 'text', allow_blank: false } }
  assert.deepEqual(validateValues(rules, { descricao: '' }), {})
})
test('quantidades rejeitam frações e valores fora dos limites', () => {
  const rules = { quantidade: { type: 'integer', min_value: 0, max_value: 100 } }
  for (const quantidade of [-1, 1.5, 101, 'abc']) assert.ok(validateValues(rules, { quantidade }).quantidade)
  assert.deepEqual(validateValues(rules, { quantidade: 0 }), {})
})
test('a contagem considera caracteres Unicode da mesma maneira que o backend', () => {
  const rules = { nome: { type: 'text', max_length: 2 } }
  assert.deepEqual(validateValues(rules, { nome: '🤖🤖' }), {})
})
test('erros por campo e erros aninhados são formatados sem exibir objetos crus', () => {
  const message = formatApiError({ response: { data: { nome: ['Use até 50 caracteres.'], user: { username: ['Já existe.'] }, non_field_errors: ['Revise os dados.'] } } })
  assert.equal(message, 'Nome: Use até 50 caracteres.\nNome de usuário: Já existe.\nRevise os dados.')
  assert.equal(formatApiError({}, 'Falha de conexão.'), 'Falha de conexão.')
})
