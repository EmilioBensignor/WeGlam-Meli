// const mockMetrics = {...}

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
          stockMax: 200,
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
          healthScore: mockMetrics.healthScore,
        }
      } else {
        publication.value = {
          mlaId: id,
          productId: toValue(productId),
          titulo: 'Serum Facial Vitamina C Premium 30ml',
          precio: 14500,
          precioOriginal: 18000,
          moneda: 'ARS',
          stock: 156,
          stockMax: 200,
          vendidos: 245,
          estado: 'active',
          condicion: 'new',
          envioGratis: true,
          imagen: 'https://http2.mlstatic.com/D_NQ_NP_2X_810651-MLA80569129498_112024-F.webp',
          imagenes: [],
          atributos: [
            { nombre: 'Marca', valor: 'We Glam' },
            { nombre: 'Contenido', valor: '30ml' },
            { nombre: 'Tipo de piel', valor: 'Todo tipo' },
          ],
          descripcion: 'Serum facial con vitamina C pura al 15%...',
          garantia: 'Garantía del vendedor: 30 días',
          permalink: 'https://articulo.mercadolibre.com.ar/MLA-1402837201',
          actualizadoEn: '2026-03-27T10:30:00Z',
          healthScore: mockMetrics.healthScore,
        }
      }

      try {
        const metricsData = await $fetch(`/api/publications/${id}/metrics`)
        metrics.value = metricsData
        if (publication.value && metricsData.healthScore != null) {
          publication.value = { ...publication.value, healthScore: metricsData.healthScore }
        }
      } catch {
        metrics.value = mockMetrics
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
