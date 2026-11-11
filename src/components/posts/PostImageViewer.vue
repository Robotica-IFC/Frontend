<script setup>
import { computed, onBeforeUnmount, onMounted, ref, useId } from 'vue'

const props = defineProps({
  images: { type: Array, required: true },
  initialIndex: { type: Number, default: 0 },
})
const emit = defineEmits(['close'])
const id = useId()
const dialog = ref(null)
const stage = ref(null)
const closeButton = ref(null)
const index = ref(Math.max(0, Math.min(props.initialIndex, props.images.length - 1)))
const scale = ref(1)
const offset = ref({ x: 0, y: 0 })
const naturalSize = ref({ width: 0, height: 0 })
const stageSize = ref({ width: 0, height: 0 })
const loaded = ref(false)
const failed = ref(false)
const dragging = ref(false)
const pointers = new Map()
let gesture = null
let tap = null
let lastTap = null
let lastTouchTime = 0
let observer
let previousFocus
let previousOverflow
const currentImage = computed(() => props.images[index.value])
const fitted = computed(() => {
  const { width, height } = naturalSize.value
  if (!width || !height) return { width: 0, height: 0 }
  const ratio = Math.min(1, Math.max(1, stageSize.value.width - 24) / width, Math.max(1, stageSize.value.height - 24) / height)
  return { width: width * ratio, height: height * ratio }
})
const imageStyle = computed(() => ({
  width: `${fitted.value.width}px`,
  height: `${fitted.value.height}px`,
  transform: `translate(${offset.value.x}px, ${offset.value.y}px) scale(${scale.value})`,
}))

function clampOffset() {
  const maxX = Math.max(0, (fitted.value.width * scale.value - stageSize.value.width) / 2)
  const maxY = Math.max(0, (fitted.value.height * scale.value - stageSize.value.height) / 2)
  offset.value = {
    x: Math.max(-maxX, Math.min(maxX, offset.value.x)),
    y: Math.max(-maxY, Math.min(maxY, offset.value.y)),
  }
}
function reset() {
  scale.value = 1
  offset.value = { x: 0, y: 0 }
  lastTap = null
}
function measure() {
  const bounds = stage.value.getBoundingClientRect()
  stageSize.value = { width: bounds.width, height: bounds.height }
  clampOffset()
}
function imageLoaded(event) {
  naturalSize.value = { width: event.target.naturalWidth, height: event.target.naturalHeight }
  loaded.value = true
  measure()
}
function relativePoint(clientX, clientY) {
  const bounds = stage.value.getBoundingClientRect()
  return { x: clientX - bounds.left - bounds.width / 2, y: clientY - bounds.top - bounds.height / 2 }
}
function zoomTo(value, anchor = { x: 0, y: 0 }, destination = anchor) {
  if (!loaded.value || failed.value) return
  const nextScale = Math.max(1, Math.min(5, value))
  const ratio = nextScale / scale.value
  offset.value = {
    x: destination.x - (anchor.x - offset.value.x) * ratio,
    y: destination.y - (anchor.y - offset.value.y) * ratio,
  }
  scale.value = nextScale
  clampOffset()
}
function toggleZoom(clientX, clientY) {
  zoomTo(scale.value > 1 ? 1 : 2.5, relativePoint(clientX, clientY))
}
function doubleClick(event) {
  // O navegador também pode emitir dblclick após dois toques já tratados pelos pointers.
  if (Date.now() - lastTouchTime > 500) toggleZoom(event.clientX, event.clientY)
}
function wheelZoom(event) {
  zoomTo(scale.value * Math.exp(-event.deltaY * 0.002), relativePoint(event.clientX, event.clientY))
}
function changeImage(direction) {
  const next = index.value + direction
  if (next < 0 || next >= props.images.length) return
  index.value = next
  loaded.value = false
  failed.value = false
  naturalSize.value = { width: 0, height: 0 }
  reset()
  lastTap = null
  pointers.clear()
  gesture = null
  dragging.value = false
}
function pinchGesture() {
  const [first, second] = [...pointers.values()]
  if (!second) return null
  return {
    center: relativePoint((first.x + second.x) / 2, (first.y + second.y) / 2),
    distance: Math.hypot(first.x - second.x, first.y - second.y),
  }
}
function pointerDown(event) {
  if (!loaded.value || failed.value || (event.pointerType === 'mouse' && event.button !== 0)) return
  if (event.pointerType !== 'mouse') lastTouchTime = Date.now()
  stage.value.setPointerCapture(event.pointerId)
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })
  dragging.value = true
  tap = pointers.size === 1 ? { x: event.clientX, y: event.clientY, time: Date.now() } : null
  gesture = pinchGesture()
}
function pointerMove(event) {
  const previous = pointers.get(event.pointerId)
  if (!previous) return
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })
  if (tap && Math.hypot(event.clientX - tap.x, event.clientY - tap.y) > 10) tap = null
  if (pointers.size >= 2) {
    const next = pinchGesture()
    if (gesture?.distance > 0) zoomTo(scale.value * next.distance / gesture.distance, gesture.center, next.center)
    gesture = next
  } else if (scale.value > 1) {
    offset.value = { x: offset.value.x + event.clientX - previous.x, y: offset.value.y + event.clientY - previous.y }
    clampOffset()
  }
}
function pointerEnd(event) {
  if (event.type === 'pointerup' && event.pointerType !== 'mouse' && tap && Date.now() - tap.time < 300) {
    const now = Date.now()
    if (lastTap && now - lastTap.time < 350 && Math.hypot(lastTap.x - event.clientX, lastTap.y - event.clientY) < 30) {
      toggleZoom(event.clientX, event.clientY)
      lastTap = null
    } else lastTap = { x: event.clientX, y: event.clientY, time: now }
  }
  tap = null
  pointers.delete(event.pointerId)
  gesture = pinchGesture()
  dragging.value = pointers.size > 0
}
function keydown(event) {
  if (event.key === 'ArrowRight') changeImage(1)
  else if (event.key === 'ArrowLeft') changeImage(-1)
  else if (event.key === '+' || event.key === '=') zoomTo(scale.value + 0.5)
  else if (event.key === '-') zoomTo(scale.value - 0.5)
  else if (event.key === '0') reset()
  else return
  event.preventDefault()
}

