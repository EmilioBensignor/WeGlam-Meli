<template>
  <div v-if="loading" class="space-y-3">
    <div v-for="i in 5" :key="i"
      class="h-16 bg-surface-lowest rounded-xl animate-pulse border border-outline-variant/30" />
  </div>

  <UTable v-else-if="publications.length" :data="publications" :columns="columns" :ui="{
    root: 'w-full',
    base: 'table-fixed w-full',
    thead: 'bg-surface-lowest',
    th: 'text-sm text-on-surface-variant font-medium px-4 py-3 cursor-default whitespace-nowrap',
    td: 'px-4 py-3 text-sm',
    tr: 'hover:bg-surface-high/50 transition-colors duration-300 first:hover:bg-transparent',
  }">
    <template #imagen-cell="{ row }">
      <div class="w-12 h-12 rounded-lg bg-surface-highest border border-outline-variant/30 overflow-hidden shrink-0">
        <NuxtImg :src="row.original.imagen" :alt="row.original.titulo" class="w-full h-full object-cover" loading="lazy" />
      </div>
    </template>

    <template #mlaId-cell="{ row }">
      <button type="button" @click="copyMla(row.original.mlaId)"
        class="group inline-flex items-center gap-1.5 text-on-surface-variant hover:text-on-surface transition-colors"
        :title="`Copiar ${row.original.mlaId}`">
        <span>{{ row.original.mlaId }}</span>
        <Icon :name="copiedMla === row.original.mlaId ? 'i-tabler-check' : 'i-tabler-copy'"
          class="size-3.5 opacity-0 group-hover:opacity-100 transition-opacity"
          :class="{ 'opacity-100 text-green-600 dark:text-green-400': copiedMla === row.original.mlaId }" />
      </button>
    </template>

    <template #titulo-cell="{ row }">
      <button type="button" @click="emit('select', row)"
        class="text-left text-on-surface font-medium line-clamp-2 leading-snug hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
        {{ row.original.titulo }}
      </button>
    </template>

    <template #precio-cell="{ row }">
      <div class="flex flex-col">
        <span class="font-semibold text-on-surface">{{ formatCurrency(row.original.precio) }}</span>
        <span v-if="row.original.precioOriginal" class="text-xs text-on-surface-variant line-through">
          {{ formatCurrency(row.original.precioOriginal) }}
        </span>
      </div>
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
        :status="row.original.estado === 'active' ? 'Activa' : row.original.estado === 'paused' ? 'Pausada' : 'Inactiva'" />
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

const { success, error: notifyError } = useNotification()
const copiedMla = ref(null)

async function copyMla(mla) {
  try {
    await navigator.clipboard.writeText(mla)
    copiedMla.value = mla
    success(`${mla} copiado`)
    setTimeout(() => {
      if (copiedMla.value === mla) copiedMla.value = null
    }, 1500)
  } catch (e) {
    notifyError('No se pudo copiar el MLA')
  }
}

const columns = [
  { accessorKey: 'imagen', header: '', meta: { style: { th: { width: '72px' }, td: { width: '72px' } } } },
  { accessorKey: 'mlaId', header: 'MLA ID', meta: { style: { th: { width: '130px' }, td: { width: '130px' } } } },
  { accessorKey: 'titulo', header: 'Título', meta: { style: { td: { maxWidth: '0', overflow: 'hidden' } } } },
  { accessorKey: 'precio', header: 'Precio', meta: { style: { th: { width: '110px' }, td: { width: '110px' } } } },
  { accessorKey: 'stock', header: 'Stock', meta: { style: { th: { width: '70px' }, td: { width: '70px' } } } },
  { accessorKey: 'visitas30d', header: 'Visitas 30d', meta: { style: { th: { width: '100px' }, td: { width: '100px' } } } },
  { accessorKey: 'ventas30d', header: 'Ventas 30d', meta: { style: { th: { width: '100px' }, td: { width: '100px' } } } },
  { accessorKey: 'conversion', header: 'Conv. %', meta: { style: { th: { width: '90px' }, td: { width: '90px' } } } },
  { accessorKey: 'estado', header: 'Estado', meta: { style: { th: { width: '100px' }, td: { width: '100px' } } } },
  { accessorKey: 'healthScore', header: 'Salud', meta: { style: { th: { width: '80px' }, td: { width: '80px' } } } },
]


import { getHealthBgColor } from '~/constants/HEALTH_THRESHOLDS.js'

function healthDotColor(score) {
  return getHealthBgColor(score)
}
</script>