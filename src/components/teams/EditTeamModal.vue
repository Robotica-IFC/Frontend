<script setup>
import { computed, ref, watch } from 'vue'
import { useTeamStore } from '@/store/teamStore'
import { useAuthStore } from '@/store/authStore'

const props = defineProps({ team: { type: Object, required: true } })
const emit = defineEmits(['close', 'saved'])
const store = useTeamStore()
const auth = useAuthStore()
const nome = ref('')
const descricao = ref('')
const categorias = ref([])
const allCategories = ref([])
const search = ref('')
const file = ref(undefined)
const saving = ref(false)
const removing = ref(null)
const error = ref('')
const isCreator = computed(() => Boolean(props.team.criador && props.team.professores?.some(p =>
  p.id === props.team.criador && p.user?.id === auth.user?.user_id
)))
const canEdit = computed(() => Boolean(props.team.professores?.some(p => p.user?.id === auth.user?.user_id)))
const filtered = computed(() => allCategories.value.filter(c => c.nome.toLocaleLowerCase('pt-BR').includes(search.value.toLocaleLowerCase('pt-BR'))))
watch(() => props.team, (team) => {
  nome.value = team.nome || ''
  descricao.value = team.descricao || ''
  categorias.value = (team.categorias || []).map(c => c.id)
}, { immediate: true })
store.getCategories().then(data => { allCategories.value = data }).catch(() => {})
function toggle(id) {
  categorias.value = categorias.value.includes(id) ? categorias.value.filter(c => c !== id) : [...categorias.value, id]
}
async function save() {
  if (!canEdit.value || !nome.value.trim()) return
  saving.value = true
  error.value = ''
  try {
    await store.updateTeam(props.team.id, {
      nome: nome.value.trim(), descricao: descricao.value.trim(), categorias: categorias.value
    }, file.value)
    emit('saved')
    emit('close')
  } catch (err) {
    error.value = err.response?.data?.detail || 'Erro ao salvar alterações da equipe.'
  } finally { saving.value = false }
}
async function removeMember(member, type) {
  if (!isCreator.value || (type === 'professor' && member.id === props.team.criador)) return
  if (!window.confirm('Remover ' + (member.user?.name || 'este participante') + ' da equipe?')) return
  removing.value = member.id
  error.value = ''
  try {
    await store.removeMember(props.team.id, member.id, type)
    emit('saved')
  } catch (err) {
    error.value = err.response?.data?.detail || 'Não foi possível remover o participante.'
  } finally { removing.value = null }
}
</script>
<template>
  <div class="overlay" @click.self="emit('close')">
    <section class="dialog" role="dialog" aria-modal="true" aria-labelledby="team-edit-title">
      <header><h2 id="team-edit-title">Editar equipe</h2><button type="button" aria-label="Fechar" @click="emit('close')"><i class="mdi mdi-close"/></button></header>
      <form @submit.prevent="save">
        <label class="image-picker">
          <img v-if="team.image_perfil?.url" :src="team.image_perfil.url" alt="Foto atual da equipe"/>
          <i v-else class="mdi mdi-account-group" />
          <span class="mdi mdi-pencil-outline" />
          <input type="file" accept="image/*" @change="file = $event.target.files[0]" />
        </label>
        <label>Nome da equipe<input v-model="nome" maxlength="50" required /></label>
        <label>Descrição<textarea v-model="descricao" maxlength="1000" rows="4"/></label>
        <label>Categorias<input v-model="search" placeholder="Buscar categoria"/></label>
        <div class="category-list">
          <label v-for="category in filtered" :key="category.id">
            <input type="checkbox" :checked="categorias.includes(category.id)" @change="toggle(category.id)"/> {{ category.nome }}
          </label>
        </div>
        <footer><button type="button" class="secondary" @click="emit('close')">Cancelar</button><button type="submit" :disabled="saving || !canEdit">{{ saving ? 'Salvando...' : 'Salvar equipe' }}</button></footer>
      </form>
      <section class="members">
        <h3>Gerenciar participantes</h3>
        <p class="hint">Convites são enviados pela opção Convidar, acima da lista de participantes. Aqui é possível somente remover membros.</p>
        <h4>Professores</h4>
        <div v-for="professor in team.professores || []" :key="professor.id" class="member">
          <span>{{ professor.user?.name || professor.user?.username || 'Professor' }} <small v-if="professor.id === team.criador">(criador)</small></span>
          <button v-if="isCreator && professor.id !== team.criador" type="button" :disabled="removing !== null" :aria-label="'Remover ' + professor.user?.name" @click="removeMember(professor, 'professor')"><i class="mdi mdi-trash-can-outline"/></button>
          <i v-else-if="professor.id === team.criador" class="mdi mdi-lock-outline" aria-label="Criador protegido"/>
        </div>
        <h4>Alunos</h4>
        <div v-for="aluno in team.alunos || []" :key="aluno.id" class="member">
          <span>{{ aluno.user?.name || aluno.user?.username || 'Aluno' }}</span>
          <button v-if="isCreator" type="button" :disabled="removing !== null" :aria-label="'Remover ' + aluno.user?.name" @click="removeMember(aluno, 'aluno')"><i class="mdi mdi-trash-can-outline"/></button>
        </div>
      </section>
      <p v-if="error" role="alert" class="error">{{ error }}</p>
    </section>
  </div>
