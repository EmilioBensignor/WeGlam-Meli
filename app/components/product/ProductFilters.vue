<template>
  <div class="flex flex-wrap items-end justify-between gap-4 mb-4">
    <div class="flex items-end gap-4 flex-wrap">
      <div class="w-64 flex flex-col gap-1.5">
        <label class="text-base text-on-surface font-medium">Buscar</label>
        <UInput v-model="searchQuery" placeholder="Buscar por título o MLA..." icon="i-tabler-search" size="lg"
          variant="outline" color="neutral" />
      </div>

      <div class="flex flex-col gap-1.5">
        <label class="text-base text-on-surface font-medium">Estado</label>
        <USelect :model-value="selectedStatus || 'all'" :items="statusOptions" placeholder="Todos" size="lg"
          variant="outline" color="neutral" class="min-w-44" @update:model-value="onStatusChange" />
      </div>

      <div class="flex flex-col gap-1.5">
        <label class="text-base text-on-surface font-medium">Salud</label>
        <USelect :model-value="selectedHealth || 'all'" :items="healthOptions" placeholder="Todas" size="lg"
          variant="outline" color="neutral" class="min-w-40" @update:model-value="onHealthChange" />
      </div>
    </div>

    <div class="flex bg-surface-high rounded-xl p-1 border border-outline-variant/30">
      <button v-for="opt in sortOptions" :key="opt.value" :aria-pressed="sortBy === opt.value"
        class="text-base font-medium rounded-lg px-4 py-2 transition-all duration-300" :class="sortBy === opt.value
          ? 'bg-primary-400 text-black shadow-sm'
          : 'text-on-surface'" @click="sortBy = opt.value">
        {{ opt.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
const searchQuery = defineModel('searchQuery', { default: '' })
const selectedStatus = defineModel('selectedStatus', { default: null })
const selectedHealth = defineModel('selectedHealth', { default: null })
const sortBy = defineModel('sortBy', { default: 'ventas' })

const statusOptions = [
  { label: 'Todos', value: 'all' },
  { label: 'Activas', value: 'active' },
  { label: 'Pausadas', value: 'paused' },
  { label: 'Con preguntas', value: 'con_preguntas' },
  { label: 'Sin stock', value: 'sin_stock' },
  { label: 'Con stock', value: 'con_stock' },
]

const healthOptions = [
  { label: 'Todas', value: 'all' },
  { label: 'Saludable (≥70)', value: 'saludable' },
  { label: 'Mejorable (40-69)', value: 'mejorable' },
  { label: 'Crítico (<40)', value: 'critico' },
]

const sortOptions = [
  { label: 'Más vendidos', value: 'ventas' },
  { label: 'Menos vendidos', value: 'peores' },
  { label: 'Mejor salud', value: 'mejor_salud' },
  { label: 'Peor salud', value: 'peor_salud' },
  { label: 'Más publicaciones', value: 'mas_publicaciones' },
  { label: 'Menos publicaciones', value: 'menos_publicaciones' },
]

function onStatusChange(val) {
  selectedStatus.value = val === 'all' ? null : val
}

function onHealthChange(val) {
  selectedHealth.value = val === 'all' ? null : val
}
</script>
