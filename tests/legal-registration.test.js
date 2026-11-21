import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('arquivo Google na raiz pública conserva o conteúdo solicitado', () => {
  assert.equal(
    read('public/google34817bb64d7471c4.html').trim(),
    'google-site-verification: google34817bb64d7471c4.html',
  )
})

test('ambos os documentos legais são públicos no roteador', () => {
  const router = read('src/router/index.js')
  for (const url of ['/termos-de-uso', '/privacidade']) {
    assert.ok(router.includes(`path: '${url}'`))
    assert.ok(router.includes(`'${url}'`))
  }
})

test('confirmações exigidas para alunos e professores antes de enviar', () => {
  const acceptance = read('src/components/sign/LegalAcceptance.vue')
  assert.ok(acceptance.includes('name="acceptTerms"') && acceptance.includes('required'))
  assert.ok(acceptance.includes('name="acknowledgePrivacy"') && acceptance.includes('required'))
  for (const component of [
    'src/components/sign/finalDataStudentComponent.vue',
    'src/components/sign/finalDataTeacherComponent.vue',
  ]) {
    const source = read(component)
    assert.match(source, /v-model:termsAccepted="termsAccepted"/)
    assert.match(source, /v-model:privacyAcknowledged="privacyAcknowledged"/)
    assert.ok(source.includes('!termsAccepted.value || !privacyAcknowledged.value'))
    assert.ok(source.includes(':disabled="loading || !termsAccepted || !privacyAcknowledged"'))
  }
})

test('rodapé disponibiliza links públicos de privacidade e termos', () => {
  const footer = read('src/components/layout/appFooterComponent.vue')
  assert.ok(footer.includes('to="/termos-de-uso"'))
  assert.ok(footer.includes('to="/privacidade"'))
})
