import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import {
  DEFAULT_AVATAR_URL,
  getAvatarUrl,
  getProfileImageUrl,
  useDefaultAvatar,
} from '../src/utils/profileImage.js'

test('usuários sem imagem usam o avatar local padrão', () => {
  assert.equal(DEFAULT_AVATAR_URL, '/img/default2.jpg')
  assert.equal(getAvatarUrl(null), DEFAULT_AVATAR_URL)
  assert.equal(getAvatarUrl(undefined), DEFAULT_AVATAR_URL)
  assert.equal(getAvatarUrl(''), DEFAULT_AVATAR_URL)
  assert.equal(getAvatarUrl('null'), DEFAULT_AVATAR_URL)
  assert.equal(getAvatarUrl({ url: null, file: null }), DEFAULT_AVATAR_URL)
})

test('imagem enviada pelo usuário tem prioridade sobre o avatar padrão', () => {
  assert.equal(getAvatarUrl('https://example.test/avatar.png'), 'https://example.test/avatar.png')
  assert.equal(getAvatarUrl({ url: 'https://example.test/avatar.png' }), 'https://example.test/avatar.png')
  assert.equal(getProfileImageUrl({ file: 'https://example.test/foto.jpg' }), 'https://example.test/foto.jpg')
})

test('imagem remota indisponível usa o fallback sem loop', () => {
  const target = { src: 'https://example.test/sem-foto.jpg' }
  useDefaultAvatar({ target })
  assert.equal(target.src, DEFAULT_AVATAR_URL)
  useDefaultAvatar({ target })
  assert.equal(target.src, DEFAULT_AVATAR_URL)
})

test('cadastro sem upload mantém imagem nula em vez de UUID fixo', () => {
  for (const [filename, field] of [['studentStore.js', 'student'], ['teacherStore.js', 'teacher']]) {
    const source = readFileSync(new URL(`../src/store/${filename}`, import.meta.url), 'utf8')
    assert.match(source, new RegExp(`state\\.${field}\\.imagem_perfil = null`))
    assert.doesNotMatch(source, /8d7c4190-fb43-46e1-a094-6e400c9365b2/)
  }
})
