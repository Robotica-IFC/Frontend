<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>

  <aside class="sidebar">
    <nav>
      <RouterLink to="/"><span class="mdi mdi-home"></span> Página inicial</RouterLink>
      <RouterLink to="/team"><span class="mdi mdi-account-group"></span>Equipes</RouterLink>
    </nav>
  </aside>

</template>

<style>

</style>
