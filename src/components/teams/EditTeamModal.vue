<script setup>
import { computed, ref, watch } from 'vue'
import { useTeamStore } from '@/store/teamStore'
import { useAuthStore } from '@/store/authStore'
import studentsApi from '@/api/studentApi'

const props = defineProps({ team: { type: Object, required: true } })
const emit = defineEmits(['close', 'saved'])
const store = useTeamStore()
const auth = useAuthStore()
const nome = ref('')
const descricao = ref('')
const categories = ref([])
const teachers = ref([])
const students = ref([])
const allCategories = ref([])
const search = ref('')
const file = ref(undefined)
const saving = ref(false)
const error = ref('')
const studentSearch = ref('')
const studentsFound = ref([])
const searchLoading = ref(false)

watch(() => props.team, (team) => {
  nome.value = team.nome || ''
  descricao.value = team.descricao || ''
  categories.value = (team.categorias || []).map(item => item.id)
  teachers.value = (team.professores || []).map(item => item.id)
  students.value = (team.alunos || []).map(item => item.id)
}, { immediate: true })

store.getCategories().then(data => { allCategories.value = data }).catch(() => {})
const filtered = computed(() => allCategories.value.filter(c => c.nome.toLowerCase().includes(search.value.toLowerCase())))
async function findStudents() {
  if (!studentSearch.value.trim()) { studentsFound.value = []; return }
  searchLoading.value = true
  try {
    const { data } = await studentsApi.search(studentSearch.value)
    studentsFound.value = (data.results || data.items || data || []).filter(item => !students.value.includes(item.id))
  } catch { error.value = 'Não foi possível buscar alunos.' }
  finally { searchLoading.value = false }
}
const canEdit = computed(() => {
  const uid = auth.user?.user_id
  return Boolean(uid && props.team.professores?.some(p => p.user?.id === uid))
})
function toggleCategory(id) {
  categories.value = categories.value.includes(id) ? categories.value.filter(c => c !== id) : [...categories.value, id]
}
async function save() {
  if (!canEdit.value || !nome.value.trim()) return
  saving.value = true
  error.value = ''
  try {
    await store.updateTeam(props.team.id, {
      nome: nome.value.trim(),
      descricao: descricao.value.trim(),
      categorias: categories.value,
      professores: teachers.value,
      alunos: students.value
    }, file.value)
    emit('saved')
    emit('close')
  } catch (e) {
    error.value = typeof e.response?.data?.detail === 'string' ? e.response.data.detail : 'Não foi possível atualizar a equipe.'
  } finally { saving.value = false }
}
</script>

