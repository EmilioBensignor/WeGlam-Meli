<template>
  <div class="flex flex-col gap-4 bg-surface-lowest rounded-xl border border-outline-variant/30 p-4">
    <div class="flex justify-between items-center">
      <HeadingH1 :level="2">Performance de pauta</HeadingH1>
      <p class="text-on-surface">Gasto vs Retorno semanal</p>
    </div>

    <div class="flex-1 min-h-48" role="img" aria-label="Gráfico de gasto publicitario vs retorno semanal">
      <Bar :key="colorMode.value" :data="chartData" :options="chartOptions" />
    </div>

    <div class="flex justify-between">
      <div>
        <p class="text-sm text-on-surface font-medium">ROI Promedio</p>
        <p class="text-2xl font-bold text-primary-500 dark:text-primary-400">{{ roiPromedio }}x</p>
      </div>
      <div class="text-right">
        <p class="text-sm text-on-surface font-medium">Inversión Total</p>
        <p class="text-2xl font-bold text-on-surface">{{ inversionTotal }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Bar } from 'vue-chartjs'

const props = defineProps({
  data: { type: Array, required: true },
})

const { colorMode, chartColors } = useChartTheme()

const roiPromedio = computed(() => {
  const totalRetorno = props.data.reduce((acc, d) => acc + d.retorno, 0)
  const totalGasto = props.data.reduce((acc, d) => acc + d.gasto, 0)
  return totalGasto > 0 ? (totalRetorno / totalGasto).toFixed(1) : '0'
})

const inversionTotal = computed(() => {
  const total = props.data.reduce((acc, d) => acc + d.gasto, 0)
  return `$${(total / 1000).toFixed(1)}k`
})

const chartData = computed(() => ({
  labels: props.data.map(d => d.label),
  datasets: [
    {
      label: 'Gasto',
      data: props.data.map(d => d.gasto),
      backgroundColor: colorMode.value === 'dark' ? '#889297' : '#5A6370',
      borderRadius: 2,
      barPercentage: 0.4,
      categoryPercentage: 0.6,
    },
    {
      label: 'Retorno',
      data: props.data.map(d => d.retorno),
      backgroundColor: '#6CC3E0',
      borderRadius: 2,
      barPercentage: 0.4,
      categoryPercentage: 0.6,
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
        label: (ctx) => `${ctx.dataset.label}: $${ctx.parsed.y.toLocaleString('es-AR')}`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        color: colorMode.value === 'dark' ? '#FFFFFF' : '#000000',
        font: { family: 'Outfit', size: 14 },
      },
      border: { display: false },
    },
    y: {
      grid: {
        color: chartColors.value.gridColor,
      },
      ticks: {
        color: colorMode.value === 'dark' ? '#FFFFFF' : '#000000',
        font: { family: 'Outfit', size: 14 },
        callback: (value) => `$${(value / 1000).toFixed(0)}k`,
      },
      border: { display: false },
    },
  },
}))
</script>