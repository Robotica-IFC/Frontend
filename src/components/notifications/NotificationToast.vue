<script setup>
import { onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/authStore'
import { useNotificationsStore } from '@/store/notificationsStore'

const auth = useAuthStore()
const store = useNotificationsStore()
const router = useRouter()
let timer
function refresh() {
  if (auth.isAuthenticated && document.visibilityState === 'visible') {
    store.refreshCount().catch(() => {})
  }
}
watch(() => auth.user?.user_id, () => {
  store.clear()
  refresh()
}, { flush: 'sync' })
onMounted(() => {
  refresh()
  timer = window.setInterval(refresh, 30000)
  document.addEventListener('visibilitychange', refresh)
})
onUnmounted(() => {
  window.clearInterval(timer)
  document.removeEventListener('visibilitychange', refresh)
})
function openNotifications() {
  store.dismissToast()
  router.push({ name: 'notifications' })
}
</script>

<template>
  <aside v-if="auth.isAuthenticated && store.toast" class="notification-toast" aria-label="Aviso de notificações">
    <i class="mdi mdi-bell-ring-outline toast-icon" aria-hidden="true"></i>
    <div class="toast-content">
      <div role="status" aria-live="polite">
        <strong>Você tem notificações</strong>
        <p>{{ store.unread === 1 ? 'Há uma atividade não lida nas suas equipes.' : `Há ${store.unread} atividades não lidas nas suas equipes.` }}</p>
      </div>
      <button type="button" class="open-notifications" @click="openNotifications">Ver notificações <i class="mdi mdi-arrow-right" aria-hidden="true"></i></button>
    </div>
    <button type="button" class="dismiss-toast" aria-label="Fechar aviso" @click="store.dismissToast()">&times;</button>
  </aside>
</template>

<style scoped>
.notification-toast { position:fixed; bottom:24px; right:24px; z-index:1100; display:flex; gap:12px; width:360px; max-width:calc(100vw - 32px); box-sizing:border-box; padding:18px; border:1px solid #c4dce9; border-left:4px solid #d53b4c; border-radius:14px; background:#fff; color:#003f63; box-shadow:0 8px 32px #003f6326; }
.toast-icon { font-size:27px; color:#d53b4c; }
.toast-content { min-width:0; flex:1; }
strong { font-size:15px; }
p { margin:7px 0 12px; color:#627e90; font-size:13px; line-height:1.5; }
button { font:inherit; cursor:pointer; border:0; }
.open-notifications { min-height:36px; padding:7px 10px; background:#edf5fb; color:#004369; border-radius:7px; font-size:13px; font-weight:600; }
.dismiss-toast { background:transparent; color:#627e90; font-size:25px; width:28px; height:32px; padding:0; }
button:focus-visible { outline:3px solid #3184b4; outline-offset:3px; }
@media(max-width:600px) { .notification-toast { right:16px; bottom:20px; } }
</style>
