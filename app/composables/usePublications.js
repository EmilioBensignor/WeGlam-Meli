const mockPublicationsByProduct = {
  'prod-1': [
    {
      mlaId: 'MLA-1402837201',
      productId: 'prod-1',
      titulo: 'Serum Facial Vitamina C Premium 30ml - Kit Inicial',
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
      visitas30d: 12400,
      ventas30d: 245,
      conversion: 2.4,
      facturacion30d: 3552500,
      preguntasSinResponder: 3,
      healthScore: 85,
      actualizadoEn: '2026-03-27T10:30:00Z',
    },
    {
      mlaId: 'MLA-1402837202',
      productId: 'prod-1',
      titulo: 'Serum Vitamina C Premium 30ml - Pack x3',
      precio: 38900,
      precioOriginal: 45000,
      moneda: 'ARS',
      stock: 42,
      stockMax: 80,
      vendidos: 89,
      estado: 'active',
      condicion: 'new',
      envioGratis: true,
      imagen: 'https://http2.mlstatic.com/D_NQ_NP_2X_810651-MLA80569129498_112024-F.webp',
      visitas30d: 5200,
      ventas30d: 89,
      conversion: 1.7,
      facturacion30d: 3462100,
      preguntasSinResponder: 0,
      healthScore: 72,
      actualizadoEn: '2026-03-27T10:30:00Z',
    },
    {
      mlaId: 'MLA-1402837203',
      productId: 'prod-1',
      titulo: 'Serum Vitamina C Premium 15ml - Viaje',
      precio: 8200,
      precioOriginal: null,
      moneda: 'ARS',
      stock: 8,
      stockMax: 50,
      vendidos: 34,
      estado: 'paused',
      condicion: 'new',
      envioGratis: false,
      imagen: 'https://http2.mlstatic.com/D_NQ_NP_2X_810651-MLA80569129498_112024-F.webp',
      visitas30d: 890,
      ventas30d: 12,
      conversion: 1.3,
      facturacion30d: 98400,
      preguntasSinResponder: 1,
      healthScore: 45,
      actualizadoEn: '2026-03-20T08:15:00Z',
    },
    {
      mlaId: 'MLA-1402837204',
      productId: 'prod-1',
      titulo: 'Serum Vitamina C + Ácido Hialurónico Combo',
      precio: 22500,
      precioOriginal: 28000,
      moneda: 'ARS',
      stock: 67,
      stockMax: 100,
      vendidos: 156,
      estado: 'active',
      condicion: 'new',
      envioGratis: true,
      imagen: 'https://http2.mlstatic.com/D_NQ_NP_2X_810651-MLA80569129498_112024-F.webp',
      visitas30d: 8900,
      ventas30d: 156,
      conversion: 1.8,
      facturacion30d: 3510000,
      preguntasSinResponder: 2,
      healthScore: 91,
      actualizadoEn: '2026-03-27T10:30:00Z',
    },
    {
      mlaId: 'MLA-1402837205',
      productId: 'prod-1',
      titulo: 'Serum Vitamina C Premium - Formato Económico 60ml',
      precio: 24900,
      precioOriginal: null,
      moneda: 'ARS',
      stock: 3,
      stockMax: 120,
      vendidos: 410,
      estado: 'active',
      condicion: 'new',
      envioGratis: true,
      imagen: 'https://http2.mlstatic.com/D_NQ_NP_2X_810651-MLA80569129498_112024-F.webp',
      visitas30d: 15200,
      ventas30d: 410,
      conversion: 2.7,
      facturacion30d: 10209000,
      preguntasSinResponder: 5,
      healthScore: 68,
      actualizadoEn: '2026-03-27T10:30:00Z',
    },
    {
      mlaId: 'MLA-1402837206',
      productId: 'prod-1',
      titulo: 'Serum Vitamina C Premium 30ml - Edición Limitada',
      precio: 19800,
      precioOriginal: null,
      moneda: 'ARS',
      stock: 0,
      stockMax: 50,
      vendidos: 50,
      estado: 'closed',
      condicion: 'new',
      envioGratis: true,
      imagen: 'https://http2.mlstatic.com/D_NQ_NP_2X_810651-MLA80569129498_112024-F.webp',
      visitas30d: 320,
      ventas30d: 0,
      conversion: 0,
      facturacion30d: 0,
      preguntasSinResponder: 0,
      healthScore: 20,
      actualizadoEn: '2026-02-15T12:00:00Z',
    },
  ],
}

