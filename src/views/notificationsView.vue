<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useInvitesStore } from '@/store/invitesStore'

const store = useInvitesStore()
const router = useRouter()
const feedback = ref('')
const acceptedTeam = ref(null)
let timer
function refresh() { store.refresh().catch(() => {}) }
onMounted(() => {
  refresh()
  timer = window.setInterval(refresh, 30000)
})
onUnmounted(() => { if (timer) window.clearInterval(timer) })
async function respond(invite, accept) {
  feedback.value = ''
  acceptedTeam.value = null
  try {
    if (!await store.respond(invite.id, accept)) return
    feedback.value = accept ? `Você entrou na equipe ${invite.equipe_nome || ''}.` : 'Convite recusado.'
    if (accept) acceptedTeam.value = invite.equipe
  } catch {
    // A store mantém o convite e apresenta o erro da API.
  }
}
function openTeam(invite) { router.push({ name: 'teamDetails', params: { id: invite.equipe } }) }
</script>
<template>
  <div class="notifications-page">
    <header><i class="mdi mdi-bell-outline" /><div><h1>Notificações</h1><p>Convites recebidos para participar de equipes.</p></div></header>
    <div class="list-heading"><h2>Pendentes <span class="count">{{ store.unread }}</span></h2><button class="refresh-button" type="button" :disabled="store.loading" @click="refresh"><i class="mdi mdi-refresh" aria-hidden="true" /> Atualizar</button></div>
    <div v-if="feedback" class="feedback" role="status"><i class="mdi mdi-check-circle-outline" aria-hidden="true" /><p>{{ feedback }}</p><button v-if="acceptedTeam" type="button" @click="router.push({ name: 'teamDetails', params: { id: acceptedTeam } })">Ver equipe <i class="mdi mdi-arrow-right" aria-hidden="true" /></button></div>
    <p v-if="store.loading && !store.invites.length" role="status">Carregando convites...</p>
    <p v-if="store.error" role="alert" class="error">{{ store.error }}</p>
    <section class="invites">
      <article v-for="invite in store.invites" :key="invite.id" class="invite">
        <div class="invite-heading"><i class="mdi mdi-account-group-outline" aria-hidden="true"/><span class="status pending">Convite para equipe</span></div>
        <h2>{{ invite.equipe_nome || 'Equipe' }}</h2>
        <p><strong>{{ invite.convidante_nome || 'Um professor' }}</strong> convidou você para participar desta equipe.</p>
        <div class="actions" v-if="invite.status === 'P'">
          <button class="secondary" type="button" :disabled="store.responding.includes(invite.id)" @click="respond(invite, false)"><i class="mdi mdi-close"/> Recusar</button>
          <button type="button" :disabled="store.responding.includes(invite.id)" @click="respond(invite, true)"><i class="mdi mdi-check"/> {{ store.responding.includes(invite.id) ? 'Enviando...' : 'Aceitar convite' }}</button>
        </div>
        <button v-else type="button" class="team-link" @click="openTeam(invite)">Ver equipe <i class="mdi mdi-arrow-right" /></button>
      </article>
      <div v-if="!store.loading && !store.invites.length && !store.error" class="empty"><i class="mdi mdi-bell-check-outline" aria-hidden="true"/><h2>Tudo em dia!</h2><p>Você não tem convites pendentes. Novos convites aparecerão aqui.</p></div>
    </section>
  </div>
</template>
<style scoped>
.notifications-page {
  width:100%;
  max-width:980px;
  margin:0 auto;
  padding:84px 16px 90px;
  box-sizing:border-box;
  color:#003f63
}
header {
  display:flex;
  gap:14px;
  align-items:center;
  margin:20px 0 28px
}
header>.mdi {
  font-size:32px
}
h1 {
  font-size:25px;
  margin:0
}
header p {
  margin:6px 0 0;
  font-size:13px;
  color:#627e90
}
.invites {
  display:grid;
  gap:14px
}
.invite {
  background:#fff;
  border:1px solid #d5e1e8;
  box-shadow:0 4px 12px #00436912;
  border-radius:16px;
  padding:20px;
  min-width:0;
  display:flex;
  flex-direction:column
}
.invite-heading {
  display:flex;
  justify-content:space-between;
  align-items:center
}
.invite-heading .mdi {
  font-size:22px
}
.status {
  font-size:11px;
  background:#e4f1ef;
  border-radius:20px;
  padding:5px 9px
}
.status.pending {
  background:#f9ecd0
}
h2 {
  font-size:18px;
  margin:8px 0
}
.invite>p {
  font-size:13px;
  color:#577386
}
.actions {
  display:flex;
  gap:10px;
  margin-top:auto;
  padding-top:18px;
  flex-wrap:wrap
}
.actions button,.team-link {
  border:1px solid #004369;
  background:#004369;
  color:#fff;
  border-radius:8px;
  padding:10px 14px;
  cursor:pointer;
  font:inherit;
  font-size:13px
}
.actions .secondary {
  background:#fff;
  color:#004369
}
.team-link {
  margin-top:10px
}
.empty {
  text-align:center;
  padding:40px;
  color:#648091
}
.error {
  color:#ad2434
}
.list-heading { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:16px; }
.list-heading h2 { display:flex; align-items:center; gap:8px; font-size:16px; }
.count { padding:3px 8px; border-radius:16px; background:#e8f3f9; font-size:12px; }
.refresh-button,.feedback button { display:inline-flex; align-items:center; justify-content:center; gap:6px; min-height:44px; border:1px solid #cfdee8; border-radius:9px; background:white; color:#004369; padding:10px 12px; font:inherit; font-size:13px; cursor:pointer; }
.actions button { flex:1 1 110px; min-height:44px; }
button:disabled { opacity:.6; cursor:wait; }
button:focus-visible { outline:3px solid #3184b4; outline-offset:3px; }
.invite h2,.invite p { overflow-wrap:anywhere; line-height:1.6; }
.invite-heading > .mdi { display:grid; place-items:center; width:44px; height:44px; border-radius:12px; background:#edf5fa; }
.feedback { display:flex; align-items:center; flex-wrap:wrap; gap:10px; padding:14px; margin-bottom:16px; border:1px solid #b9dcc8; border-radius:12px; background:#eaf7ef; color:#22603e; font-size:14px; }
.feedback p { flex:1; min-width:150px; overflow-wrap:anywhere; }
.feedback > .mdi { font-size:23px; }
.empty { grid-column:1/-1; border:1px dashed #c3d5e1; border-radius:16px; background:#f7fafc; }
.empty > .mdi { font-size:46px; }
.empty p { max-width:320px; margin:8px auto 0; line-height:1.6; font-size:14px; }
@media(min-width:768px) {
  .notifications-page {
    padding:80px 40px
  }
  .invites {
    grid-template-columns:repeat(2,minmax(0,1fr))
  }
  .invite {
    padding:24px
  }
  h1 {
    font-size:30px
  }
}
</style>
