export const DEFAULT_AVATAR_URL = '/img/default2.jpg'

export function getProfileImageUrl(image) {
  if (typeof image === 'string') {
    const value = image.trim()
    return value && value !== 'null' && value !== 'undefined' ? value : ''
  }
  return image?.url || image?.file || ''
}

export function getAvatarUrl(image) {
  return getProfileImageUrl(image) || DEFAULT_AVATAR_URL
}

export function useDefaultAvatar(event) {
  const image = event?.target
  if (image && !image.src.endsWith(DEFAULT_AVATAR_URL)) {
    image.src = DEFAULT_AVATAR_URL
  }
}
