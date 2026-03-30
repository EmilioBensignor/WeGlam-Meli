<template>
  <section class="flex flex-col gap-4">
    <HeadingH1 class="mb-2">Dashboard</HeadingH1>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <DashboardKpiCard v-for="kpi in kpis" :key="kpi.label" :label="kpi.label" :value="kpi.value" :trend="kpi.trend"
        :icon="kpi.icon" :color="kpi.color" />
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

const { kpis, salesData, adPerformanceData, topProducts, worstProducts, loading, fetchStats } = useDashboardStats()

onMounted(() => {
  fetchStats()
})
</script>