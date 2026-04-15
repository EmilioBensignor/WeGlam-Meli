<template>
  <section class="flex flex-col gap-4">
    <HeadingH1 class="mb-2">Dashboard</HeadingH1>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
      <template v-if="loading">
        <div v-for="i in 5" :key="i" class="flex flex-col justify-between gap-6 bg-surface-lowest rounded-xl border border-outline-variant/30 p-4">
          <div class="flex justify-between items-start">
            <USkeleton class="h-4 w-24" />
            <USkeleton class="h-9 w-9 rounded-lg" />
          </div>
          <div class="flex flex-col gap-1.5">
            <USkeleton class="h-8 w-28" />
            <USkeleton class="h-5 w-14" />
          </div>
        </div>
      </template>
      <template v-else>
        <DashboardKpiCard v-for="kpi in kpis" :key="kpi.label" :label="kpi.label" :value="kpi.value" :trend="kpi.trend"
          :icon="kpi.icon" :color="kpi.color" />
      </template>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
      <template v-if="loading">
        <div v-for="i in 5" :key="i" class="flex flex-col gap-2 bg-surface-lowest rounded-xl border border-outline-variant/30 p-4">
          <USkeleton class="h-4 w-20" />
          <USkeleton class="h-6 w-16" />
        </div>
      </template>
      <template v-else-if="reputation">
        <div v-if="reputation.power_seller_status" class="flex flex-col gap-2 bg-surface-lowest rounded-xl border border-outline-variant/30 p-4">
          <div class="flex items-center gap-1.5">
            <Icon name="i-tabler-medal" class="size-4 text-yellow-500" />
            <span class="text-xs font-medium uppercase tracking-wider text-on-surface-variant">Seller</span>
          </div>
          <span class="text-lg font-bold text-on-surface capitalize">{{ reputation.power_seller_status }}</span>
        </div>
        <div class="flex flex-col gap-2 bg-surface-lowest rounded-xl border border-outline-variant/30 p-4">
          <div class="flex items-center gap-1.5">
            <Icon name="i-tabler-alert-triangle" class="size-4 text-on-surface-variant" />
            <span class="text-xs font-medium uppercase tracking-wider text-on-surface-variant">Reclamos</span>
          </div>
          <span class="text-lg font-bold" :class="reputation.claims_rate > 0.02 ? 'text-red-600 dark:text-red-400' : 'text-on-surface'">{{ (reputation.claims_rate * 100).toFixed(1) }}%</span>
        </div>
        <div class="flex flex-col gap-2 bg-surface-lowest rounded-xl border border-outline-variant/30 p-4">
          <div class="flex items-center gap-1.5">
            <Icon name="i-tabler-x" class="size-4 text-on-surface-variant" />
            <span class="text-xs font-medium uppercase tracking-wider text-on-surface-variant">Cancelaciones</span>
          </div>
          <span class="text-lg font-bold" :class="reputation.cancellations_rate > 0.02 ? 'text-red-600 dark:text-red-400' : 'text-on-surface'">{{ (reputation.cancellations_rate * 100).toFixed(1) }}%</span>
        </div>
        <div class="flex flex-col gap-2 bg-surface-lowest rounded-xl border border-outline-variant/30 p-4">
          <div class="flex items-center gap-1.5">
            <Icon name="i-tabler-clock" class="size-4 text-on-surface-variant" />
            <span class="text-xs font-medium uppercase tracking-wider text-on-surface-variant">Demora despacho</span>
          </div>
          <span class="text-lg font-bold" :class="reputation.delayed_rate > 0.1 ? 'text-red-600 dark:text-red-400' : 'text-on-surface'">{{ (reputation.delayed_rate * 100).toFixed(1) }}%</span>
        </div>
        <div class="flex flex-col gap-2 bg-surface-lowest rounded-xl border border-outline-variant/30 p-4">
          <div class="flex items-center gap-1.5">
            <Icon name="i-tabler-shopping-bag" class="size-4 text-on-surface-variant" />
            <span class="text-xs font-medium uppercase tracking-wider text-on-surface-variant">Ventas completadas</span>
          </div>
          <span class="text-lg font-bold text-on-surface">{{ reputation.transactions_completed?.toLocaleString('es-AR') }}</span>
        </div>
      </template>
    </div>

    <section class="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <template v-if="loading">
        <div v-for="i in 2" :key="i" class="flex flex-col gap-4 bg-surface-lowest rounded-xl border border-outline-variant/30 p-4">
          <div class="flex justify-between items-start">
            <div class="flex flex-col gap-1">
              <USkeleton class="h-6 w-40" />
              <USkeleton class="h-4 w-56" />
            </div>
            <USkeleton class="h-4 w-28" />
          </div>
          <USkeleton class="h-48 w-full rounded-lg" />
        </div>
      </template>
      <template v-else>
        <DashboardSalesChart :data="salesData" />
        <DashboardAdPerformanceChart :data="adPerformanceData" />
      </template>
    </section>

    <section class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <template v-if="loading">
        <div v-for="i in 2" :key="i" class="bg-surface-lowest rounded-xl border border-outline-variant/30 overflow-hidden">
          <div class="flex justify-between items-center p-4">
            <USkeleton class="h-6 w-36" />
            <USkeleton class="h-4 w-16" />
          </div>
          <div class="flex flex-col gap-3 p-4">
            <div v-for="j in 3" :key="j" class="flex items-center gap-3">
              <USkeleton class="h-4 w-4" />
              <USkeleton class="h-10 w-10 rounded-lg" />
              <div class="flex-1 flex flex-col gap-1.5">
                <USkeleton class="h-4 w-full max-w-xs" />
                <USkeleton class="h-5 w-20" />
              </div>
              <USkeleton class="h-4 w-12" />
              <USkeleton class="h-4 w-24" />
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <DashboardTopProductsTable :products="topProducts" type="top" />
        <DashboardTopProductsTable :products="worstProducts" type="worst" />
      </template>
    </section>
  </section>
</template>

<script setup>
definePageMeta({ layout: 'dashboard' })

const { loading, kpis, salesData, adPerformanceData, topProducts, worstProducts, reputation, fetchStats } = useDashboardStats()

onMounted(() => {
  fetchStats()
})
</script>
