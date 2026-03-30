<template>
  <div v-if="loading" class="space-y-3">
    <div v-for="i in 5" :key="i"
      class="h-16 bg-surface-lowest rounded-xl animate-pulse border border-outline-variant/30" />
  </div>

  <UTable v-else-if="publications.length" :data="publications" :columns="columns" :ui="{
    root: 'w-full',
    thead: 'bg-surface-lowest',
    th: 'text-sm text-on-surface-variant font-medium px-4 py-3 cursor-default whitespace-nowrap',
    td: 'px-4 py-3 text-sm',
    tr: 'hover:bg-surface-high/50 cursor-pointer transition-colors duration-300 first:hover:bg-transparent first:cursor-default',
  }" @select="(e, row) => emit('select', row)">
    <template #imagen-cell="{ row }">
      <div class="w-12 h-12 rounded-lg bg-surface-highest border border-outline-variant/30 overflow-hidden shrink-0">
        <img :src="row.original.imagen" :alt="row.original.titulo" class="w-full h-full object-cover">
      </div>
    </template>

    <template #mlaId-cell="{ row }">
      <span class="text-on-surface-variant text-sm">{{ row.original.mlaId }}</span>
    </template>

    <template #titulo-cell="{ row }">
      <span class="text-on-surface font-medium">{{ row.original.titulo }}</span>
    </template>

    <template #precio-cell="{ row }">
      <span class="font-semibold text-on-surface">{{ formatCurrency(row.original.precio) }}</span>
    </template>

    <template #stock-cell="{ row }">
      <span class="text-on-surface">{{ row.original.stock }}</span>
    </template>

    <template #visitas30d-cell="{ row }">
      <span class="text-on-surface">{{ row.original.visitas30d?.toLocaleString('es-AR') || '-' }}</span>
    </template>

    <template #ventas30d-cell="{ row }">
      <span class="text-on-surface">{{ row.original.ventas30d?.toLocaleString('es-AR') || '-' }}</span>
    </template>

    <template #conversion-cell="{ row }">
      <span class="text-on-surface">{{ row.original.conversion ? `${row.original.conversion}%` : '-' }}</span>
    </template>

    <template #estado-cell="{ row }">
      <SharedStatusBadge
        :status="row.original.estado === 'active' ? 'Activa' : row.original.estado === 'paused' ? 'Pausada' : 'Cerrada'" />
    </template>

    <template #healthScore-cell="{ row }">
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full" :class="healthDotColor(row.original.healthScore)" />
        <span class="text-on-surface">{{ row.original.healthScore }}</span>
      </div>
    </template>
  </UTable>

  <div v-else class="text-center py-20">
    <Icon name="i-tabler-file-off" class="size-12 text-on-surface-variant/40 mx-auto mb-4" />
    <p class="text-on-surface-variant text-lg">No se encontraron publicaciones</p>
    <p class="text-on-surface-variant/60 text-sm mt-1">Probá ajustando los filtros</p>
  </div>
</template>

<script setup>
const props = defineProps({
  publications: { type: Array, required: true },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['select'])

const columns = [
  { accessorKey: 'imagen', header: '' },
  { accessorKey: 'mlaId', header: 'MLA ID' },
  { accessorKey: 'titulo', header: 'Título' },
  { accessorKey: 'precio', header: 'Precio' },
  { accessorKey: 'stock', header: 'Stock' },
  { accessorKey: 'visitas30d', header: 'Visitas 30d' },
  { accessorKey: 'ventas30d', header: 'Ventas 30d' },
  { accessorKey: 'conversion', header: 'Conv. %' },
  { accessorKey: 'estado', header: 'Estado' },
  { accessorKey: 'healthScore', header: 'Salud' },
]


function healthDotColor(score) {
  if (score >= 70) return 'bg-green-400'
  if (score >= 40) return 'bg-yellow-400'
  return 'bg-red-400'
}
</script>