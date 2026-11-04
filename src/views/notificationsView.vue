<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useInvitesStore } from '@/store/invitesStore'

const store = useInvitesStore()
const router = useRouter()
let timer
function refresh() { store.refresh().catch(() => {}) }
onMounted(() => {
  refresh()
  timer = window.setInterval(refresh, 30000)
})
onUnmounted(() => { if (timer) window.clearInterval(timer) })
async function respond(invite, accept) {
  try {
    await store.respond(invite.id, accept)
  } catch {
    // O erro é apresentado na tela, sem ocultar o convite.
    store.error = 'Não foi possível responder ao convite.'
  }
}
function openTeam(invite) { router.push({ name: 'teamDetails', params: { id: invite.equipe } }) }
</script>
<template>
  <main class="notifications-page">
    <header><i class="mdi mdi-bell-outline" /><div><h1>Notificações</h1><p>Convites recebidos para participar de equipes.</p></div></header>
    <p v-if="store.loading" role="status">Carregando convites...</p>
    <p v-if="store.error" role="alert" class="error">{{ store.error }}</p>
    <section class="invites">
      <article v-for="invite in store.invites" :key="invite.id" class="invite">
        <div class="invite-heading"><i class="mdi mdi-account-group-outline"/><span :class="['status', invite.status === 'P' ? 'pending' : '']">{{ invite.status === 'P' ? 'Pendente' : invite.status === 'A' ? 'Aceito' : 'Recusado' }}</span></div>
        <h2>{{ invite.equipe_nome || 'Equipe' }}</h2>
        <p>Convite enviado por {{ invite.convidante_nome || 'um professor' }} para participar desta equipe.</p>
        <div class="actions" v-if="invite.status === 'P'">
          <button class="secondary" type="button" @click="respond(invite, false)"><i class="mdi mdi-close"/> Recusar</button>
          <button type="button" @click="respond(invite, true)"><i class="mdi mdi-check"/> Aceitar</button>
        </div>
        <button v-else type="button" class="team-link" @click="openTeam(invite)">Ver equipe <i class="mdi mdi-arrow-right" /></button>
      </article>
      <p v-if="!store.loading && !store.invites.length" class="empty">Você ainda não recebeu convites.</p>
    </section>
  </main>
</template>
<style scoped>
.notifications-page{width:100%;max-width:980px;margin:0 auto;padding:28px 16px 90px;box-sizing:border-box;color:#003f63}
header{display:flex;gap:14px;align-items:center;margin:20px 0 28px}header>.mdi{font-size:32px}h1{font-size:25px;margin:0}header p{margin:6px 0 0;font-size:13px;color:#627e90}
.invites{display:grid;gap:14px}.invite{background:#fff;border:1px solid #d5e1e8;box-shadow:0 4px 12px #00436912;border-radius:12px;padding:18px}
.invite-heading{display:flex;justify-content:space-between;align-items:center}.invite-heading .mdi{font-size:22px}.status{font-size:11px;background:#e4f1ef;border-radius:20px;padding:5px 9px}.status.pending{background:#f9ecd0}
h2{font-size:18px;margin:8px 0}.invite>p{font-size:13px;color:#577386}.actions{display:flex;gap:10px;margin-top:18px}.actions button,.team-link{border:1px solid #004369;background:#004369;color:#fff;border-radius:8px;padding:10px 14px;cursor:pointer;font:inherit;font-size:13px}.actions .secondary{background:#fff;color:#004369}
.team-link{margin-top:10px}.empty{text-align:center;padding:40px;color:#648091}.error{color:#ad2434}
@media(min-width:768px){.notifications-page{padding:80px 40px}.invites{grid-template-columns:repeat(2,minmax(0,1fr))}.invite{padding:24px}h1{font-size:30px}}
</style>
