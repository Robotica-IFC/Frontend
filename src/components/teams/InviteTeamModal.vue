<script setup>
import { computed, ref } from 'vue'
import { useInvitesStore } from '@/store/invitesStore'
import studentsApi from '@/api/studentApi'
import teacherApi from '@/api/teacherApi'

const props = defineProps({ team: { type: Object, required: true } })
const emit = defineEmits(['close', 'sent'])
const invites = useInvitesStore()
const kind = ref('aluno')
const search = ref('')
const results = ref([])
const loading = ref(false)
const sending = ref(null)
const error = ref('')
const success = ref('')
const candidates = computed(() => results.value.filter(person => {
  const members = kind.value === 'aluno' ? props.team.alunos : props.team.professores
  return !(members || []).some(member => member.id === person.id)
}))
async function find() {
  error.value = ''
  success.value = ''
  results.value = []
  if (search.value.trim().length < 2) return
  loading.value = true
  try {
    const api = kind.value === 'aluno' ? studentsApi : teacherApi
    const { data } = await api.search(search.value.trim())
    results.value = Array.isArray(data) ? data : (data.results || data.items || [])
  } catch { error.value = 'Erro ao pesquisar usuários.' }
  finally { loading.value = false }
}
function switchKind(next) {
  kind.value = next
  search.value = ''
  results.value = []
  error.value = ''
  success.value = ''
}
async function send(person) {
  sending.value = person.id
  error.value = ''
  success.value = ''
  try {
    await invites.send(props.team.id, kind.value, person.id)
    success.value = 'Convite enviado para ' + (person.user?.name || person.user?.username || 'usuário') + '.'
    results.value = results.value.filter(p => p.id !== person.id)
    emit('sent')
  } catch (err) {
    error.value = err.response?.data?.non_field_errors?.[0] || err.response?.data?.detail || 'Não foi possível enviar o convite.'
  } finally { sending.value = null }
}
</script>
<template>
  <div class="overlay" @click.self="emit('close')">
    <section class="dialog" role="dialog" aria-modal="true" aria-labelledby="invites-title">
      <header>
        <h2 id="invites-title"><i class="mdi mdi-account-plus-outline" /> Convidar para equipe</h2>
        <button type="button" aria-label="Fechar" @click="emit('close')"><i class="mdi mdi-close"/></button>
      </header>
      <p>O participante receberá um convite e só entrará depois que aceitar.</p>
      <div class="tabs" role="group" aria-label="Tipo de participante">
        <button type="button" :class="{ active: kind === 'aluno' }" @click="switchKind('aluno')">Alunos</button>
        <button type="button" :class="{ active: kind === 'professor' }" @click="switchKind('professor')">Professores</button>
      </div>
      <label for="invite-search">Pesquisar por nome ou usuário</label>
      <div class="search"><input id="invite-search" v-model="search" placeholder="Digite ao menos 2 caracteres" @input="find" /><i class="mdi mdi-magnify" /></div>
      <p v-if="loading" role="status">Buscando...</p>
      <p v-if="error" role="alert" class="error">{{ error }}</p>
      <p v-if="success" role="status" class="success">{{ success }}</p>
      <div class="results">
        <div v-for="person in candidates" :key="person.id" class="person">
          <span><strong>{{ person.user?.name || person.user?.username || 'Usuário' }}</strong><small>@{{ person.user?.username || 'sem usuário' }}</small></span>
          <button type="button" :disabled="sending !== null" @click="send(person)"><i class="mdi mdi-send-outline"/> Convidar</button>
        </div>
        <p v-if="search.length >= 2 && !loading && !candidates.length">Nenhum usuário disponível nessa pesquisa.</p>
      </div>
    </section>
  </div>
</template>
<style scoped>
.overlay{position:fixed;inset:0;background:#0008;z-index:1100;display:flex;justify-content:center;align-items:flex-end}
.dialog{width:100%;max-height:90dvh;overflow:auto;background:white;color:#003f63;border-radius:20px 20px 0 0;padding:24px;box-sizing:border-box}
header{display:flex;justify-content:space-between;align-items:center;gap:12px}header h2{font-size:20px;display:flex;align-items:center;gap:8px}
header>button{border:0;background:none;color:inherit;font-size:24px;cursor:pointer}
.dialog>p{font-size:13px;color:#476579}.tabs{display:flex;gap:8px;margin:18px 0}.tabs button{flex:1;padding:10px;border:1px solid #00507b;background:white;color:#00507b;border-radius:8px;cursor:pointer}.tabs button.active{background:#00507b;color:white}
label{display:block;font-weight:600;margin-bottom:8px}.search{position:relative}.search input{width:100%;box-sizing:border-box;padding:12px 38px 12px 12px;border-radius:8px;border:1px solid #acc2d1;font:inherit}.search i{position:absolute;right:13px;top:12px}
.results{display:grid;gap:8px;margin-top:16px}.person{display:flex;gap:10px;align-items:center;justify-content:space-between;padding:12px;border:1px solid #d9e4e9;border-radius:10px}.person span{display:grid;gap:4px;min-width:0}.person small{color:#698292}.person button{background:#00507b;color:#fff;border:0;border-radius:7px;padding:9px;cursor:pointer;white-space:nowrap}
.error{color:#a52323!important}.success{color:#187442!important}
@media(min-width:768px){.overlay{align-items:center;padding:24px}.dialog{max-width:620px;border-radius:18px;padding:32px}}
</style>
