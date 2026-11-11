<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useNotificationsStore } from '@/store/notificationsStore'
import ActivityNotifications from '@/components/notifications/ActivityNotifications.vue'

const store = useNotificationsStore()
let timer
function refresh() {
  store.refresh().catch(() => {})
}
function refreshVisible() {
  if (document.visibilityState === 'visible') refresh()
}
onMounted(() => {
  refresh()
  timer = window.setInterval(refreshVisible, 30000)
  document.addEventListener('visibilitychange', refreshVisible)
})
onUnmounted(() => {
  window.clearInterval(timer)
  document.removeEventListener('visibilitychange', refreshVisible)
})
</script>

<template>
  <div class="notifications-page">
    <header>
      <i class="mdi mdi-bell-outline" aria-hidden="true"></i>
      <div><h1>Notificações</h1><p>Acompanhe os projetos e publicações das suas equipes.</p></div>
      <button class="refresh-button" type="button" :disabled="store.loading" @click="refresh">
        <i class="mdi mdi-refresh" aria-hidden="true"></i> Atualizar
      </button>
    </header>
    <ActivityNotifications />
  </div>
</template>

<style scoped>
.notifications-page {
  width:100%;
  max-width:980px;
  margin:0 auto;
  padding:84px 16px 90px;
  box-sizing:border-box;
  color:#003f63;
}
header { display:flex; flex-wrap:wrap; gap:14px; align-items:center; margin:20px 0 28px; }
header>.mdi { font-size:32px; }
h1 { font-size:25px; margin:0; }
header p { margin:6px 0 0; font-size:13px; color:#627e90; }
.refresh-button {
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:6px;
  margin-left:auto;
  min-height:44px;
  border:1px solid #cfdee8;
  border-radius:9px;
  background:white;
  color:#004369;
  padding:10px 12px;
  font:inherit;
  font-size:13px;
  cursor:pointer;
}
button:disabled { opacity:.6; cursor:wait; }
button:focus-visible { outline:3px solid #3184b4; outline-offset:3px; }
@media(min-width:768px) {
  .notifications-page { padding:80px 40px; }
  h1 { font-size:30px; }
}
</style>
