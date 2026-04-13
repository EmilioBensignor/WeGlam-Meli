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

      let baseData = null
      try {
        baseData = await $fetch(`/api/sync-id-products/${id}`)
      } catch {}

      if (baseData) {
        publication.value = {
          mlaId: baseData.ml_id || id,
          productId: toValue(productId),
          titulo: baseData.titulo || '',
          precio: baseData.precio || 0,
          precioOriginal: baseData.precio_original || null,
          moneda: baseData.moneda || 'ARS',
          stock: baseData.disponibles || 0,
          stockMax: baseData.disponibles || 0,
          vendidos: baseData.vendidos || 0,
          estado: baseData.estado || 'active',
          condicion: baseData.condicion || 'new',
          envioGratis: baseData.envio_gratis || false,
          imagen: baseData.imagenes?.[0]?.url || '',
          imagenes: baseData.imagenes || [],
          atributos: baseData.atributos || [],
          descripcion: baseData.descripcion || '',
          garantia: baseData.garantia || '',
          permalink: baseData.permalink || '',
          actualizadoEn: baseData.actualizado_en || '',
          healthScore: 0,
        }
      }

      const metricsData = await $fetch(`/api/publications/${id}/metrics`)
      metrics.value = metricsData
      if (publication.value && metricsData.healthScore != null) {
        publication.value = { ...publication.value, healthScore: metricsData.healthScore }
      }
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
