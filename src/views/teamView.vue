<script setup>
import initialTeamComponent from '@/components/teams/initialTeamComponent.vue';
import listTeamsComponent from '@/components/teams/listTeamsComponent.vue'
</script>

<template>
  <div class="page team-view">
    <initialTeamComponent />
    <listTeamsComponent />
  </div>
</template>

<style scoped>
..page.team-view {
    width: 100%;
}

@media (min-width: 950px) {
    .page.team-view {
        max-width: none;
        width: 100%;
        padding: 20px 0%;
        box-sizing: border-box;
    }

    .page.team-view :deep(.top),
    .page.team-view :deep(.content) {
        width: 100%;
    }
}
</style>
