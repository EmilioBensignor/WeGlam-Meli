const mockProducts = [
  {
    id: 'prod-1',
    sku: 'WG-SER-001',
    titulo: 'Serum Facial Vitamina C Premium',
    categoria: 'Skincare',
    imagen: 'https://http2.mlstatic.com/D_NQ_NP_2X_810651-MLA80569129498_112024-F.webp',
    publicacionesActivas: 12,
    publicacionesPausadas: 2,
    sinStock: 1,
    stockTotal: 145,
    revenue30d: 4200,
  },
  {
    id: 'prod-2',
    sku: 'WG-CRM-002',
    titulo: 'Crema Hidratante Ácido Hialurónico',
    categoria: 'Skincare',
    imagen: 'https://http2.mlstatic.com/D_NQ_NP_2X_810651-MLA80569129498_112024-F.webp',
    publicacionesActivas: 5,
    publicacionesPausadas: 3,
    sinStock: 4,
    stockTotal: 0,
    revenue30d: 0,
  },
  {
    id: 'prod-3',
    sku: 'WG-PAL-003',
    titulo: 'Paleta de Sombras Nude Collection',
    categoria: 'Maquillaje',
    imagen: 'https://http2.mlstatic.com/D_NQ_NP_2X_810651-MLA80569129498_112024-F.webp',
    publicacionesActivas: 8,
    publicacionesPausadas: 0,
    sinStock: 0,
    stockTotal: 52,
    revenue30d: 3100,
  },
  {
    id: 'prod-4',
    sku: 'WG-OIL-004',
    titulo: 'Aceite de Argán Reparador',
    categoria: 'Cuidado Capilar',
    imagen: 'https://http2.mlstatic.com/D_NQ_NP_2X_810651-MLA80569129498_112024-F.webp',
    publicacionesActivas: 15,
    publicacionesPausadas: 1,
    sinStock: 0,
    stockTotal: 88,
    revenue30d: 5500,
  },
  {
    id: 'prod-5',
    sku: 'WG-CLN-005',
    titulo: 'Limpiador Espumoso Gentil',
    categoria: 'Skincare',
    imagen: 'https://http2.mlstatic.com/D_NQ_NP_2X_810651-MLA80569129498_112024-F.webp',
    publicacionesActivas: 4,
    publicacionesPausadas: 0,
    sinStock: 0,
    stockTotal: 210,
    revenue30d: 2200,
  },
  {
    id: 'prod-6',
    sku: 'WG-SPF-006',
    titulo: 'Protector Solar SPF 50+ Mattifying',
    categoria: 'Skincare',
    imagen: 'https://http2.mlstatic.com/D_NQ_NP_2X_810651-MLA80569129498_112024-F.webp',
    publicacionesActivas: 9,
    publicacionesPausadas: 2,
    sinStock: 1,
    stockTotal: 64,
    revenue30d: 6700,
  },
  {
    id: 'prod-7',
    sku: 'WG-MSK-007',
    titulo: 'Mascarilla Nocturna Reparadora',
    categoria: 'Skincare',
    imagen: 'https://http2.mlstatic.com/D_NQ_NP_2X_810651-MLA80569129498_112024-F.webp',
    publicacionesActivas: 6,
    publicacionesPausadas: 1,
    sinStock: 0,
    stockTotal: 31,
    revenue30d: 2900,
  },
  {
    id: 'prod-8',
    sku: 'WG-LIP-008',
    titulo: 'Labial Matte Larga Duración',
    categoria: 'Maquillaje',
    imagen: 'https://http2.mlstatic.com/D_NQ_NP_2X_810651-MLA80569129498_112024-F.webp',
    publicacionesActivas: 10,
    publicacionesPausadas: 0,
    sinStock: 5,
    stockTotal: 0,
    revenue30d: 4800,
  },
]

export function useProducts() {
  const products = ref([])
  const loading = ref(false)
  const error = ref(null)

  const searchQuery = ref('')
  const selectedCategory = ref(null)
  const selectedStatus = ref(null)
  const sortBy = ref('ventas')

  const currentPage = ref(1)
  const pageSize = ref(10)

  const categories = computed(() => {
    const cats = [...new Set(products.value.map(p => p.categoria))]
    return cats.sort()
  })

  const filteredProducts = computed(() => {
    let result = [...products.value]

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.trim().toLowerCase()
      result = result.filter(p =>
        p.titulo.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
      )
    }

    if (selectedCategory.value) {
      result = result.filter(p => p.categoria === selectedCategory.value)
    }

    if (selectedStatus.value === 'con_stock') {
      result = result.filter(p => p.stockTotal > 0)
    } else if (selectedStatus.value === 'sin_stock') {
      result = result.filter(p => p.stockTotal === 0)
    }

    switch (sortBy.value) {
      case 'ventas':
        result.sort((a, b) => b.revenue30d - a.revenue30d)
        break
      case 'publicaciones':
        result.sort((a, b) => b.publicacionesActivas - a.publicacionesActivas)
        break
      case 'alfabetico':
        result.sort((a, b) => a.titulo.localeCompare(b.titulo))
        break
    }

    return result
  })

  const totalPages = computed(() => Math.ceil(filteredProducts.value.length / pageSize.value))

  const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    return filteredProducts.value.slice(start, start + pageSize.value)
  })

  watch([searchQuery, selectedCategory, selectedStatus, sortBy], () => {
    currentPage.value = 1
  })

  async function fetchProducts() {
    loading.value = true
    error.value = null
    try {
      const res = await $fetch('/api/sync-products')
      products.value = res.map((item) => ({
        id: item.ml_id || item.id || item.sku,
        sku: item.sku || '',
        titulo: item.titulo || item.title || '',
        categoria: item.categoria || 'Sin categoría',
        imagen: item.imagenes?.[0]?.url || item.thumbnail || '',
        publicacionesActivas: item.publicaciones_activas || 1,
        publicacionesPausadas: item.publicaciones_pausadas || 0,
        sinStock: item.sin_stock || 0,
        stockTotal: item.disponibles ?? item.stock ?? 0,
        revenue30d: item.revenue_30d || 0,
      }))
    } catch (e) {
      console.warn('Backend no disponible, usando mock data:', e.message)
      products.value = mockProducts
    } finally {
      loading.value = false
    }
  }

  return {
    products: readonly(products),
    filteredProducts,
    paginatedProducts,
    loading: readonly(loading),
    error: readonly(error),
    searchQuery,
    selectedCategory,
    selectedStatus,
    sortBy,
    currentPage,
    pageSize,
    totalPages,
    categories,
    fetchProducts,
  }
}
