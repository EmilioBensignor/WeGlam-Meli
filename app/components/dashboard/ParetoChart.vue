<template>
  <div class="flex flex-col gap-4 bg-surface-lowest rounded-xl border border-outline-variant/30 p-4">
    <div class="flex justify-between items-start gap-4 flex-wrap">
      <div class="flex flex-col gap-1">
        <div class="flex items-center gap-2">
          <HeadingH1 :level="2">Análisis de Pareto</HeadingH1>
          <span class="text-xs font-semibold uppercase tracking-wider bg-primary-400/20 text-primary-700 dark:text-primary-300 rounded-full px-2 py-0.5">
            80 / 20
          </span>
        </div>
        <p class="text-on-surface text-base">Concentración de ingresos por publicación</p>
      </div>

      <div class="flex items-center gap-3">
        <div class="flex items-center gap-1.5">
          <span class="w-3 h-3 rounded-sm bg-primary-400" />
          <span class="text-xs text-on-surface">Ingresos</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="w-3 h-3 rounded-sm" :style="{ backgroundColor: chartColors.muted }" />
          <span class="text-xs text-on-surface">% Acumulado</span>
        </div>
      </div>
    </div>

    <div v-if="!publications.length" class="h-64 flex items-center justify-center">
      <p class="text-on-surface-variant text-sm">Sin datos disponibles</p>
    </div>

    <template v-else>
      <!-- Insight: publicaciones vitales vs triviales -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div class="bg-primary-400/10 border border-primary-400/30 rounded-xl p-3 flex flex-col gap-1">
          <div class="flex items-center gap-1.5">
            <Icon name="i-tabler-star-filled" class="size-3.5 text-primary-600 dark:text-primary-400" />
            <span class="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Pocas vitales</span>
          </div>
          <div class="flex items-baseline gap-1">
            <span class="text-2xl font-bold text-primary-700 dark:text-primary-300">{{ vitalCount }}</span>
            <span class="text-sm text-on-surface-variant">de {{ paretoData.length }}</span>
          </div>
          <span class="text-xs text-on-surface-variant">generan el <strong class="text-on-surface">{{ vitalShare }}%</strong> del revenue</span>
        </div>

        <div class="bg-surface-high/40 border border-outline-variant/30 rounded-xl p-3 flex flex-col gap-1">
          <div class="flex items-center gap-1.5">
            <Icon name="i-tabler-layers-subtract" class="size-3.5 text-on-surface-variant" />
            <span class="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Muchas triviales</span>
          </div>
          <div class="flex items-baseline gap-1">
            <span class="text-2xl font-bold text-on-surface">{{ trivialCount }}</span>
            <span class="text-sm text-on-surface-variant">de {{ paretoData.length }}</span>
          </div>
          <span class="text-xs text-on-surface-variant">aportan el <strong class="text-on-surface">{{ trivialShare }}%</strong> restante</span>
        </div>

        <div class="bg-surface-high/40 border border-outline-variant/30 rounded-xl p-3 flex flex-col gap-1">
          <div class="flex items-center gap-1.5">
            <Icon name="i-tabler-chart-pie" class="size-3.5 text-on-surface-variant" />
            <span class="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Concentración</span>
          </div>
          <div class="flex items-baseline gap-1">
            <span class="text-2xl font-bold" :class="concentrationColor">{{ concentrationLabel }}</span>
          </div>
          <span class="text-xs text-on-surface-variant">{{ concentrationDescription }}</span>
        </div>
      </div>

      <!-- Chart -->
      <div class="min-h-72 w-full" role="img" aria-label="Gráfico de Pareto: distribución de ingresos acumulados por publicación">
        <Chart type="bar" :data="chartData" :options="chartOptions" />
      </div>

      <p class="text-xs text-on-surface-variant text-center">
        Mostrando {{ displayPublications.length }} de {{ paretoData.length }} publicaciones, ordenadas por ingresos. Click en una barra para ver su detalle.
      </p>
    </template>
  </div>
</template>

<script setup>
import { Chart } from 'vue-chartjs'
import { ROUTE_NAMES } from '~/constants/ROUTE_NAMES.js'

const props = defineProps({
  publications: { type: Array, required: true },
  maxBars: { type: Number, default: 25 },
})

const { chartColors } = useChartTheme()

// Normalizar: aceptar diferentes shapes de publicaciones
function normalize(pub) {
  return {
    mlaId: pub.mlaId || pub.ml_id || pub.id || '',
    productId: pub.productId || pub.product_id || '',
    titulo: pub.titulo || pub.title || '',
    revenue: pub.facturacion30d ?? pub.facturacion_30d ?? pub.revenue30d ?? pub.revenue ?? 0,
  }
}

const sortedPublications = computed(() =>
  props.publications
    .map(normalize)
    .filter(p => p.revenue > 0 && p.mlaId)
    .sort((a, b) => b.revenue - a.revenue)
)

const totalRevenue = computed(() =>
  sortedPublications.value.reduce((sum, p) => sum + p.revenue, 0)
)

