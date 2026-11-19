/**
 * Um cadastro pode ter enviado o código com sucesso antes de o navegador
 * perder a resposta. Nesse caso, o token já guardado permite retomar
 * a verificação sem pedir outro código e sem expor dados de outro usuário.
 */
export function canResumePendingVerification(error, authStore, email, type) {
  return (
    error?.response?.status === 429 &&
    Boolean(authStore?.pendingRegistrationToken) &&
    authStore?.pendingType === type &&
    authStore?.pendingEmail?.trim().toLowerCase() === email?.trim().toLowerCase()
  )
}