</template>
<style scoped>
.overlay{position:fixed;inset:0;z-index:1050;background:#0008;display:flex;justify-content:center;align-items:flex-end}
.dialog{background:white;color:#003f63;border-radius:20px 20px 0 0;width:100%;max-height:92dvh;overflow:auto;padding:22px;box-sizing:border-box}
header,footer{display:flex;align-items:center;justify-content:space-between;gap:12px}header h2{font-size:20px}
header button{border:0;background:none;font-size:22px;color:inherit;cursor:pointer}
form{display:grid;gap:15px}form>label{display:grid;gap:7px;font-weight:600}
input:not([type=checkbox]):not([type=file]),textarea{width:100%;box-sizing:border-box;border:1px solid #aac2d2;border-radius:8px;padding:11px;font:inherit;color:#003f63}
.image-picker{width:90px;height:90px;border-radius:50%;background:#deedf5;position:relative;display:grid;place-items:center;justify-self:center;cursor:pointer}
.image-picker img{width:100%;height:100%;object-fit:cover;border-radius:50%}.image-picker>.mdi{font-size:28px}.image-picker .mdi-pencil-outline{position:absolute;bottom:0;right:0;background:white;padding:5px;border-radius:50%;font-size:16px}.image-picker input{display:none}
.category-list{display:flex;flex-wrap:wrap;gap:8px;max-height:120px;overflow:auto}.category-list label{display:flex;align-items:center;gap:6px;border:1px solid #c4d5df;border-radius:7px;padding:7px;font-size:13px}
footer button{border:1px solid #004369;background:#004369;color:white;border-radius:7px;padding:11px 13px;cursor:pointer}footer .secondary{background:white;color:#004369}
.members{margin-top:24px;border-top:1px solid #c5d7e1;padding-top:12px}.members h3{font-size:18px}.members h4{font-size:14px;margin:16px 0 8px}
.hint{font-size:12px;color:#5a7585}.member{display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #e3ebf0;padding:10px 0;gap:10px}.member small{font-size:11px;color:#617b8a}
.member button{border:0;background:none;color:#aa2332;font-size:21px;cursor:pointer}.member .mdi-lock-outline{color:#6790a2}.error{color:#a52323}
@media(min-width:768px){.overlay{align-items:center;padding:25px}.dialog{max-width:640px;border-radius:18px;padding:32px;max-height:88dvh}}
</style>
