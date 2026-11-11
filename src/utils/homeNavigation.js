const homeSections = new Set(['community-highlights', 'featured-projects'])

export function rememberHomeSection(section) {
  if (!homeSections.has(section)) return
  window.history.replaceState({ ...window.history.state, homeSection: section }, '')
}

export function getHomeReturnSection(to, from, state) {
  if (
    to.name === 'home-page' &&
    from.name === 'projectDetails' &&
    homeSections.has(state?.homeSection)
  ) {
    return state.homeSection
  }
  return null
}
