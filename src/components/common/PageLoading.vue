<script setup>
import { ref, watch, onBeforeUnmount } from 'vue'
import { requestsLoading } from '@/utils/requestLoading'

const dialog = ref(null)
let previousOverflow
watch([requestsLoading, dialog], ([loading, element]) => {
  if (!element) return
  if (loading) {
    if (!element.open) element.showModal()
    if (previousOverflow === undefined) previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  } else {
    element.close()
    if (previousOverflow !== undefined) document.body.style.overflow = previousOverflow
    previousOverflow = undefined
  }
}, { flush: 'post' })
onBeforeUnmount(() => {
  if (previousOverflow !== undefined) document.body.style.overflow = previousOverflow
})
</script>

<template>
  <Teleport to="body">
    <dialog ref="dialog" class="page-loading" aria-label="Carregando dados" aria-busy="true" @cancel.prevent>
      <div class="page-loading-content" role="status" aria-live="polite">
        <span class="page-loading-ring" aria-hidden="true"></span>
        <span class="loading-label">Carregando...</span>
      </div>
    </dialog>
  </Teleport>
</template>

<style scoped>
.page-loading {
  position: fixed;
  inset: 0;
  width: min(88px, calc(100vw - 32px));
  aspect-ratio: 1;
  max-width: none;
  height: auto;
  margin: auto;
  border: 1px solid rgb(255 255 255 / 90%);
  border-radius: 14px;
  padding: 20px;
  background: linear-gradient(145deg, #fff, #f3f7fb);
  color: var(--principal-claro);
  box-shadow: 0 12px 36px rgb(0 35 58 / 16%), 0 2px 8px rgb(0 35 58 / 6%);
}
.page-loading[open] {
  display: grid;
  place-items: center;
}
.page-loading::backdrop {
  background: rgb(0 25 43 / 32%);
  backdrop-filter: blur(3px);
}
.page-loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.4;
}
.loading-label {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
.page-loading-ring {
  width: 36px;
  aspect-ratio: 1;
  border-radius: 50%;
  background: conic-gradient(from 0deg, #dce6ef 0deg 230deg, var(--destaque-claro) 270deg, var(--principal-claro) 360deg);
  mask: radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 3px));
  animation: loading-spin 1s linear infinite;
}
@keyframes loading-spin {
  to { transform: rotate(360deg); }
}
@media (prefers-reduced-motion: reduce) {
  .page-loading-ring { animation-duration: 3s; }
}
</style>
