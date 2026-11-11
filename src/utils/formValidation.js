const labels = {
  nome: 'Nome', name: 'Nome completo', username: 'Nome de usuário', email: 'E-mail',
  password: 'Senha', cpf: 'CPF', telefone: 'Telefone', data_nascimento: 'Data de nascimento',
  titulo: 'Título', descricao: 'Descrição', desc_curta: 'Descrição curta', quantidade: 'Quantidade',
  categoria: 'Categoria', categorias: 'Categorias', instituicao: 'Instituição', equipe: 'Equipe',
  legenda: 'Legenda', texto: 'Comentário', sigla: 'Sigla', cidade: 'Cidade', estado: 'Estado',
  file: 'Arquivo', images: 'Imagens', imagem_perfil: 'Imagem de perfil', image_perfil: 'Imagem de perfil',
  professor: 'Professor', aluno: 'Aluno', codigo: 'Código', anexos: 'Anexos',
}

export function formatApiError(error, fallback = 'Não foi possível salvar. Revise os dados e tente novamente.') {
  const data = error?.response?.data
  if (!data) return fallback
  function flatten(value, prefix = '') {
    if (typeof value === 'string') return [prefix ? `${prefix}: ${value}` : value]
    if (Array.isArray(value)) return value.flatMap(item => flatten(item, prefix))
    if (value && typeof value === 'object') return Object.entries(value).flatMap(([key, item]) => {
      if (key === 'code') return []
      const label = ['detail', 'non_field_errors', 'message'].includes(key) ? prefix : (labels[key] || key)
      return flatten(item, label)
    })
    return []
  }
  return flatten(data).join('\n') || fallback
}

export function validateValues(rules, values) {
  const errors = {}
  for (const [name, value] of Object.entries(values)) {
    const rule = rules[name]
    if (!rule || value == null) continue
    const text = String(value).trim()
    if (!text) {
      if (!rule.allow_blank) errors[name] = ['Este campo não pode ficar vazio.']
      continue
    }
    if (rule.type === 'integer') {
      const number = Number(value)
      if (!Number.isSafeInteger(number)) errors[name] = ['Informe um número inteiro válido.']
      else if (rule.min_value != null && number < Number(rule.min_value)) errors[name] = [`O mínimo é ${rule.min_value}.`]
      else if (rule.max_value != null && number > Number(rule.max_value)) errors[name] = [`O máximo é ${rule.max_value}.`]
    } else {
      const length = Array.from(text).length
      if (rule.max_length != null && length > rule.max_length) errors[name] = [`Use até ${rule.max_length} caracteres.`]
      else if (rule.min_length != null && length < rule.min_length) errors[name] = [`Use pelo menos ${rule.min_length} caracteres.`]
    }
  }
  return errors
}
