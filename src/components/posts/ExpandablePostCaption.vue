<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, useId, watch } from 'vue'

const props = defineProps({
  text: { type: String, default: '' },
  desktopClamp: Boolean,
  desktopLines: { type: Number, default: 3 },
})
const captionId = useId()
const caption = ref(null)
const expanded = ref(false)
const canExpand = ref(false)
const collapsedText = ref('')
const mobileQuery = window.matchMedia('(max-width: 949px)')
const isMobile = ref(mobileQuery.matches)
const visibleText = computed(() =>
  (isMobile.value && canExpand.value && !expanded.value
    ? collapsedText.value
    : props.text || ''
  ).trimEnd(),
)
let observer

function measure() {
  if (!caption.value || !isMobile.value) {
    canExpand.value = false
    return
  }
  const element = caption.value
  const fullText = (props.text || '').trimEnd()
  const styles = getComputedStyle(element)
  const lineHeight =
    Number.parseFloat(styles.lineHeight) || Number.parseFloat(styles.fontSize) * 1.4
  const maxHeight = lineHeight * 3 + 1
  const probe = element.cloneNode(false)
  probe.removeAttribute('id')
  probe.setAttribute('aria-hidden', 'true')
  Object.assign(probe.style, {
    position: 'absolute',
    visibility: 'hidden',
    pointerEvents: 'none',
    width: `${element.getBoundingClientRect().width}px`,
    height: 'auto',
    display: 'block',
    overflow: 'visible',
    WebkitLineClamp: 'unset',
  })
  probe.textContent = fullText
  element.parentElement.append(probe)
  try {
    canExpand.value = probe.getBoundingClientRect().height > maxHeight
    if (!canExpand.value) return

    const textNode = document.createTextNode('')
    const toggle = document.createElement('button')
    toggle.className = 'caption-toggle'
    toggle.type = 'button'
    toggle.tabIndex = -1
    toggle.textContent = 'Ver mais'
    for (const attribute of element.getAttributeNames()) {
      if (attribute.startsWith('data-v-')) toggle.setAttribute(attribute, '')
    }
    probe.replaceChildren(textNode, toggle)
    const characters = Array.from(fullText)
    let start = 0
    let end = characters.length
    while (start < end) {
      const middle = Math.ceil((start + end) / 2)
      textNode.textContent = `${characters.slice(0, middle).join('').trimEnd()}… `
      if (probe.getBoundingClientRect().height <= maxHeight) start = middle
      else end = middle - 1
    }
    collapsedText.value = `${characters.slice(0, start).join('').trimEnd()}…`
  } finally {
    probe.remove()
  }
}

async function updateLayout(event) {
  isMobile.value = event.matches
  expanded.value = false
  await nextTick()
  measure()
}

watch(
  () => props.text,
  async () => {
    expanded.value = false
    await nextTick()
    measure()
  },
)

onMounted(() => {
  observer = new ResizeObserver(measure)
  observer.observe(caption.value)
  mobileQuery.addEventListener('change', updateLayout)
  measure()
})
onUnmounted(() => {
  observer?.disconnect()
  mobileQuery.removeEventListener('change', updateLayout)
})
</script>

<template>
  <div
    class="expandable-caption"
    :class="{ expanded, 'desktop-clamp': desktopClamp }"
    :style="{ '--desktop-caption-lines': desktopLines }"
  >
    <p :id="captionId" ref="caption" class="caption-text">
      <span>{{ visibleText }}</span
      ><template v-if="isMobile && canExpand"
        >{{ ' '
        }}<button
          type="button"
          class="caption-toggle"
          :aria-expanded="expanded"
          :aria-controls="captionId"
          @click.stop="expanded = !expanded"
        >
          {{ expanded ? 'Ver menos' : 'Ver mais' }}
        </button></template
      >
    </p>
  </div>
</template>

<style scoped>
.expandable-caption {
  position: relative;
  min-width: 0;
}
.caption-text {
  margin: 0;
  white-space: pre-line;
  overflow-wrap: anywhere;
}
.caption-toggle {
  display: inline;
  position: relative;
  z-index: 2;
  padding: 0;
  margin: 0;
  border: 0;
  background: transparent;
  color: var(--principal-claro);
  font: inherit;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
}
.caption-toggle:focus-visible {
  outline: 2px solid var(--principal-claro);
  outline-offset: 3px;
}
@media (min-width: 950px) {
  .desktop-clamp .caption-text {
    display: -webkit-box;
    -webkit-line-clamp: var(--desktop-caption-lines);
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}
</style>
