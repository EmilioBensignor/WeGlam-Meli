<template>
  <section class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
    <div class="flex flex-col gap-2 bg-surface-lowest rounded-xl border border-outline-variant/30 p-4">
      <p class="text-on-surface-variant">Visitas 30d</p>
      <div class="flex items-end justify-between">
        <span class="text-2xl font-bold text-on-surface">{{ formatNumber(metrics.visitas30d) }}</span>
        <SharedTrendBadge v-if="metrics.tendenciaVisitas30d" :value="metrics.tendenciaVisitas30d" size="md" />
      </div>
    </div>

    <div class="flex flex-col gap-2 bg-surface-lowest rounded-xl border border-outline-variant/30 p-4">
      <p class="text-on-surface-variant">Ventas 30d</p>
      <div class="flex items-end justify-between">
        <span class="text-2xl font-bold text-on-surface">{{ formatNumber(metrics.ventas30d) }}</span>
        <SharedTrendBadge v-if="metrics.tendenciaVentas30d" :value="metrics.tendenciaVentas30d" size="md" />
      </div>
    </div>

    <div class="flex flex-col gap-2 bg-surface-lowest rounded-xl border border-outline-variant/30 p-4">
      <p class="text-on-surface-variant">Stock</p>
      <span class="text-2xl font-bold text-on-surface">{{ stock }}</span>
    </div>

    <div class="flex flex-col gap-2 bg-surface-lowest rounded-xl border border-outline-variant/30 p-4">
      <p class="text-on-surface-variant">Conversión</p>
      <div class="flex items-end justify-between">
        <span class="text-2xl font-bold text-on-surface">{{ metrics.conversion }}%</span>
        <SharedTrendBadge v-if="metrics.tendenciaConversion" :value="metrics.tendenciaConversion" size="md" />
      </div>
    </div>

    <div class="flex flex-col gap-2 bg-surface-lowest rounded-xl border border-outline-variant/30 p-4">
      <p class="text-on-surface-variant">Facturación 30d</p>
      <span class="text-2xl font-bold text-on-surface">{{ formatRevenue(metrics.facturacion30d) }}</span>
    </div>

    <div class="flex flex-col gap-2 bg-surface-lowest rounded-xl border border-outline-variant/30 p-4">
      <p class="text-on-surface-variant">Sin responder</p>
      <div class="flex items-center gap-2">
        <span class="text-2xl font-bold" :class="metrics.preguntasSinResponder > 0 ? 'text-yellow-600 dark:text-yellow-400' : 'text-on-surface'">
          {{ metrics.preguntasSinResponder }}
        </span>
        <Icon v-if="metrics.preguntasSinResponder > 0" name="i-tabler-alert-triangle" class="text-yellow-600 dark:text-yellow-400 size-5" />
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  metrics: { type: Object, required: true },
  stock: { type: Number, default: 0 },
  stockMax: { type: Number, default: 200 },
})
</script>