const paretoData = computed(() => {
  let cumulative = 0
  return sortedPublications.value.map((p) => {
    const share = totalRevenue.value > 0 ? (p.revenue / totalRevenue.value) * 100 : 0
    cumulative += share
    return {
      mlaId: p.mlaId,
      productId: p.productId,
      label: p.mlaId,
      fullLabel: p.titulo,
      revenue: p.revenue,
      share,
      cumulative,
    }
  })
})

const vitalCount = computed(() => {
  const idx = paretoData.value.findIndex(p => p.cumulative >= 80)
  return idx === -1 ? paretoData.value.length : idx + 1
})

const vitalShare = computed(() => {
  const v = paretoData.value[vitalCount.value - 1]
  return v ? Math.round(v.cumulative) : 0
})

const trivialCount = computed(() => Math.max(0, paretoData.value.length - vitalCount.value))
const trivialShare = computed(() => Math.max(0, 100 - vitalShare.value))

const concentrationLabel = computed(() => {
  const ratio = paretoData.value.length > 0 ? vitalCount.value / paretoData.value.length : 0
  if (ratio < 0.15) return 'Muy alta'
  if (ratio < 0.3) return 'Alta'
  if (ratio < 0.5) return 'Media'
  return 'Baja'
})

const concentrationColor = computed(() => {
  const label = concentrationLabel.value
  if (label === 'Muy alta' || label === 'Alta') return 'text-yellow-600 dark:text-yellow-400'
  if (label === 'Media') return 'text-primary-600 dark:text-primary-400'
  return 'text-green-600 dark:text-green-400'
})

const concentrationDescription = computed(() => {
  const label = concentrationLabel.value
  if (label === 'Muy alta' || label === 'Alta') return 'Riesgo de dependencia en pocas publicaciones'
  if (label === 'Media') return 'Distribución típica 80/20'
  return 'Ingresos repartidos entre varias publicaciones'
})

const displayPublications = computed(() => paretoData.value.slice(0, props.maxBars))

function handleBarClick(_evt, elements) {
  if (!elements.length) return
  const idx = elements[0].index
  const pub = displayPublications.value[idx]
  if (!pub || !pub.productId || !pub.mlaId) return
  navigateTo(`${ROUTE_NAMES.PRODUCTOS}/${pub.productId}/${pub.mlaId}`)
}

const chartData = computed(() => ({
  labels: displayPublications.value.map(p => p.label),
  datasets: [
    {
      type: 'bar',
      label: 'Ingresos',
      data: displayPublications.value.map(p => p.revenue),
      backgroundColor: displayPublications.value.map((p, i) =>
        i < vitalCount.value ? chartColors.value.primary : chartColors.value.barMuted
      ),
      hoverBackgroundColor: displayPublications.value.map((p, i) =>
        i < vitalCount.value ? chartColors.value.primary : chartColors.value.barAccentMuted
      ),
      borderRadius: 6,
      borderSkipped: false,
      yAxisID: 'y',
      order: 2,
    },
    {
      type: 'line',
      label: '% Acumulado',
      data: displayPublications.value.map(p => Math.round(p.cumulative * 10) / 10),
      borderColor: chartColors.value.muted,
      backgroundColor: chartColors.value.muted,
      borderWidth: 2,
      tension: 0.3,
      pointRadius: 3,
      pointHoverRadius: 6,
      pointBackgroundColor: chartColors.value.muted,
      pointBorderColor: chartColors.value.pointHoverBorder,
      pointBorderWidth: 2,
      yAxisID: 'y1',
      order: 1,
    },
  ],
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  onClick: handleBarClick,
  onHover: (event, elements) => {
    const target = event.native?.target
    if (target) target.style.cursor = elements.length ? 'pointer' : 'default'
  },
  interaction: {
    intersect: false,
    mode: 'index',
  },
  plugins: {
    legend: { display: false },
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
        title: (items) => {
          const idx = items[0]?.dataIndex
          if (idx == null) return ''
          const pub = displayPublications.value[idx]
          return pub ? `${pub.mlaId} · ${truncate(pub.fullLabel, 48)}` : ''
        },
        label: (ctx) => {
          if (ctx.dataset.type === 'bar') {
            return ` Ingresos: $${ctx.parsed.y.toLocaleString('es-AR')}`
          }
          return ` % acumulado: ${ctx.parsed.y}%`
        },
        afterBody: () => ['', 'Click para ver detalle'],
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        color: chartColors.value.tickColor,
        font: { family: 'Outfit', size: 11 },
        maxRotation: 60,
        minRotation: 60,
        autoSkip: false,
      },
      border: { display: false },
    },
    y: {
      position: 'left',
      grid: {
        color: chartColors.value.gridColor,
      },
      ticks: {
        color: chartColors.value.tickColor,
        font: { family: 'Outfit', size: 12 },
        callback: (value) => `$${(value / 1000).toFixed(0)}k`,
      },
      border: { display: false },
    },
    y1: {
      position: 'right',
      min: 0,
      max: 100,
      grid: { display: false },
      ticks: {
        color: chartColors.value.tickColor,
        font: { family: 'Outfit', size: 12 },
        callback: (value) => `${value}%`,
      },
      border: { display: false },
    },
  },
}))

function truncate(str, max) {
  if (!str) return ''
  return str.length > max ? str.slice(0, max) + '…' : str
}
</script>
