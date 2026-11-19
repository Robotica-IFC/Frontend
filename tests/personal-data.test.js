import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  formatCpf,
  formatPhone,
  maskedEdit,
  normalizePersonalData,
} from '../src/utils/personalData.js'
import api from '../src/api/config.js'
import studentApi from '../src/api/studentApi.js'
import teacherApi from '../src/api/teacherApi.js'

globalThis.localStorage = { getItem: () => null }

test('CPF formats full, partial and already formatted values', () => {
  assert.equal(formatCpf('12345678901'), '123.456.789-01')
  assert.equal(formatCpf('123.456.789-01'), '123.456.789-01')
  assert.equal(formatCpf('1234'), '123.4')
  assert.equal(formatCpf(null), '')
  assert.equal(formatCpf('00100200304'), '001.002.003-04')
})

test('phone formats landlines, mobile numbers and Brazilian country codes', () => {
  assert.equal(formatPhone('4738037200'), '(47) 3803-7200')
  assert.equal(formatPhone('47999991234'), '(47) 99999-1234')
  assert.equal(formatPhone('+55 (47) 99999-1234'), '+55 (47) 99999-1234')
  assert.equal(formatPhone('554738037200'), '+55 (47) 3803-7200')
  assert.equal(formatPhone('47'), '(47')
  assert.equal(formatPhone(''), '')
})

test('pasting and editing keeps only digits and preserves the caret', () => {
  const paste = maskedEdit('123.456.789-01', 14, 'insertFromPaste', '', 'cpf')
  assert.deepEqual(paste, { raw: '12345678901', text: '123.456.789-01', caret: 14 })
  const backspace = maskedEdit('123456.789-01', 3, 'deleteContentBackward', '12345678901', 'cpf')
  assert.equal(backspace.raw, '1245678901')
  assert.equal(backspace.caret, 2)
  const insert = maskedEdit('1293.456.789-01', 3, 'insertText', '12345678901', 'cpf')
  assert.equal(insert.raw, '12934567890')
  assert.equal(insert.caret, 3)
  assert.equal(maskedEdit('', 0, 'deleteContentBackward', '1', 'telefone').text, '')
})

test('normalization preserves omitted fields, null and the original object', () => {
  const data = { cpf: '001.002.003-04', telefone: '(47) 99999-1234', name: 'Pessoa' }
  assert.deepEqual(normalizePersonalData(data), {
    cpf: '00100200304',
    telefone: '47999991234',
    name: 'Pessoa',
  })
  assert.equal(data.cpf, '001.002.003-04')
  assert.deepEqual(normalizePersonalData({ cpf: null, telefone: '' }), { cpf: null, telefone: '' })
  assert.deepEqual(normalizePersonalData({ descricao: 'Bio' }), { descricao: 'Bio' })
})

for (const [kind, resource] of [
  ['student', studentApi],
  ['teacher', teacherApi],
]) {
  for (const method of ['create', 'update']) {
    test(`${kind} ${method} sends unformatted CPF and phone to the backend`, async () => {
      let payload
      api.defaults.adapter = async (config) => {
        payload = JSON.parse(config.data)
        return { data: payload, status: 200, statusText: 'OK', headers: {}, config }
      }
      const data = { cpf: '001.002.003-04', telefone: '+55 (47) 99999-1234' }
      if (method === 'create') await resource.create(data)
      else await resource.update(1, data)
      assert.deepEqual(payload, { cpf: '00100200304', telefone: '5547999991234' })
    })
  }
}
