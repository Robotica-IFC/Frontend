export function scrollAfterPagination(section = window) {
  const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ? 'instant'
    : 'smooth'

  if (section === window) {
    window.scrollTo({ top: 0, behavior })
  } else {
    section?.scrollIntoView({ block: 'start', behavior })
  }
}