onMounted(() => {
  previousFocus = document.activeElement
  previousOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  dialog.value.showModal()
  closeButton.value.focus()
  observer = new ResizeObserver(measure)
  observer.observe(stage.value)
  measure()
})
onBeforeUnmount(() => {
  observer?.disconnect()
  dialog.value?.close()
  document.body.style.overflow = previousOverflow
  if (previousFocus?.isConnected) previousFocus.focus()
})
</script>

<template>
  <Teleport to="body">
    <dialog ref="dialog" class="image-viewer" aria-modal="true" :aria-labelledby="`${id}-title`"
      :aria-describedby="`${id}-hint`" @cancel.prevent="emit('close')" @keydown="keydown">
      <div class="viewer-layout">
        <header class="viewer-header">
          <h2 :id="`${id}-title`">Imagem do post <span v-if="images.length > 1">{{ index + 1 }} / {{ images.length }}</span></h2>
          <button ref="closeButton" type="button" aria-label="Fechar imagem" title="Fechar (Esc)" @click="emit('close')"><i class="mdi mdi-close" aria-hidden="true" /></button>
        </header>
        <div ref="stage" class="image-stage" :class="{ zoomed: scale > 1, dragging }"
          @wheel.prevent="wheelZoom" @dblclick.prevent="doubleClick"
          @pointerdown.prevent="pointerDown" @pointermove="pointerMove"
          @pointerup="pointerEnd" @pointercancel="pointerEnd" @lostpointercapture="pointerEnd">
          <img v-if="currentImage" :key="index" :src="currentImage.url"
            :alt="`Imagem ${index + 1} do post`" :style="imageStyle" :class="{ loaded }" draggable="false"
            @load="imageLoaded" @error="failed = true" />
          <p v-if="failed" role="alert">Não foi possível carregar esta imagem.</p>
          <p v-else-if="!loaded" role="status">Carregando imagem...</p>
        </div>
        <footer class="viewer-footer">
          <div class="viewer-controls" aria-label="Controles da imagem">
            <button v-if="images.length > 1" type="button" :disabled="index === 0" aria-label="Imagem anterior" @click="changeImage(-1)"><i class="mdi mdi-chevron-left" aria-hidden="true" /></button>
            <button type="button" :disabled="!loaded || failed || scale <= 1" aria-label="Diminuir zoom" @click="zoomTo(scale - 0.5)"><i class="mdi mdi-magnify-minus-outline" aria-hidden="true" /></button>
            <button type="button" class="zoom-reset" :disabled="!loaded || failed" aria-label="Restaurar zoom" title="Restaurar zoom (0)" @click="reset">{{ Math.round(scale * 100) }}%</button>
            <button type="button" :disabled="!loaded || failed || scale >= 5" aria-label="Aumentar zoom" @click="zoomTo(scale + 0.5)"><i class="mdi mdi-magnify-plus-outline" aria-hidden="true" /></button>
            <button v-if="images.length > 1" type="button" :disabled="index === images.length - 1" aria-label="Próxima imagem" @click="changeImage(1)"><i class="mdi mdi-chevron-right" aria-hidden="true" /></button>
          </div>
          <p :id="`${id}-hint`">Use pinça, toque duplo ou os botões para ampliar. Arraste para explorar.</p>
        </footer>
      </div>
    </dialog>
  </Teleport>
