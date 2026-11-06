<script setup>
import UploadHint from '@/components/form/UploadHint.vue'
import { ref } from 'vue'
import { useProjectStore } from '@/store/projectsStore'
import { useConfirmation } from '@/composables/useConfirmation'
import router from '@/router'
import FieldHint from '@/components/form/FieldHint.vue'
import { useFormLimits } from '@/composables/useFormLimits'
import { formatApiError } from '@/utils/formValidation'

const limits = useFormLimits()

const props = defineProps({ project: { type: Object, required: true } })
const emit = defineEmits(['close', 'saved'])
const store = useProjectStore()
const { confirm } = useConfirmation()
const titulo = ref(props.project.titulo || '')
const desc_curta = ref(props.project.desc_curta || '')
const descricao = ref(props.project.descricao || '')
const status = ref(props.project.status || 'EM_ANDAMENTO')
const sugestao = ref(Boolean(props.project.sugestao))
const image = ref(undefined)
const saving = ref(false)
const error = ref('')

async function save() {
  if (saving.value) return
  if (status.value === 'CANCELADO' && props.project.status !== 'CANCELADO') {
    await confirm({
      title: 'Cancelar projeto?',
      message: `O projeto “${props.project.titulo}” será marcado como cancelado e as alterações do formulário serão salvas.`,
      confirmLabel: 'Cancelar projeto',
      onConfirm: persist,
    })
    return
  }
  try {
    await persist()
  } catch {
    /* O formulário exibe a mensagem de erro. */
  }
}

async function persist() {
  saving.value = true
  error.value = ''
  try {
    await store.updateProject(
      props.project.id,
      {
        titulo: titulo.value.trim(),
        desc_curta: desc_curta.value.trim(),
        descricao: descricao.value.trim(),
        status: status.value,
        sugestao: sugestao.value,
      },
      image.value,
    )
    emit('saved')
    emit('close')
  } catch (e) {
    error.value = formatApiError(e, 'Não foi possível atualizar o projeto.')
    throw e
  } finally {
    saving.value = false
  }
}

async function deleteProject() {
  await confirm({
    title: 'Excluir projeto?',
    message: `O projeto “${props.project.titulo}” e todas as suas publicações, curtidas e comentários serão excluídos permanentemente. Esta ação não pode ser desfeita.`,
    confirmLabel: 'Excluir projeto',
    onConfirm: async () => {
      await store.deleteProject(props.project.id)
      emit('close')
      await router.push({ name: 'teamDetails', params: { id: props.project.equipe_id } })
    },
  })
}
</script>

<template>
  <div class="edit-project-overlay" @click.self="$emit('close')">
    <section
      class="edit-project-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-project-title"
    >
      <header>
        <h2 id="edit-project-title">Editar projeto</h2>
        <button type="button" @click="$emit('close')" aria-label="Fechar">
          <i class="mdi mdi-close" />
        </button>
      </header>
      <form @submit.prevent="save">
        <label>Título <input v-model="titulo" v-bind="limits.attrs('projeto', 'titulo')" required /><FieldHint resource="projeto" field="titulo" :value="titulo" /></label>
        <label>Descrição curta <input v-model="desc_curta" v-bind="limits.attrs('projeto', 'desc_curta')" required /><FieldHint resource="projeto" field="desc_curta" :value="desc_curta" /></label>
        <label>Descrição <textarea v-model="descricao" v-bind="limits.attrs('projeto', 'descricao')" rows="6" required /><FieldHint resource="projeto" field="descricao" :value="descricao" /></label>
        <label
          >Status
          <select v-model="status">
            <option value="EM_ANDAMENTO">Em andamento</option>
            <option value="CONCLUIDO">Concluído</option>
            <option value="CANCELADO">Cancelado</option>
          </select>
        </label>
        <label class="checkbox"><input v-model="sugestao" type="checkbox" /> É uma sugestão</label>
        <label
          >Nova imagem (opcional)
          <input type="file" accept="image/*" @change="image = $event.target.files[0]"
        /></label>
        <UploadHint />
        <p v-if="error" role="alert" class="error">{{ error }}</p>
        <footer>
          <button type="button" class="secondary" @click="$emit('close')">Cancelar</button
          ><button type="submit" :disabled="saving">
            {{ saving ? 'Salvando...' : 'Salvar alterações' }}
          </button>
        </footer>
      </form>
      <section class="delete-project">
        <h3>Excluir projeto</h3>
        <p>Remove permanentemente o projeto e suas publicações.</p>
        <button type="button" :disabled="saving" @click="deleteProject">Excluir projeto</button>
      </section>
    </section>
  </div>
</template>
<style scoped>
.edit-project-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: #0009;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}
.edit-project-dialog {
  background: #fff;
  border-radius: 20px 20px 0 0;
  padding: 24px;
  width: 100%;
  max-height: 90dvh;
  overflow: auto;
  color: #003e63;
  box-sizing: border-box;
}
header,
footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}
header button {
  border: 0;
  background: none;
  font-size: 24px;
  color: inherit;
}
form {
  display: grid;
  gap: 17px;
}
label {
  display: grid;
  gap: 6px;
  font-weight: 600;
}
input:not([type='checkbox']),
textarea,
select {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #b3c5d1;
  border-radius: 7px;
  padding: 11px;
  font: inherit;
  color: #153f57;
}
.checkbox {
  display: flex;
  flex-direction: row;
  align-items: center;
}
footer button {
  padding: 11px 16px;
  border: 1px solid #004369;
  border-radius: 7px;
  background: #004369;
  color: white;
  cursor: pointer;
}
footer .secondary {
  background: white;
  color: #004369;
}
.error {
  color: #b3261e;
}
.delete-project {
  margin-top: 24px;
  border-top: 1px solid #c5d7e1;
  padding-top: 16px;
}
.delete-project p {
  font-size: 13px;
}
.delete-project button {
  border: 1px solid #b32634;
  border-radius: 8px;
  background: white;
  color: #b32634;
  padding: 11px 16px;
  font: inherit;
  cursor: pointer;
  margin-top: 8px;
}
@media (min-width: 768px) {
  .edit-project-overlay {
    align-items: center;
    padding: 30px;
  }
  .edit-project-dialog {
    max-width: 640px;
    border-radius: 18px;
    padding: 32px;
  }
}
</style>
