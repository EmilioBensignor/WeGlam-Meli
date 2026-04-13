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
