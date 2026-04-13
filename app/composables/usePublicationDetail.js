export function usePublicationDetail(productId, mlaId) {
  const publication = ref(null)
  const metrics = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function fetchDetail() {
    loading.value = true
    error.value = null
    try {
      const id = toValue(mlaId)

      const [liveData, metricsData] = await Promise.all([
        $fetch(`/api/publications/${id}/live`),
        $fetch(`/api/publications/${id}/metrics`),
      ])

      publication.value = { ...liveData, productId: toValue(productId) }
      metrics.value = metricsData
    } catch (e) {
      error.value = e.message || 'Error al cargar detalle'
    } finally {
      loading.value = false
    }
  }

  return {
    publication: readonly(publication),
    metrics: readonly(metrics),
    loading: readonly(loading),
    error: readonly(error),
    fetchDetail,
  }
}