<template>
  <div class="edit-team-overlay" @click.self="$emit('close')">
    <section class="edit-team-dialog" role="dialog" aria-modal="true" aria-labelledby="edit-team-title">
      <header class="modal-title">
        <h2 id="edit-team-title">Editar equipe</h2>
        <button type="button" aria-label="Fechar" @click="$emit('close')"><i class="mdi mdi-close"/></button>
      </header>
      <form @submit.prevent="save">
        <label class="avatar-picker">
          <img v-if="team.image_perfil?.url" :src="team.image_perfil.url" alt="Imagem atual da equipe" />
          <i v-else class="mdi mdi-account-group"/>
          <span class="mdi mdi-pencil"/>
          <input type="file" accept="image/*" @change="file = $event.target.files[0]" />
        </label>
        <label>Nome da equipe <input v-model="nome" maxlength="50" required /></label>
        <label>Descrição <textarea v-model="descricao" maxlength="1000" rows="5" /></label>
        <h3>Categorias</h3>
        <input v-model="search" placeholder="Buscar categorias" aria-label="Buscar categorias" />
        <div class="category-list">
          <label v-for="c in filtered" :key="c.id">
            <input type="checkbox" :checked="categories.includes(c.id)" @change="toggleCategory(c.id)" />{{ c.nome }}
          </label>
        </div>
        <h3>Membros da equipe</h3>
        <div class="member-list">
          <div v-for="aluno in team.alunos.filter(a => students.includes(a.id))" :key="aluno.id" class="member-row">
            <span>{{ aluno.user?.name || aluno.user?.username }}</span>
            <button type="button" aria-label="Remover aluno" @click="students = students.filter(id => id !== aluno.id)"><i class="mdi mdi-delete-outline"/></button>
          </div>
          <div v-for="aluno in studentsFound.filter(a => students.includes(a.id))" :key="aluno.id" class="member-row">
            <span>{{ aluno.user?.name || aluno.user?.username }}</span>
            <button type="button" aria-label="Remover aluno" @click="students = students.filter(id => id !== aluno.id)"><i class="mdi mdi-delete-outline"/></button>
          </div>
        </div>
        <div class="member-search">
          <label for="student-search">Adicionar aluno</label>
          <div class="member-search-field">
            <input id="student-search" v-model="studentSearch" placeholder="Buscar pelo nome" @input="findStudents"/>
            <i class="mdi mdi-magnify"/>
          </div>
          <p v-if="searchLoading">Buscando...</p>
          <div v-for="aluno in studentsFound.filter(a => !students.includes(a.id))" :key="aluno.id" class="member-row">
            <span>{{ aluno.user?.name || aluno.user?.username }}</span>
            <button type="button" :aria-label="'Adicionar ' + aluno.user?.name" @click="students.push(aluno.id)"><i class="mdi mdi-plus"/></button>
          </div>
        </div>
        <p class="hint">Apenas professores da equipe podem salvar alterações. Professores atuais são preservados.</p>
        <p v-if="error" role="alert" class="error">{{ error }}</p>
        <footer>
          <button type="button" class="secondary" @click="$emit('close')">Cancelar</button>
          <button type="submit" :disabled="saving || !canEdit">{{ saving ? 'Salvando...' : 'Salvar alterações' }}</button>
        </footer>
      </form>
    </section>
  </div>
</template>
<style scoped>
.edit-team-overlay{position:fixed;inset:0;background:#0008;z-index:1000;display:flex;justify-content:center;align-items:flex-end}
.edit-team-dialog{width:100%;max-height:92dvh;overflow:auto;background:#fff;border-radius:20px 20px 0 0;padding:24px;color:#093f64;box-sizing:border-box}
.modal-title,footer{display:flex;align-items:center;justify-content:space-between;gap:12px}
.modal-title button{border:0;background:none;color:inherit;font-size:22px;cursor:pointer}
form{display:grid;gap:18px}
form>label{display:grid;gap:7px;font-weight:600}
input:not([type=checkbox]):not([type=file]),textarea{box-sizing:border-box;width:100%;border:1px solid #9db5c7;border-radius:7px;padding:12px;font:inherit;color:#123e5b}
.avatar-picker{width:100px;height:100px;border-radius:50%;position:relative;justify-self:center;background:#e8f1f7;display:grid;place-items:center;cursor:pointer}
.avatar-picker img{width:100%;height:100%;object-fit:cover;border-radius:50%}
.avatar-picker>.mdi{font-size:32px}.avatar-picker .mdi-pencil{position:absolute;right:0;bottom:0;font-size:18px;background:white;border-radius:50%;padding:5px}
.avatar-picker input{display:none}
.category-list{max-height:140px;overflow:auto;display:flex;flex-wrap:wrap;gap:8px}.category-list label{border:1px solid #b5ccd9;padding:8px;border-radius:8px;display:flex;gap:5px;align-items:center}
.hint{font-size:12px;color:#547085}
.member-list,.member-search{display:grid;gap:10px}
.member-row{display:flex;justify-content:space-between;align-items:center;gap:12px;border-bottom:1px solid #cad9e4;padding:8px}
.member-row button{border:none;background:transparent;color:#004369;font-size:20px;cursor:pointer}
.member-search-field{position:relative}.member-search-field>.mdi{position:absolute;right:12px;top:12px}
.error{color:#b3261e}
footer button{border:1px solid #004369;border-radius:6px;padding:11px 15px;background:#004369;color:#fff;cursor:pointer}footer .secondary{background:#fff;color:#004369}
@media(min-width:768px){.edit-team-overlay{align-items:center;padding:30px}.edit-team-dialog{max-width:680px;max-height:85dvh;border-radius:18px;padding:32px}}
</style>