function generateDefaultMock(productId) {
  return [
    {
      mlaId: 'MLA-1847293001',
      productId,
      titulo: 'Secaplatos Extensible De Acero Inoxidable Con Cubiertero - Escurridor Premium',
      precio: 45990,
      precioOriginal: 54990,
      moneda: 'ARS',
      stock: 87,
      stockMax: 120,
      vendidos: 312,
      estado: 'active',
      condicion: 'new',
      envioGratis: true,
      imagen: 'https://http2.mlstatic.com/D_NQ_NP_2X_810651-MLA80569129498_112024-F.webp',
      visitas30d: 18400,
      ventas30d: 312,
      conversion: 1.7,
      facturacion30d: 14348880,
      preguntasSinResponder: 4,
      healthScore: 92,
      actualizadoEn: '2026-03-29T10:30:00Z',
    },
    {
      mlaId: 'MLA-1847293002',
      productId,
      titulo: 'Secaplatos Extensible Acero Inoxidable - Pack x2 Unidades',
      precio: 79900,
      precioOriginal: 99900,
      moneda: 'ARS',
      stock: 24,
      stockMax: 60,
      vendidos: 145,
      estado: 'active',
      condicion: 'new',
      envioGratis: true,
      imagen: 'https://http2.mlstatic.com/D_NQ_NP_2X_810651-MLA80569129498_112024-F.webp',
      visitas30d: 6200,
      ventas30d: 145,
      conversion: 2.3,
      facturacion30d: 11585500,
      preguntasSinResponder: 1,
      healthScore: 78,
      actualizadoEn: '2026-03-29T10:30:00Z',
    },
    {
      mlaId: 'MLA-1847293003',
      productId,
      titulo: 'Secaplatos Compacto Acero Inoxidable - Ideal Espacios Reducidos',
      precio: 32490,
      precioOriginal: null,
      moneda: 'ARS',
      stock: 5,
      stockMax: 80,
      vendidos: 67,
      estado: 'active',
      condicion: 'new',
      envioGratis: false,
      imagen: 'https://http2.mlstatic.com/D_NQ_NP_2X_810651-MLA80569129498_112024-F.webp',
      visitas30d: 3100,
      ventas30d: 67,
      conversion: 2.2,
      facturacion30d: 2176830,
      preguntasSinResponder: 0,
      healthScore: 55,
      actualizadoEn: '2026-03-28T14:00:00Z',
    },
    {
      mlaId: 'MLA-1847293004',
      productId,
      titulo: 'Secaplatos Extensible Acero Inoxidable Negro Mate Premium',
      precio: 52900,
      precioOriginal: 62900,
      moneda: 'ARS',
      stock: 0,
      stockMax: 40,
      vendidos: 40,
      estado: 'paused',
      condicion: 'new',
      envioGratis: true,
      imagen: 'https://http2.mlstatic.com/D_NQ_NP_2X_810651-MLA80569129498_112024-F.webp',
      visitas30d: 890,
      ventas30d: 0,
      conversion: 0,
      facturacion30d: 0,
      preguntasSinResponder: 7,
      healthScore: 28,
      actualizadoEn: '2026-03-10T08:15:00Z',
    },
    {
      mlaId: 'MLA-1847293005',
      productId,
      titulo: 'Secaplatos 2 Pisos Acero Inoxidable Con Bandeja Recolectora',
      precio: 67500,
      precioOriginal: 79900,
      moneda: 'ARS',
      stock: 42,
      stockMax: 50,
      vendidos: 203,
      estado: 'active',
      condicion: 'new',
      envioGratis: true,
      imagen: 'https://http2.mlstatic.com/D_NQ_NP_2X_810651-MLA80569129498_112024-F.webp',
      visitas30d: 9800,
      ventas30d: 203,
      conversion: 2.1,
      facturacion30d: 13702500,
      preguntasSinResponder: 2,
      healthScore: 85,
      actualizadoEn: '2026-03-29T10:30:00Z',
    },
    {
      mlaId: 'MLA-1847293006',
      productId,
      titulo: 'Escurridor Cocina Acero Inoxidable - Outlet Últimas Unidades',
      precio: 18990,
      precioOriginal: 45990,
      moneda: 'ARS',
      stock: 2,
      stockMax: 200,
      vendidos: 198,
      estado: 'active',
      condicion: 'new',
      envioGratis: false,
      imagen: 'https://http2.mlstatic.com/D_NQ_NP_2X_810651-MLA80569129498_112024-F.webp',
      visitas30d: 14200,
      ventas30d: 198,
      conversion: 1.4,
      facturacion30d: 3760020,
      preguntasSinResponder: 12,
      healthScore: 38,
      actualizadoEn: '2026-03-29T10:30:00Z',
    },
    {
      mlaId: 'MLA-1847293007',
      productId,
      titulo: 'Secaplatos Extensible Acero Inoxidable - Usado Excelente Estado',
      precio: 28900,
      precioOriginal: null,
      moneda: 'ARS',
      stock: 1,
      stockMax: 1,
      vendidos: 0,
      estado: 'closed',
      condicion: 'used',
      envioGratis: false,
      imagen: 'https://http2.mlstatic.com/D_NQ_NP_2X_810651-MLA80569129498_112024-F.webp',
      visitas30d: 45,
      ventas30d: 0,
      conversion: 0,
      facturacion30d: 0,
      preguntasSinResponder: 0,
      healthScore: 12,
      actualizadoEn: '2026-01-20T12:00:00Z',
    },
  ]
}

