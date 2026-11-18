<script setup>
import { RouterView, useRoute } from 'vue-router';
import appHeaderComponent from "@/components/layout/appHeaderComponent.vue";
import appFooterComponent from "@/components/layout/appFooterComponent.vue"
import ConfirmActionModal from '@/components/ConfirmActionModal.vue'
import NotificationToast from '@/components/notifications/NotificationToast.vue'
import { useConfirmation } from '@/composables/useConfirmation'
import { watch, watchEffect } from 'vue'
import { useTemplateStore } from '@/store/template'
const { pending, busy, error, accept, cancel } = useConfirmation()

// Pega as informações da página que está ativa no momento
const route = useRoute();
watch(() => route.fullPath, cancel)

const templateStore = useTemplateStore()
watchEffect(() => {
  const publicPage = route.meta.hideHeader && route.meta.hideFooter
  const dark = route.matched.length > 0 && !publicPage && templateStore.darkMode
  if (dark) document.documentElement.dataset.theme = 'dark'
  else delete document.documentElement.dataset.theme
})
</script>

<template>
  <appHeaderComponent v-if="!route.meta.hideHeader" />

  <main :class="{ 'no-header': route.meta.hideHeader }">
    <RouterView />
  </main>

  <appFooterComponent v-if="!route.meta.hideFooter"></appFooterComponent>
  <NotificationToast />
  <ConfirmActionModal v-if="pending" :title="pending.title" :message="pending.message"
    :confirm-label="pending.confirmLabel" :cancel-label="pending.cancelLabel"
    :busy-label="pending.busyLabel" :danger="pending.danger" :busy="busy" :error="error"
    @confirm="accept" @cancel="cancel" />
</template>

<style scoped src="./App.css"></style>
