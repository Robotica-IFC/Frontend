// Cada aba mantém os próprios tokens, mesmo ao entrar em outra conta em outra aba.
function storage() {
  if (typeof sessionStorage === 'undefined') return localStorage
  if (!sessionStorage.getItem('auth_session_initialized')) {
    for (const key of ['access_token', 'refresh_token']) {
      const value = localStorage.getItem(key)
      if (value) sessionStorage.setItem(key, value)
    }
    sessionStorage.setItem('auth_session_initialized', 'true')
  }
  return sessionStorage
}

export function getSessionToken(key) {
  return storage().getItem(key)
}

export function saveSessionToken(key, value) {
  storage().setItem(key, value)
  localStorage.setItem(key, value)
}

export function clearSessionTokens() {
  const tab = storage()
  for (const key of ['access_token', 'refresh_token']) {
    if (localStorage.getItem(key) === tab.getItem(key)) localStorage.removeItem(key)
    tab.removeItem(key)
  }
}
