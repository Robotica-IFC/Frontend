<script setup>
import UploadHint from '@/components/form/UploadHint.vue'
import { ref } from 'vue'
import { usePostStore } from '@/store/postsStore'
import FieldHint from '@/components/form/FieldHint.vue'
import { useFormLimits } from '@/composables/useFormLimits'
import { formatApiError } from '@/utils/formValidation'

const limits = useFormLimits()
const props = defineProps({ post: { type: Object, required: true } })
const emit = defineEmits(['close', 'saved'])
const store = usePostStore()
const legenda = ref(props.post.legenda || '')
const images = ref(null)
const formatoImagem = ref(props.post.formato_imagem || 'RETANGULAR')
const error = ref('')
async function save() {
  error.value = ''
  try {
    await store.updatePost(props.post.id, legenda.value.trim(), images.value, formatoImagem.value)
    emit('saved')
    emit('close')
  } catch (err) { error.value = formatApiError(err, 'Não foi possível atualizar a publicação.') }
}
</script>
<template>
  <div class="post-edit-overlay" @click.self="$emit('close')">
    <section class="post-edit-panel" role="dialog" aria-modal="true" aria-label="Editar publicação">
      <header><h2>Editar publicação</h2><button @click="$emit('close')" aria-label="Fechar"><i class="mdi mdi-close"/></button></header>
      <form @submit.prevent="save">
        <label>Legenda <textarea v-model="legenda" v-bind="limits.attrs('post', 'legenda')" rows="6" placeholder="Escreva sua publicação..." /><FieldHint resource="post" field="legenda" :value="legenda" /></label>
        <fieldset class="format-selector">
          <legend>Formato das imagens</legend>
          <label :class="{ active: formatoImagem === 'QUADRADO' }">
            <input v-model="formatoImagem" type="radio" value="QUADRADO" name="editar-formato"/>
            <i class="mdi mdi-crop-square" aria-hidden="true"></i> Quadrado (1:1)
          </label>
          <label :class="{ active: formatoImagem === 'RETANGULAR' }">
            <input v-model="formatoImagem" type="radio" value="RETANGULAR" name="editar-formato"/>
            <i class="mdi mdi-crop-landscape" aria-hidden="true"></i> Retangular (16:9)
          </label>
        </fieldset>
        <label>Substituir imagens (opcional)
          <input type="file" accept="image/*" multiple @change="images = Array.from($event.target.files)" />
        </label>
        <UploadHint />
        <p class="hint">Ao selecionar novas imagens, elas substituirão as imagens anteriores.</p>
        <p v-if="error" role="alert" class="error">{{ error }}</p>
        <footer><button type="button" class="secondary" @click="$emit('close')">Cancelar</button><button type="submit" :disabled="store.loading">{{ store.loading ? 'Salvando...' : 'Salvar' }}</button></footer>
      </form>
    </section>
  </div>
</template>
<style scoped>
.post-edit-overlay {
  position:fixed;
  inset:0;
  z-index:1100;
  background:#0007;
  display:flex;
  align-items:flex-end;
  justify-content:center
}
.post-edit-panel {
  width:100%;
  max-height:90dvh;
  overflow:auto;
  padding:24px;
  background:white;
  border-radius:20px 20px 0 0;
  color:#004369;
  box-sizing:border-box
}
header,footer {
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px
}
header button {
  border:0;
  background:none;
  font-size:20px;
  color:inherit
}
form {
  display:grid;
  gap:16px
}
label {
  display:grid;
  gap:8px
}
textarea,input {
  font:inherit;
  border:1px solid #a3c3d2;
  border-radius:8px;
  padding:12px;
  width:100%;
  box-sizing:border-box
}
.hint {
  font-size:12px;
  color:#526b7e
}
.error {
  color:#b3261e
}
footer button {
  padding:12px 16px;
  border-radius:7px;
  border:1px solid #004369;
  background:#004369;
  color:#fff
}
footer .secondary {
  background:#fff;
  color:#004369
}
.format-selector {
  border:0;
  margin:0;
  padding:0;
  display:flex;
  flex-wrap:wrap;
  gap:9px;
  min-width:0
}
.format-selector legend {
  font-weight:600;
  margin-bottom:9px
}
.format-selector label {
  flex:1 1 140px;
  display:flex;
  flex-direction:row;
  align-items:center;
  justify-content:center;
  gap:6px;
  border:1px solid #afcbdc;
  border-radius:8px;
  padding:11px 9px;
  cursor:pointer;
  font-size:13px
}
.format-selector label.active {
  background:#e8f4fa;
  border-color:#004369
}
.format-selector input {
  width:auto
}
@media(min-width:768px) {
  .post-edit-overlay {
    align-items:center;
    padding:24px
  }
  .post-edit-panel {
    max-width:600px;
    border-radius:16px
  }
}
</style>
