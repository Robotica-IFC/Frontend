<script setup>
import homeStartComponent from '@/components/home-page/homeStartComponent.vue'
import homeCardsComponent from '@/components/home-page/homeCardsComponent.vue'
import projectSuggestionComponent from '@/components/home-page/projectSuggestionComponent.vue'
import { useAuthStore } from '@/store/authStore'

const authStore = useAuthStore()

function goToSuggestion() {
  if (!authStore.isAuthenticated) return
  document.getElementById('sugira-um-projeto')?.scrollIntoView({ behavior: 'smooth' })
  document.getElementById('suggestion-heading')?.focus({ preventScroll: true })
}
</script>

<template>
  <homeStartComponent style="margin-top: 90px"></homeStartComponent>
  <homeCardsComponent @suggest="goToSuggestion"></homeCardsComponent>
  <projectSuggestionComponent v-if="authStore.isAuthenticated"></projectSuggestionComponent>
</template>
