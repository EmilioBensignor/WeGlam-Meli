export function useDashboardStats() {
  const loading = ref(false)
  const error = ref(null)

  const kpis = ref([])
  const salesData = ref([])
  const adPerformanceData = ref([])
  const topProducts = ref([])
  const worstProducts = ref([])

  async function fetchStats() {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch('/api/dashboard-stats')
      if (data.kpis) kpis.value = data.kpis
      if (data.salesData) salesData.value = data.salesData
      if (data.adPerformanceData) adPerformanceData.value = data.adPerformanceData
      if (data.topProducts) topProducts.value = data.topProducts
      if (data.worstProducts) worstProducts.value = data.worstProducts
    } catch (e) {
      error.value = e.message || 'Error al cargar estadísticas'
    } finally {
      loading.value = false
    }
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    kpis: readonly(kpis),
    salesData: readonly(salesData),
    adPerformanceData: readonly(adPerformanceData),
    topProducts: readonly(topProducts),
    worstProducts: readonly(worstProducts),
    fetchStats,
  }
}
