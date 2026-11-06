<script setup>
import { RouterView, useRoute } from 'vue-router';
import appHeaderComponent from "@/components/layout/appHeaderComponent.vue";
import appFooterComponent from "@/components/layout/appFooterComponent.vue"
import ConfirmActionModal from '@/components/ConfirmActionModal.vue'
import { useConfirmation } from '@/composables/useConfirmation'
import { watch } from 'vue'
const { pending, busy, error, accept, cancel } = useConfirmation()

// Pega as informações da página que está ativa no momento
const route = useRoute();
watch(() => route.fullPath, cancel)
</script>

<template>
  <appHeaderComponent v-if="!route.meta.hideHeader" />

  <main :class="{ 'no-header': route.meta.hideHeader }">
    <RouterView />
  </main>

  <appFooterComponent v-if="!route.meta.hideFooter"></appFooterComponent>
  <ConfirmActionModal v-if="pending" :title="pending.title" :message="pending.message"
    :confirm-label="pending.confirmLabel" :cancel-label="pending.cancelLabel"
    :busy-label="pending.busyLabel" :danger="pending.danger" :busy="busy" :error="error"
    @confirm="accept" @cancel="cancel" />
</template>

<style scoped src="./App.css"></style>
