<template>
  <section class="flex flex-col gap-4">
    <HeadingH1 class="mb-2">Dashboard</HeadingH1>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
      <DashboardKpiCard v-for="kpi in kpis" :key="kpi.label" :label="kpi.label" :value="kpi.value" :trend="kpi.trend"
        :icon="kpi.icon" :color="kpi.color" />
    </div>

    <div v-if="reputation" class="flex flex-wrap gap-4 bg-surface-lowest border border-outline-variant/30 rounded-xl p-4 text-sm">
      <div v-if="reputation.power_seller_status" class="flex items-center gap-1.5">
        <Icon name="i-tabler-medal" class="size-4 text-yellow-500" />
        <span class="font-semibold text-on-surface">{{ reputation.power_seller_status }}</span>
      </div>
      <div class="flex items-center gap-1.5 text-on-surface-variant">
        <Icon name="i-tabler-alert-triangle" class="size-4" />
        Reclamos: <span :class="reputation.claims_rate > 0.02 ? 'text-red-500 font-semibold' : 'text-on-surface'">{{ (reputation.claims_rate * 100).toFixed(1) }}%</span>
      </div>
      <div class="flex items-center gap-1.5 text-on-surface-variant">
        <Icon name="i-tabler-x" class="size-4" />
        Cancelaciones: <span :class="reputation.cancellations_rate > 0.02 ? 'text-red-500 font-semibold' : 'text-on-surface'">{{ (reputation.cancellations_rate * 100).toFixed(1) }}%</span>
      </div>
      <div class="flex items-center gap-1.5 text-on-surface-variant">
        <Icon name="i-tabler-clock" class="size-4" />
        Demora en despacho: <span :class="reputation.delayed_rate > 0.1 ? 'text-red-500 font-semibold' : 'text-on-surface'">{{ (reputation.delayed_rate * 100).toFixed(1) }}%</span>
      </div>
      <div class="flex items-center gap-1.5 text-on-surface-variant">
        <Icon name="i-tabler-shopping-bag" class="size-4" />
        Ventas completadas: <span class="text-on-surface">{{ reputation.transactions_completed?.toLocaleString('es-AR') }}</span>
      </div>
    </div>

    <section class="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <DashboardSalesChart :data="salesData" />
      <DashboardAdPerformanceChart :data="adPerformanceData" />
    </section>

    <section class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <DashboardTopProductsTable :products="topProducts" type="top" />
      <DashboardTopProductsTable :products="worstProducts" type="worst" />
    </section>
  </section>
</template>

<script setup>
definePageMeta({ layout: 'dashboard' })

const { kpis, salesData, adPerformanceData, topProducts, worstProducts, reputation, fetchStats } = useDashboardStats()

onMounted(() => {
  fetchStats()
})
</script>