export function usePublications(productId) {
  const publications = ref([])
  const loading = ref(false)
  const error = ref(null)

  const searchQuery = ref('')
  const selectedStatus = ref(null)
  const sortBy = ref('ventas')

  const filteredPublications = computed(() => {
    let result = [...publications.value]

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.trim().toLowerCase()
      result = result.filter(p =>
        p.titulo.toLowerCase().includes(q) || p.mlaId.toLowerCase().includes(q)
      )
    }

    if (selectedStatus.value) {
      result = result.filter(p => p.estado === selectedStatus.value)
    }

    switch (sortBy.value) {
      case 'ventas':
        result.sort((a, b) => b.ventas30d - a.ventas30d)
        break
      case 'precio':
        result.sort((a, b) => b.precio - a.precio)
        break
      case 'stock':
        result.sort((a, b) => b.stock - a.stock)
        break
      case 'health':
        result.sort((a, b) => b.healthScore - a.healthScore)
        break
    }

    return result
  })

  const productInfo = computed(() => {
    if (!publications.value.length) return null
    const first = publications.value[0]
    return {
      id: first.productId,
      titulo: first.titulo.split(' - ')[0].split(' Pack')[0].split(' Formato')[0],
      imagen: first.imagen,
      totalPublicaciones: publications.value.filter(p => p.estado === 'active').length,
      stockTotal: publications.value.reduce((acc, p) => acc + p.stock, 0),
      revenue30d: publications.value.reduce((acc, p) => acc + p.facturacion30d, 0),
    }
  })

  async function fetchPublications() {
    loading.value = true
    error.value = null
    try {
      const id = toValue(productId)
      const data = await $fetch(`/api/products/${id}/publications`)
      publications.value = data
    } catch (e) {
      const id = toValue(productId)
      publications.value = mockPublicationsByProduct[id] || generateDefaultMock(id)
      error.value = e.message || 'Error al cargar publicaciones'
    } finally {
      loading.value = false
    }
  }

  return {
    publications: readonly(publications),
    filteredPublications,
    productInfo,
    loading: readonly(loading),
    error: readonly(error),
    searchQuery,
    selectedStatus,
    sortBy,
    fetchPublications,
  }
}
