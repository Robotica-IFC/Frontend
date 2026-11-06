<script setup>
import { onMounted, onBeforeUnmount, ref, useId } from 'vue'

defineProps({
  title: { type: String, default: 'Confirmar ação' },
  message: { type: String, required: true },
  confirmLabel: { type: String, default: 'Confirmar' },
  cancelLabel: { type: String, default: 'Cancelar' },
  busyLabel: { type: String, default: 'Aguarde...' },
  danger: { type: Boolean, default: true },
  busy: Boolean,
  error: { type: String, default: '' },
})
const emit = defineEmits(['confirm', 'cancel'])
const dialog = ref(null)
const cancelButton = ref(null)
const id = useId()
let previousFocus

onMounted(() => {
  previousFocus = document.activeElement
  dialog.value.showModal()
  cancelButton.value.focus()
})
onBeforeUnmount(() => {
  dialog.value?.close()
  if (previousFocus?.isConnected) previousFocus.focus()
})
</script>

<template>
  <Teleport to="body">
    <dialog ref="dialog" class="confirmation" :aria-labelledby="`${id}-title`"
      :aria-describedby="`${id}-message`" :aria-busy="busy" aria-modal="true"
      @cancel.prevent="!busy && emit('cancel')" @click.self="!busy && emit('cancel')">
      <div class="confirmation-content">
        <span class="mdi" :class="danger ? 'mdi-alert-circle-outline danger-icon' : 'mdi-swap-horizontal'" aria-hidden="true" />
        <h2 :id="`${id}-title`">{{ title }}</h2>
        <p :id="`${id}-message`">{{ message }}</p>
        <p v-if="error" class="error" role="alert">{{ error }}</p>
        <footer>
          <button ref="cancelButton" type="button" :disabled="busy" @click="emit('cancel')">{{ cancelLabel }}</button>
          <button type="button" class="primary" :class="{ danger }" :disabled="busy" @click="emit('confirm')">
            {{ busy ? busyLabel : confirmLabel }}
          </button>
        </footer>
      </div>
    </dialog>
  </Teleport>
</template>

<style scoped>
.confirmation {
  width: min(460px, calc(100% - 32px));
  max-height: calc(100dvh - 32px);
  margin: auto;
  padding: 0;
  border: 0;
  border-radius: 18px;
  color: #003f63;
  box-shadow: 0 18px 60px #0004;
}
.confirmation::backdrop { background: #001b2dcc; }
.confirmation-content { padding: 26px; }
.confirmation-content > .mdi { font-size: 36px; }
.danger-icon, .error { color: #b32634; }
h2 { font-size: 21px; margin: 12px 0; }
p { line-height: 1.6; overflow-wrap: anywhere; white-space: pre-line; }
footer { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 10px; margin-top: 24px; }
button { padding: 11px 16px; border: 1px solid #b8ccd8; border-radius: 8px; background: white; color: #003f63; font: inherit; cursor: pointer; }
button.primary { background: #004369; border-color: #004369; color: white; }
button.danger { background: #b32634; border-color: #b32634; }
button:disabled { opacity: .6; cursor: wait; }
button:focus-visible { outline: 3px solid #3b95c6; outline-offset: 3px; }
</style>
