<template>
  <div class="flex flex-col gap-4 bg-surface-lowest rounded-xl border border-outline-variant/30 p-4">
    <div class="flex justify-between items-start">
      <div class="flex flex-col gap-1">
        <HeadingH1 :level="2">Ventas generales</HeadingH1>
        <p class="text-on-surface text-base">Tendencia de ingresos últimos 30 días</p>
      </div>
      <div class="flex items-center gap-2">
        <span class="w-4 h-4 rounded-full bg-primary-400" />
        <span class="text-sm  text-on-surface">Ingresos Brutos</span>
      </div>
    </div>
    <div class="flex-1 min-h-48 w-full" role="img" aria-label="Gráfico de tendencia de ingresos brutos de los últimos 30 días">
      <div v-if="!props.data.length" class="h-48 flex items-center justify-center">
        <p class="text-on-surface-variant text-sm">Sin datos disponibles</p>
      </div>
      <Line v-else :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup>
import { Line } from 'vue-chartjs'

const props = defineProps({
  data: { type: Array, required: true },
})

const { colorMode, chartColors } = useChartTheme()

const chartData = computed(() => ({
  labels: props.data.map(d => d.label),
  datasets: [
    {
      label: 'Ingresos Brutos',
      data: props.data.map(d => d.value),
      borderColor: chartColors.value.primary,
      backgroundColor: (ctx) => {
        const chart = ctx.chart
        const { ctx: canvasCtx, chartArea } = chart
        if (!chartArea) return chartColors.value.gradientStart
        const gradient = canvasCtx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
        gradient.addColorStop(0, chartColors.value.gradientStart)
        gradient.addColorStop(1, chartColors.value.gradientEnd)
        return gradient
      },
      borderWidth: 2.5,
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 6,
      pointHoverBackgroundColor: chartColors.value.primary,
      pointHoverBorderColor: chartColors.value.pointHoverBorder,
      pointHoverBorderWidth: 3,
    },
  ],
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    intersect: false,
    mode: 'index',
  },
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
        label: (ctx) => `$${ctx.parsed.y.toLocaleString('es-AR')}`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        color: chartColors.value.tickColor,
        font: { family: 'Outfit', size: 14 },
        maxTicksLimit: 5,
      },
      border: { display: false },
    },
    y: {
      grid: {
        color: chartColors.value.gridColor,
      },
      ticks: {
        color: chartColors.value.tickColor,
        font: { family: 'Outfit', size: 14 },
        callback: (value) => `$${(value / 1000).toFixed(0)}k`,
      },
      border: { display: false },
    },
  },
}))
</script>