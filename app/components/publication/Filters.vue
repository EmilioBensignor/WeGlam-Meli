<template>
  <div class="flex flex-wrap items-end justify-between gap-4">
    <div class="flex items-end gap-4 flex-wrap">
      <div class="w-64 flex flex-col gap-1.5">
        <label class="text-base text-on-surface font-medium">Buscar</label>
        <UInput v-model="searchQuery" placeholder="Buscar por título o MLA..." icon="i-tabler-search" size="lg"
          variant="outline" color="neutral" />
      </div>
      <div class="flex flex-col gap-1.5">
        <label class="text-base text-on-surface font-medium">Estado</label>
        <USelect :model-value="selectedStatus || 'all'" :items="statusOptions" placeholder="Todas" size="lg"
          variant="outline" color="neutral" class="min-w-40" @update:model-value="onStatusChange" />
      </div>
    </div>
    <div class="flex bg-surface-high rounded-xl p-1 border border-outline-variant/30">
      <button v-for="opt in sortOptions" :key="opt.value" :aria-pressed="sortBy === opt.value"
        class="text-base font-medium rounded-lg px-4 py-2 transition-all duration-300" :class="sortBy === opt.value
          ? 'bg-primary-400 text-black shadow-sm font-semibold'
          : 'text-on-surface'" @click="sortBy = opt.value">
        {{ opt.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
const searchQuery = defineModel('searchQuery', { default: '' })
const selectedStatus = defineModel('selectedStatus', { default: null })
const sortBy = defineModel('sortBy', { default: 'ventas' })

const statusOptions = [
  { label: 'Todas', value: 'all' },
  { label: 'Activa', value: 'active' },
  { label: 'Pausada', value: 'paused' },
  { label: 'Cerrada', value: 'closed' },
]

const sortOptions = [
  { label: 'Más ventas', value: 'ventas' },
  { label: 'Mayor precio', value: 'precio' },
  { label: 'Mayor stock', value: 'stock' },
  { label: 'Mejor salud', value: 'health' },
]

function onStatusChange(val) {
  selectedStatus.value = val === 'all' ? null : val
}
</script>
