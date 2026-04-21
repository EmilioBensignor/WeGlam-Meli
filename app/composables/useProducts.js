export function useProducts() {
  const products = ref([])
  const loading = ref(true)
  const error = ref(null)

  const defaultFilters = {
    searchQuery: '',
    selectedStatus: null,
    selectedHealth: null,
    sortBy: 'ventas',
    hideGhosts: false,
  }

  const filters = usePersistedRef('weglam:productos:filters:v1', { ...defaultFilters })

  const searchQuery = computed({
    get: () => filters.value.searchQuery,
    set: (v) => { filters.value.searchQuery = v },
  })
  const selectedStatus = computed({
    get: () => filters.value.selectedStatus,
    set: (v) => { filters.value.selectedStatus = v },
  })
  const selectedHealth = computed({
    get: () => filters.value.selectedHealth,
    set: (v) => { filters.value.selectedHealth = v },
  })
  const sortBy = computed({
    get: () => filters.value.sortBy,
    set: (v) => { filters.value.sortBy = v },
  })
  const hideGhosts = computed({
    get: () => filters.value.hideGhosts,
    set: (v) => { filters.value.hideGhosts = v },
  })

  function clearFilters() {
    filters.value = { ...defaultFilters }
  }

  const currentPage = ref(1)
  const pageSize = ref(10)

  const filteredProducts = computed(() => {
    let result = [...products.value]

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.trim().toLowerCase()
      result = result.filter(p =>
        p.titulo.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.mlId.toLowerCase().includes(q)
      )
    }

    if (selectedStatus.value === 'active') {
      result = result.filter(p => p.publicacionesActivas > 0)
    } else if (selectedStatus.value === 'paused') {
      result = result.filter(p => p.publicacionesPausadas > 0)
    } else if (selectedStatus.value === 'con_preguntas') {
      result = result.filter(p => p.preguntasSinResponder > 0)
    } else if (selectedStatus.value === 'sin_stock') {
      result = result.filter(p => p.stockTotal === 0)
    } else if (selectedStatus.value === 'con_stock') {
      result = result.filter(p => p.stockTotal > 0)
    }

    if (hideGhosts.value) {
      // Un producto es "fantasma" si TODAS sus publicaciones son fantasma (ninguna válida)
      result = result.filter(p => (p.publicaciones - p.publicacionesFantasma) > 0)
    }

    if (selectedHealth.value === 'saludable') {
      result = result.filter(p => p.healthScore >= 70)
    } else if (selectedHealth.value === 'mejorable') {
      result = result.filter(p => p.healthScore >= 40 && p.healthScore < 70)
    } else if (selectedHealth.value === 'critico') {
      result = result.filter(p => p.healthScore < 40)
    }

    switch (sortBy.value) {
      case 'ventas':
        result.sort((a, b) => b.revenue30d - a.revenue30d)
        break
      case 'peores':
        result.sort((a, b) => a.revenue30d - b.revenue30d)
        break
      case 'mejor_salud':
        result.sort((a, b) => b.healthScore - a.healthScore)
        break
      case 'peor_salud':
        result.sort((a, b) => a.healthScore - b.healthScore)
        break
      case 'mas_publicaciones':
        result.sort((a, b) => b.publicaciones - a.publicaciones)
        break
      case 'menos_publicaciones':
        result.sort((a, b) => a.publicaciones - b.publicaciones)
        break
    }

    return result
  })

  const totalPages = computed(() => Math.ceil(filteredProducts.value.length / pageSize.value))

  const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    return filteredProducts.value.slice(start, start + pageSize.value)
  })

  watch([searchQuery, selectedStatus, selectedHealth, sortBy, hideGhosts], () => {
    currentPage.value = 1
  })

  async function fetchProducts() {
    loading.value = true
    error.value = null
    try {
      const res = await $fetch('/api/sync-products')
      products.value = res.map((item) => ({
        id: item.product_id,
        mlId: item.ml_id || '',
        tipo: item.tipo || 'standalone',
        titulo: item.titulo || '',
        categoria: item.categoria || '',
        imagen: upgradeMLImage(item.thumbnail || item.imagenes?.[0]?.url || ''),
        publicaciones: item.publicaciones ?? 1,
        publicacionesActivas: item.publicaciones_activas ?? 0,
        publicacionesPausadas: item.publicaciones_pausadas ?? 0,
        sinStock: item.sin_stock ?? 0,
        stockTotal: item.disponibles ?? 0,
        precioMin: item.precio_min ?? 0,
        precioMax: item.precio_max ?? 0,
        healthScore: item.healthScore ?? 0,
        revenue30d: item.facturacion_30d ?? 0,
        ventas30d: item.ventas_30d ?? 0,
        visitas30d: item.visitas_30d ?? 0,
        preguntasSinResponder: item.preguntas_sin_responder ?? 0,
        publicacionesFantasma: item.publicaciones_fantasma ?? 0,
        trend: item.trend ?? 0,
      }))
    } catch (e) {
      error.value = e.message
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
    selectedStatus,
    selectedHealth,
    sortBy,
    hideGhosts,
    currentPage,
    pageSize,
    totalPages,
    fetchProducts,
    clearFilters,
  }
}
