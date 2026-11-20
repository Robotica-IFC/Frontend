import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const css = readFileSync(new URL('../src/assets/css/global.css', import.meta.url), 'utf8')
const darkStyles = css.slice(css.indexOf('/* FEAT-129:'))

test('modo escuro estiliza filtros de instituição e equipe e seus inputs', () => {
  for (const selector of [
    '.searchable-filter .field',
    '.resource-filters select',
    '.searchable-filter .field input',
    '.resource-filters .search-field',
  ]) {
    assert.ok(darkStyles.includes(selector), `Seletor ausente: ${selector}`)
  }
})

test('o botão claro de detalhes usa texto escuro', () => {
  assert.match(darkStyles, /\.card-desktop button\.details-button\s*\{[^}]*color:\s*#111827;/s)
})

test('descrições, ações, participantes e notificações usam texto legível', () => {
  for (const selector of [
    '.project-detail-page .project-intro .project-description',
    '.project-detail-page .post-actions button',
    '.modal-backdrop .modal-container .participant-info strong',
    '.notifications-page .activity-card .team-link',
  ]) {
    assert.ok(darkStyles.includes(selector), `Seletor ausente: ${selector}`)
  }
})

test('modais de publicação, edição, participantes e comentários têm superfície escura', () => {
  for (const selector of [
    '.modal-overlay .modal-content',
    '.post-edit-panel',
    '.edit-project-dialog',
    '.comments-panel',
    '.modal-backdrop .modal-container',
    '.modal-container .modal-header',
  ]) {
    assert.ok(darkStyles.includes(selector), `Seletor ausente: ${selector}`)
  }
})
