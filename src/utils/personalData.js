export function onlyDigits(value) {
  return String(value ?? '').replace(/\D/g, '')
}

export function formatCpf(value) {
  return onlyDigits(value)
    .slice(0, 11)
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/(\d{3}\.\d{3}\.\d{3})(\d)/, '$1-$2')
}

export function formatPhone(value) {
  let digits = onlyDigits(value)
  let prefix = ''
  if (digits.length > 11 && digits.startsWith('55') && digits.length <= 13) {
    prefix = '+55 '
    digits = digits.slice(2)
  } else if (digits.length > 11) {
    return `+${digits}`
  }
  if (!digits) return ''
  if (digits.length <= 2) return `${prefix}(${digits}`
  const area = digits.slice(0, 2)
  const local = digits.slice(2)
  const split = local.length > 8 ? 5 : 4
  return `${prefix}(${area}) ${local.slice(0, split)}${local.length > split ? `-${local.slice(split)}` : ''}`
}

export function formatPersonalField(value, field) {
  return field === 'cpf' ? formatCpf(value) : field === 'telefone' ? formatPhone(value) : value
}

// Preserve nulls and omitted fields when preparing partial updates.
export function normalizePersonalData(data) {
  const result = { ...data }
  for (const field of ['cpf', 'telefone']) {
    if (result[field] != null) result[field] = onlyDigits(result[field])
  }
  return result
}

export function maskedEdit(value, caret, inputType, previousValue, field) {
  let digits = onlyDigits(value)
  let digitPosition = onlyDigits(value.slice(0, caret)).length
  // Deleting a separator should delete a digit instead of restoring the separator.
  if (digits === onlyDigits(previousValue) && inputType?.startsWith('delete')) {
    const index = inputType === 'deleteContentBackward' ? digitPosition - 1 : digitPosition
    if (index >= 0 && index < digits.length) {
      digits = digits.slice(0, index) + digits.slice(index + 1)
      if (inputType === 'deleteContentBackward') digitPosition--
    }
  }
  digits = digits.slice(0, field === 'cpf' ? 11 : 15)
  const text = formatPersonalField(digits, field)
  let position = 0
  let seen = 0
  while (position < text.length && seen < digitPosition) {
    if (/\d/.test(text[position])) seen++
    position++
  }
  return { raw: digits, text, caret: position }
}
