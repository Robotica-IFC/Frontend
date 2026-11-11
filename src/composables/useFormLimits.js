import { readonly, ref } from 'vue'
import api from '@/api/config'
import { validateValues } from '@/utils/formValidation'

const forms = ref({})
const uploads = ref({})
const ready = ref(false)
const unavailable = ref(false)
let request

export function useFormLimits() {
  async function load() {
    if (ready.value) return
    if (request) return request
    request = api.get('formularios/limites/').then(({ data }) => {
      if (!data?.forms || typeof data.forms !== 'object') throw new Error('Regras indisponíveis.')
      forms.value = data.forms
      uploads.value = data.uploads || {}
      ready.value = true
      unavailable.value = false
    }).catch(() => {
      // O backend continua validando os dados quando as regras não puderem ser consultadas.
      unavailable.value = true
    }).finally(() => { request = null })
    return request
  }
  function field(resource, name) {
    return forms.value[resource]?.[name] || {}
  }
  function attrs(resource, name) {
    const rule = field(resource, name)
    return {
      maxlength: rule.max_length,
      minlength: rule.min_length,
      min: rule.min_value,
      max: rule.max_value,
      step: rule.type === 'integer' ? 1 : undefined,
    }
  }
  async function assertValid(resource, values) {
    await load()
    const errors = validateValues(forms.value[resource] || {}, values)
    if (Object.keys(errors).length) {
      const error = new Error('Revise os campos indicados.')
      error.response = { data: errors }
      throw error
    }
  }
  async function assertImages(files) {
    if (!files?.length) return
    await load()
    const accepted = uploads.value.image_types
    if (!accepted?.length) return
    const invalid = files.find(file => !accepted.includes(file.type))
    if (invalid) {
      const error = new Error('Formato de imagem inválido.')
      error.response = { data: { file: [`A imagem “${invalid.name}” não é aceita. Use JPG, PNG, WebP, GIF ou ICO.`] } }
      throw error
    }
  }
  return { ready: readonly(ready), unavailable: readonly(unavailable), uploads: readonly(uploads), load, field, attrs, assertValid, assertImages }
}
