const mockMetrics = {
  visitas30d: 12400,
  ventas30d: 245,
  conversion: 2.4,
  facturacion30d: 3552500,
  preguntasSinResponder: 3,
  healthScore: 85,
  profit: {
    precioVenta: 14500,
    costoProducto: 5800,
    comisionMeli: 1885,
    envio: 1100,
    impuestos: 1250,
    publicidad: 400,
    gananciaNeta: 4065,
    margen: 28,
    roi: 1.7,
  },
  ads: {
    activa: true,
    impresiones: 84200,
    clics: 3260,
    ctr: 3.88,
    acos: 8.2,
    roiPublicitario: 4.8,
    gastoTotal: 412500,
    dailyData: [
      { label: '14 Mar', gasto: 28000, ventas: 68000 },
      { label: '15 Mar', gasto: 22000, ventas: 52000 },
      { label: '16 Mar', gasto: 31000, ventas: 85000 },
      { label: '17 Mar', gasto: 25000, ventas: 61000 },
      { label: '18 Mar', gasto: 35000, ventas: 95000 },
      { label: '19 Mar', gasto: 18000, ventas: 42000 },
      { label: '20 Mar', gasto: 29000, ventas: 72000 },
      { label: '21 Mar', gasto: 32000, ventas: 88000 },
      { label: '22 Mar', gasto: 24000, ventas: 56000 },
      { label: '23 Mar', gasto: 38000, ventas: 102000 },
      { label: '24 Mar', gasto: 27000, ventas: 65000 },
      { label: '25 Mar', gasto: 33000, ventas: 78000 },
      { label: '26 Mar', gasto: 21000, ventas: 48000 },
      { label: '27 Mar', gasto: 30000, ventas: 82000 },
    ],
  },
  recommendations: [
    {
      titulo: 'Agregar fotos de uso',
      descripcion: 'Publicar fotos del producto siendo aplicado mejora la conversión en un 12%.',
      prioridad: 'alta',
      icon: 'i-tabler-photo-plus',
    },
    {
      titulo: 'Completar ficha técnica',
      descripcion: 'Faltan 2 atributos secundarios en la sección de ingredientes.',
      prioridad: 'media',
      icon: 'i-tabler-edit',
    },
    {
      titulo: 'Ajuste de precio',
      descripcion: 'Tu competidor directo bajó el precio un 5%. Considera un descuento temporal.',
      prioridad: 'alta',
      icon: 'i-tabler-trending-down',
    },
    {
      titulo: 'Sugerencia de video',
      descripcion: 'Agregar un video de 15 segundos puede darte prioridad en el feed.',
      prioridad: 'baja',
      icon: 'i-tabler-player-play',
    },
  ],
}

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

      metrics.value = mockMetrics
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
