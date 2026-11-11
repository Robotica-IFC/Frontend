import assert from 'node:assert/strict'
import { test } from 'node:test'
import { useConfirmation } from '../src/composables/useConfirmation.js'

test('cancelar uma confirmação não executa a ação', async () => {
  const { confirm, cancel, pending } = useConfirmation()
  let calls = 0
  const result = confirm({ message: 'Excluir?', onConfirm: () => { calls++ } })
  assert.equal(calls, 0)
  cancel()
  assert.equal(await result, false)
  assert.equal(calls, 0)
  assert.equal(pending.value, null)
})

test('a operação executa uma vez e bloqueia confirmação e fechamento durante a requisição', async () => {
  const { confirm, accept, cancel, busy, pending } = useConfirmation()
  let finish
  let calls = 0
  const result = confirm({
    message: 'Transferir OWNER?',
    onConfirm: () => {
      calls++
      return new Promise(resolve => { finish = resolve })
    },
  })
  const accepting = accept()
  assert.equal(busy.value, true)
  cancel()
  await accept()
  assert.equal(calls, 1)
  assert.ok(pending.value)
  finish()
  await accepting
  assert.equal(await result, true)
  assert.equal(busy.value, false)
  assert.equal(pending.value, null)
})

test('erro da API mantém o modal aberto e permite tentar novamente', async () => {
  const { confirm, accept, error, pending } = useConfirmation()
  let calls = 0
  const result = confirm({
    message: 'Excluir equipe?',
    onConfirm: () => {
      if (++calls === 1) throw { response: { data: { professor: ['Professor não pertence à equipe.'] } } }
    },
  })
  await accept()
  assert.ok(pending.value)
  assert.equal(error.value, 'Professor não pertence à equipe.')
  await accept()
  assert.equal(await result, true)
  assert.equal(error.value, '')
  assert.equal(calls, 2)
})

test('uma segunda ação não substitui a confirmação em andamento', async () => {
  const { confirm, accept } = useConfirmation()
  let firstCalls = 0
  let secondCalls = 0
  const first = confirm({ message: 'Primeira ação', onConfirm: () => { firstCalls++ } })
  const second = confirm({ message: 'Segunda ação', onConfirm: () => { secondCalls++ } })
  assert.equal(await second, false)
  await accept()
  assert.equal(await first, true)
  assert.equal(firstCalls, 1)
  assert.equal(secondCalls, 0)
})
