export function useDashboardStats() {
  const loading = ref(false)
  const error = ref(null)

  const kpis = ref([
    {
      label: 'Ventas del mes',
      value: '$2,450,000',
      trend: 12.5,
      icon: 'i-tabler-cash',
      color: 'primary',
    },
    {
      label: 'Publicaciones activas',
      value: '147',
      trend: 5.4,
      icon: 'i-tabler-package',
      color: 'success',
    },
    {
      label: 'Visitas totales',
      value: '23,841',
      trend: -3.2,
      icon: 'i-tabler-eye',
      color: 'warning',
    },
    {
      label: 'Salud general',
      value: '78/100',
      trend: 2.1,
      icon: 'i-tabler-heart-rate-monitor',
      color: 'primary',
    },
  ])

  const salesData = ref([
    { label: '01 Mar', value: 82000 },
    { label: '03 Mar', value: 95000 },
    { label: '05 Mar', value: 78000 },
    { label: '07 Mar', value: 110000 },
    { label: '09 Mar', value: 92000 },
    { label: '11 Mar', value: 105000 },
    { label: '13 Mar', value: 118000 },
    { label: '15 Mar', value: 98000 },
    { label: '17 Mar', value: 125000 },
    { label: '19 Mar', value: 115000 },
    { label: '21 Mar', value: 132000 },
    { label: '23 Mar', value: 128000 },
    { label: '25 Mar', value: 145000 },
    { label: '27 Mar', value: 138000 },
    { label: '29 Mar', value: 155000 },
  ])

  const adPerformanceData = ref([
    { label: 'S1', gasto: 85000, retorno: 210000 },
    { label: 'S2', gasto: 72000, retorno: 280000 },
    { label: 'S3', gasto: 95000, retorno: 195000 },
    { label: 'S4', gasto: 68000, retorno: 320000 },
  ])

  const topProducts = ref([
    {
      id: 'prod-1',
      nombre: 'Serum Hyaluronic 2%',
      imagen: 'https://http2.mlstatic.com/D_NQ_NP_2X_810651-MLA80569129498_112024-F.webp',
      unidades: 1240,
      revenue: 325000,
      badge: 'Alta demanda',
    },
    {
      id: 'prod-2',
      nombre: 'Night Repair Mask',
      imagen: 'https://http2.mlstatic.com/D_NQ_NP_2X_810651-MLA80569129498_112024-F.webp',
      unidades: 980,
      revenue: 210500,
      badge: 'Alta demanda',
    },
    {
      id: 'prod-3',
      nombre: 'Lustre Lip Balm',
      imagen: 'https://http2.mlstatic.com/D_NQ_NP_2X_810651-MLA80569129498_112024-F.webp',
      unidades: 850,
      revenue: 182000,
      badge: 'Alta demanda',
    },
  ])

  const worstProducts = ref([
    {
      id: 'prod-10',
      nombre: 'Brush Kit Classic',
      imagen: 'https://http2.mlstatic.com/D_NQ_NP_2X_810651-MLA80569129498_112024-F.webp',
      unidades: 12,
      revenue: 12400,
      badge: 'Crítico',
    },
    {
      id: 'prod-11',
      nombre: 'Travel Cream Mini',
      imagen: 'https://http2.mlstatic.com/D_NQ_NP_2X_810651-MLA80569129498_112024-F.webp',
      unidades: 45,
      revenue: 18900,
      badge: 'Bajo rendimiento',
    },
    {
      id: 'prod-12',
      nombre: 'Glow Mist SPF',
      imagen: 'https://http2.mlstatic.com/D_NQ_NP_2X_810651-MLA80569129498_112024-F.webp',
      unidades: 38,
      revenue: 15200,
      badge: 'Bajo rendimiento',
    },
  ])

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
