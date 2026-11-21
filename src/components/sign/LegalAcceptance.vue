<script setup>
defineProps({
  termsAccepted: { type: Boolean, default: false },
  privacyAcknowledged: { type: Boolean, default: false },
})
defineEmits(['update:termsAccepted', 'update:privacyAcknowledged'])
</script>

<template>
  <fieldset class="legal-acceptance">
    <legend>Antes de criar sua conta</legend>
    <label>
      <input
        type="checkbox"
        name="acceptTerms"
        :checked="termsAccepted"
        required
        @change="$emit('update:termsAccepted', $event.target.checked)"
      />
      <span>Li e aceito os <RouterLink to="/termos-de-uso" target="_blank" rel="noopener noreferrer" @click.stop>Termos de Uso</RouterLink>.</span>
    </label>
    <label>
      <input
        type="checkbox"
        name="acknowledgePrivacy"
        :checked="privacyAcknowledged"
        required
        @change="$emit('update:privacyAcknowledged', $event.target.checked)"
      />
      <span>Li e estou ciente da <RouterLink to="/privacidade" target="_blank" rel="noopener noreferrer" @click.stop>Política de Privacidade</RouterLink>.</span>
    </label>
    <p>Você precisa marcar as duas opções para continuar com o cadastro.</p>
  </fieldset>
</template>

<style scoped>
.legal-acceptance {
  width: 100%;
  max-width: 420px;
  margin: 15px auto 12px;
  padding: 14px 16px;
  border: 1px solid var(--destaque-claro, #7297b8);
  border-radius: 12px;
  text-align: left;
  color: var(--texto-claro, #172b3e);
}
legend {
  padding: 0 6px;
  color: var(--principal-claro, #003d66);
  font-weight: 700;
  font-size: 14px;
}
label {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin: 8px 0;
  line-height: 1.5;
  font-size: 13px;
}
input[type='checkbox'] {
  width: 18px;
  height: 18px;
  flex: 0 0 18px;
  margin-top: 2px;
  accent-color: var(--principal-claro, #003d66);
}
a { color: var(--principal-claro, #003d66); font-weight: 700; text-decoration: underline; text-underline-offset: 2px; }
p { margin: 10px 0 0; font-size: 12px; color: var(--texto-claro, #526b7e); opacity: .9; }
:root[data-theme='dark'] .legal-acceptance { background: #1d2b3a; border-color: #6585a8; }
:root[data-theme='dark'] a { color: #b6d6ff; }
</style>