</template>

<style scoped>
.image-viewer {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100dvh;
  max-width: none;
  max-height: none;
  margin: 0;
  padding: 0;
  border: 0;
  background: #07131f;
  color: #fff;
  box-sizing: border-box;
  overscroll-behavior: contain;
}
.image-viewer::backdrop { background: #07131f; }
.viewer-layout { display: flex; flex-direction: column; height: 100%; }
.viewer-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: max(10px, env(safe-area-inset-top)) max(12px, env(safe-area-inset-right)) 10px max(16px, env(safe-area-inset-left)); }
.viewer-header h2 { margin: 0; font-size: 15px; }
.viewer-header h2 span { margin-left: 8px; color: #b8c9da; font-size: 13px; white-space: nowrap; }
.image-viewer button { display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; min-width: 44px; min-height: 44px; padding: 8px; border: 1px solid #526579; border-radius: 10px; background: #172a3c; color: white; font: inherit; cursor: pointer; }
.image-viewer button .mdi { font-size: 24px; line-height: 1; }
.image-viewer button:disabled { opacity: .35; cursor: default; }
.image-viewer button:focus-visible { outline: 3px solid #71c8ff; outline-offset: 3px; }
.image-viewer button:hover:not(:disabled) { background: #29445e; }
.image-stage { position: relative; display: flex; flex: 1; min-height: 0; align-items: center; justify-content: center; overflow: hidden; touch-action: none; user-select: none; cursor: zoom-in; }
.image-stage.zoomed { cursor: grab; }
.image-stage.zoomed.dragging { cursor: grabbing; }
.image-stage img { display: block; flex-shrink: 0; max-width: none; max-height: none; opacity: 0; object-fit: contain; transform-origin: center; pointer-events: none; }
.image-stage img.loaded { opacity: 1; }
.image-stage p { position: absolute; padding: 16px; text-align: center; color: #cbd9e6; }
.viewer-footer { padding: 12px max(12px, env(safe-area-inset-right)) max(16px, env(safe-area-inset-bottom)) max(12px, env(safe-area-inset-left)); }
.viewer-controls { display: flex; align-items: center; justify-content: center; gap: 8px; }
.image-viewer .zoom-reset { min-width: 64px; font-size: 13px; font-variant-numeric: tabular-nums; }
.viewer-footer p { margin: 12px auto 0; max-width: 340px; text-align: center; font-size: 12px; line-height: 1.5; color: #b8c9da; }
@media (min-width: 768px) {
  .viewer-header { padding: 16px 24px; }
  .viewer-header h2 { font-size: 18px; }
  .viewer-footer { padding-bottom: 24px; }
  .viewer-controls { gap: 12px; }
  .viewer-footer p { max-width: none; }
}
</style>
