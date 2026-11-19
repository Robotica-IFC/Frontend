import { formatApiError } from './formValidation.js'

export function getRegistrationFeedback(error) {
  const data = error?.response?.data
  const emailErrors = [data?.email, data?.user?.email].flat(Infinity).filter(Boolean)
  const emailAlreadyRegistered =
    data?.code === 'email_already_exists' ||
    emailErrors.some((message) =>
      /já existe|já (?:está |foi )?cadastrad|already exists|already registered|already in use/i.test(
        String(message),
      ),
    )

  return {
    message: emailAlreadyRegistered
      ? 'Já existe uma conta com este e-mail. Entre na sua conta ou recupere sua senha.'
      : formatApiError(error, 'Não foi possível criar sua conta. Tente novamente.'),
    emailAlreadyRegistered,
  }
}
