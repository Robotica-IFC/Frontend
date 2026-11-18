<script setup>
defineProps({
  message: { type: String, default: 'Carregando...' },
})
</script>

<template>
  <Teleport to="body">
    <div class="loading-overlay" role="status" aria-live="polite" aria-atomic="true">
      <div class="loading-card">
        <span class="loading-spinner" aria-hidden="true"></span>
        <p>{{ message }}</p>
        <span>Aguarde um instante.</span>
      </div>
    </div>
  </Teleport>
</template>

<style scoped src="./LoadingOverlay.css"></style>
