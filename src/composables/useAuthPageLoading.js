import { onMounted, ref } from 'vue'

export function useAuthPageLoading() {
  const pageLoading = ref(true)
  const pageImage = ref(null)

  onMounted(async () => {
    // A tela fica disponível mesmo se a imagem ou a fonte não puder carregar.
    await Promise.allSettled([pageImage.value?.decode(), document.fonts?.ready])
    pageLoading.value = false
  })

  return { pageLoading, pageImage }
}
