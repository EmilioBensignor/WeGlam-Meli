<template>
  <section class="h-full flex flex-col gap-4 bg-surface-lowest rounded-xl border border-outline-variant/30  p-4">
    <div class="flex items-center justify-between">
      <HeadingH1 :level="2">Desglose de Rentabilidad</HeadingH1>
      <span class="bg-green-400/15 text-green-600 dark:text-green-400 text-base font-semibold rounded px-2 py-1">
        {{ profit.margen }}% Margen
      </span>
    </div>

    <div class="flex flex-col gap-3 flex-1 text-base">
      <div class="flex justify-between items-center py-2">
        <span class="text-on-surface">Precio de venta</span>
        <span class="flex items-center gap-2">
          <span v-if="profit.precioOriginal" class="text-sm text-on-surface-variant line-through">
            {{ formatProfitValue(profit.precioOriginal) }}
          </span>
          <span class="font-bold text-on-surface">{{ formatProfitValue(profit.precioVenta) }}</span>
        </span>
      </div>
      <div class="flex justify-between items-center py-2">
        <span class="text-on-surface">Costo de producto</span>
        <span class="font-bold text-red-600 dark:text-red-400">-{{ formatProfitValue(profit.costoProducto) }}</span>
      </div>
      <div class="flex justify-between items-center py-2">
        <span class="text-on-surface">Comisión MeLi{{ profit.porcentajeComision != null ? ` (${profit.porcentajeComision}%)` : '' }}</span>
        <span class="font-bold text-on-surface">-{{ formatProfitValue(profit.comisionMeli) }}</span>
      </div>
      <div class="flex justify-between items-center py-2">
        <span class="text-on-surface">Envío Full</span>
        <span class="font-bold text-on-surface">-{{ formatProfitValue(profit.envio) }}</span>
      </div>
      <div class="flex justify-between items-center py-2">
        <span class="text-on-surface">Impuestos est.</span>
        <span class="font-bold text-on-surface">-{{ formatProfitValue(profit.impuestos) }}</span>
      </div>
      <div class="flex justify-between items-center py-2">
        <span class="text-on-surface">Publicidad (Ads)</span>
        <span class="font-bold text-on-surface">-{{ formatProfitValue(profit.publicidad) }}</span>
      </div>
    </div>

    <div class="border-t border-primary-400/20 rounded-b-xl -mx-4 -mb-4 p-4">
      <div class="flex justify-between items-end">
        <div class="flex flex-col gap-1">
          <p class="text-primary-600 dark:text-primary-400">Ganancia Neta</p>
          <p class="text-2xl font-black text-primary-600 dark:text-primary-400 tracking-tighter">{{ formatProfitValue(profit.gananciaNeta) }}</p>
        </div>
        <div class="flex flex-col gap-1 text-right">
          <span class="text-on-surface">ROI</span>
          <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ profit.roi }}x</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  profit: { type: Object, required: true },
})

function formatProfitValue(val) {
  return `$${Math.abs(val).toLocaleString('es-AR', { minimumFractionDigits: 2 })}`
}
</script>