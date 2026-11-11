export function getProfileImageUrl(image) {
  return typeof image === 'string' ? image : image?.url || image?.file || ''
}
