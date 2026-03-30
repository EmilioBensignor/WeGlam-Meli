<template>
  <div class="flex flex-wrap items-end justify-between gap-4 mb-4">
    <div class="flex items-end gap-4 flex-wrap">
      <div class="w-64 flex flex-col gap-1.5">
        <label class="text-on-surface font-light">Buscar</label>
        <UInput v-model="searchQuery" placeholder="Buscar producto..." icon="i-tabler-search" size="md"
          variant="outline" color="neutral" />
      </div>

      <div class="flex flex-col gap-1.5">
        <label class="text-on-surface font-light">
          Categoría
        </label>
        <USelect :model-value="selectedCategory || 'all'" :items="categoryOptions" placeholder="Todas" size="md"
          variant="outline" color="neutral" class="min-w-40" @update:model-value="onCategoryChange" />
      </div>

      <div class="flex flex-col gap-1.5">
        <label class="text-on-surface font-light">
          Estado
        </label>
        <USelect :model-value="selectedStatus || 'all'" :items="statusOptions" placeholder="Todos" size="md"
          variant="outline" color="neutral" class="min-w-40" @update:model-value="onStatusChange" />
      </div>
    </div>

    <div class="flex bg-surface-high rounded-xl p-1 border border-outline-variant/30">
      <button v-for="opt in sortOptions" :key="opt.value" :aria-pressed="sortBy === opt.value"
        class="text-sm font-medium rounded-lg px-4 py-1.5 transition-all duration-300" :class="sortBy === opt.value
          ? 'bg-primary-400 text-black shadow-sm'
          : 'text-on-surface'" @click="sortBy = opt.value">
        {{ opt.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  categories: { type: Array, default: () => [] },
})

const searchQuery = defineModel('searchQuery', { default: '' })
const selectedCategory = defineModel('selectedCategory', { default: null })
const selectedStatus = defineModel('selectedStatus', { default: null })
const sortBy = defineModel('sortBy', { default: 'ventas' })

const categoryOptions = computed(() => [
  { label: 'Todas', value: 'all' },
  ...props.categories.map(c => ({ label: c, value: c })),
])

const statusOptions = [
  { label: 'Todos', value: 'all' },
  { label: 'Con stock', value: 'con_stock' },
  { label: 'Sin stock', value: 'sin_stock' },
]

const sortOptions = [
  { label: 'Más vendidos', value: 'ventas' },
  { label: 'Más publicaciones', value: 'publicaciones' },
  { label: 'Alfabético', value: 'alfabetico' },
]

function onCategoryChange(val) {
  selectedCategory.value = val === 'all' ? null : val
}

function onStatusChange(val) {
  selectedStatus.value = val === 'all' ? null : val
}
</script>