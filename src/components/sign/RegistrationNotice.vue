<script setup>
defineProps({
  message: { type: String, required: true },
  emailAlreadyRegistered: Boolean,
})
defineEmits(['edit-email'])
</script>

<template>
  <div class="registration-notice" role="alert">
    <p>{{ message }}</p>
    <div v-if="emailAlreadyRegistered" class="notice-actions">
      <button type="button" @click="$emit('edit-email')">Alterar e-mail</button>
      <RouterLink to="/">Entrar</RouterLink>
      <RouterLink to="/change-password">Recuperar senha</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.registration-notice {
  padding: 12px;
  border: 1px solid #efcccc;
  border-radius: 8px;
  background: #fff7f7;
  color: var(--danger-claro);
  font-size: 14px;
  line-height: 1.5;
  text-align: left;
  white-space: pre-line;
  overflow-wrap: anywhere;
}

.notice-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  margin-top: 8px;
}

.notice-actions a,
.notice-actions button {
  min-height: 32px;
  display: inline-flex;
  align-items: center;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--principal-claro);
  font: inherit;
  text-decoration: underline;
}
</style>
