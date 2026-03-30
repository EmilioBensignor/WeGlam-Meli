<template>
  <div class="bg-surface-lowest rounded-xl border border-outline-variant/30 overflow-hidden">
    <div class="flex justify-between items-center p-4">
      <HeadingH1 :level="2">{{ title }}</HeadingH1>
      <NuxtLink class="text-sm font-bold text-primary-500 dark:text-primary-400" :to="ROUTE_NAMES.PRODUCTOS">
        Ver todo
      </NuxtLink>
    </div>

    <UTable :data="tableData" :columns="columns"
      :ui="{ root: 'w-full', thead: 'py-2 px-4', th: 'text-sm text-on-surface dark:text-on-surface-variant font-medium', td: 'py-3.5 px-4 text-sm text-on-surface dark:text-on-surface' }">
      <template #rank-cell="{ row }">
        <span class=" text-on-surface dark:text-on-surface-variant">{{ row.original.rank }}</span>
      </template>

      <template #nombre-cell="{ row }">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg overflow-hidden shrink-0">
            <img :src="row.original.imagen" :alt="row.original.nombre" class="w-full h-full object-cover">
          </div>
          <div class="flex flex-col items-start gap-1.5">
            <NuxtLink :to="`${ROUTE_NAMES.PRODUCTOS}/${row.original.id}`" class="font-bold text-on-surface hover:text-primary-600 dark:hover:text-primary-400 transition-colors">{{ row.original.nombre }}</NuxtLink>
            <SharedStatusBadge v-if="row.original.badge" :status="row.original.badge" />
          </div>
        </div>
      </template>

      <template #unidades-cell="{ row }">
        <span class=" text-right block text-on-surface dark:text-on-surface">{{ row.original.unidades.toLocaleString('es-AR') }}</span>
      </template>

      <template #revenue-cell="{ row }">
        <span class="font-bold text-right block" :class="type === 'top' ? 'text-primary-500 dark:text-primary-400' : 'text-on-surface dark:text-on-surface'">
          {{ formatCurrency(row.original.revenue) }}
        </span>
      </template>
    </UTable>
  </div>
</template>

<script setup>
import { ROUTE_NAMES } from '~/constants/ROUTE_NAMES.js'

const props = defineProps({
  products: { type: Array, required: true },
  type: { type: String, required: true },
})

const title = computed(() => props.type === 'top' ? 'Top más vendidos' : 'Top peores vendidos')

const columns = [
  { accessorKey: 'rank', header: '#' },
  { accessorKey: 'nombre', header: 'Producto' },
  { accessorKey: 'unidades', header: 'Unidades', meta: { class: { th: 'text-right', td: 'text-right' } } },
  { accessorKey: 'revenue', header: 'Revenue', meta: { class: { th: 'text-right', td: 'text-right' } } },
]

const tableData = computed(() =>
  props.products.map((p, i) => ({ ...p, rank: i + 1 }))
)

</script>