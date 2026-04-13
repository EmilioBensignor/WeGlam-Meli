// const mockProducts = [...]

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
    const cats = [...new Set(products.value.map(p => p.categoria).filter(Boolean))]
    return cats.sort()
  })

  const conCatalogo = computed(() => products.value.filter(p => p.tipo === 'catalogo').length)

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
        id: item.product_id,
        mlId: item.ml_id || '',
        tipo: item.tipo || 'standalone',
        titulo: item.titulo || '',
        categoria: item.categoria || '',
        imagen: item.thumbnail || item.imagenes?.[0]?.url || '',
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
    selectedCategory,
    selectedStatus,
    sortBy,
    currentPage,
    pageSize,
    totalPages,
    categories,
    conCatalogo,
    fetchProducts,
  }
}
