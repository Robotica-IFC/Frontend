<script setup>
import initialTeamComponent from '@/components/teams/initialTeamComponent.vue';
import listTeamsComponent from '@/components/teams/listTeamsComponent.vue'
import appHeaderComponent from '@/components/layout/appHeaderComponent.vue';
</script>

<template>
  <appHeaderComponent></appHeaderComponent>
  <div class="page">
    <initialTeamComponent />
    <listTeamsComponent />
  </div>
</template>
