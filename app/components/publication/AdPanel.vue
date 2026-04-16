<template>
  <section class="flex flex-col gap-4 bg-surface-lowest border border-outline-variant/30 rounded-xl p-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-6">
        <HeadingH1 :level="2">Panel de Publicidad</HeadingH1>
        <div v-if="ads.activa"
          class="flex items-center gap-2 bg-primary-400/10 border border-primary-400/20 rounded-full px-2 py-1">
          <div class="w-3 h-3 rounded-full bg-primary-400 animate-pulse" />
          <span class="text-base font-bold text-primary-600 dark:text-primary-400">Campaña Activa</span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-12 gap-4">
      <div class="flex flex-col gap-2 col-span-1">
        <div class="flex flex-col gap-1">
          <p class="text-on-surface">Impresiones</p>
          <p class="text-2xl font-bold text-on-surface">{{ formatNumber(ads.impresiones) }}</p>
        </div>
        <div class="flex flex-col gap-1">
          <p class="text-on-surface">Clics</p>
          <p class="text-2xl font-bold text-on-surface">{{ formatNumber(ads.clics) }}</p>
        </div>
        <div class="flex flex-col gap-1">
          <p class="text-on-surface">CTR</p>
          <p class="text-2xl font-bold text-primary-600 dark:text-primary-400">{{ ads.ctr }}%</p>
        </div>
      </div>
      <div class="flex flex-col gap-2 col-span-2 border-x border-outline-variant/30 px-4">
        <div class="flex flex-col gap-1">
          <p class="text-on-surface">ACOS</p>
          <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ ads.acos }}%</p>
        </div>
        <div class="flex flex-col gap-1">
          <p class="text-primary-600 dark:text-primary-400">ROI Publicitario</p>
          <p class="text-2xl font-bold text-primary-600 dark:text-primary-400">{{ ads.roiPublicitario }}x</p>
        </div>
      </div>

      <div class="col-span-9 h-full flex flex-col gap-4">
        <div class="flex justify-between items-center">
          <p class="font-bold text-on-surface">Gasto diario vs Ventas atribuidas</p>
          <div class="flex gap-4">
            <span class="flex items-center gap-1 text-base">
              <span class="w-3 h-3 bg-primary-400 rounded-full" /> Ventas
            </span>
            <span class="flex items-center gap-1 text-base">
              <span class="w-3 h-3 bg-surface-highest rounded-full" /> Gasto
            </span>
          </div>
        </div>
        <div class="flex-1 h-48" role="img" aria-label="Gráfico de gasto diario vs ventas atribuidas por publicidad">
          <Bar :data="chartData" :options="chartOptions" />
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-outline-variant/30">
      <div class="flex flex-col gap-1">
        <p class="text-sm font-bold text-on-surface">CTR · Click-Through Rate</p>
        <p class="text-sm text-on-surface-variant">% de personas que vieron el anuncio e hicieron click. Alto = llama la atención.</p>
      </div>
      <div class="flex flex-col gap-1">
        <p class="text-sm font-bold text-on-surface">ACOS · Advertising Cost of Sales</p>
        <p class="text-sm text-on-surface-variant">Cuánto gastás en ads por cada $100 vendidos. Bajo es mejor.</p>
      </div>
      <div class="flex flex-col gap-1">
        <p class="text-sm font-bold text-on-surface">ROI Publicitario · Return on Investment</p>
        <p class="text-sm text-on-surface-variant">Cuántas veces recuperás lo invertido. 3x = por cada $1 gastado, ganás $3.</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Bar } from 'vue-chartjs'

const props = defineProps({
  ads: { type: Object, required: true },
})

const { chartColors } = useChartTheme()

const chartData = computed(() => ({
  labels: props.ads.dailyData.map(d => d.label),
  datasets: [
    {
      label: 'Ventas',
      data: props.ads.dailyData.map(d => d.ventas),
      backgroundColor: chartColors.value.primary,
      borderRadius: 2,
      barPercentage: 0.5,
      categoryPercentage: 0.8,
    },
    {
      label: 'Gasto',
      data: props.ads.dailyData.map(d => d.gasto),
      backgroundColor: chartColors.value.muted,
      borderRadius: 2,
      barPercentage: 0.5,
      categoryPercentage: 0.8,
    },
  ],
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: { intersect: false, mode: 'index' },
  plugins: {
    tooltip: {
      backgroundColor: chartColors.value.tooltipBg,
      titleColor: chartColors.value.tooltipTitle,
      bodyColor: chartColors.value.tooltipBody,
      borderColor: chartColors.value.tooltipBorder,
      borderWidth: 1,
      padding: 12,
      titleFont: { family: 'Outfit', weight: '600' },
      bodyFont: { family: 'Outfit' },
      callbacks: {
        label: (ctx) => `${ctx.dataset.label}: $${ctx.parsed.y.toLocaleString('es-AR')}`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: chartColors.value.tickColor, font: { family: 'Outfit', size: 14 }, maxTicksLimit: 7 },
      border: { display: false },
    },
    y: {
      grid: { color: chartColors.value.gridColor },
      ticks: {
        color: chartColors.value.tickColor,
        font: { family: 'Outfit', size: 12 },
        callback: (value) => `$${(value / 1000).toFixed(0)}k`,
      },
      border: { display: false },
    },
  },
}))
</script>