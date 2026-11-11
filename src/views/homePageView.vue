<script setup>
import homeStartComponent from '@/components/home-page/homeStartComponent.vue'
import homeCardsComponent from '@/components/home-page/homeCardsComponent.vue'
import projectSuggestionComponent from '@/components/home-page/projectSuggestionComponent.vue'
import communityHighlightsComponent from '@/components/home-page/communityHighlightsComponent.vue'
import featuredProjectsComponent from '@/components/home-page/featuredProjectsComponent.vue'
import { useHomeHighlights } from '@/composables/useHomeHighlights'
import { useAuthStore } from '@/store/authStore'

const authStore = useAuthStore()
useHomeHighlights()

function goToSuggestion() {
  if (!authStore.isAuthenticated) return
  document.getElementById('sugira-um-projeto')?.scrollIntoView({ behavior: 'smooth' })
  document.getElementById('suggestion-heading')?.focus({ preventScroll: true })
}
</script>

<template>
  <homeStartComponent style="margin-top: 90px"></homeStartComponent>
  <homeCardsComponent @suggest="goToSuggestion"></homeCardsComponent>
  <communityHighlightsComponent />
  <featuredProjectsComponent />
  <projectSuggestionComponent v-if="authStore.isAuthenticated"></projectSuggestionComponent>
</template>

<style scoped>
.featured-projects + .suggestion-section {
  margin-top: 32px;
}
</style>
