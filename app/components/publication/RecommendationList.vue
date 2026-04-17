<template>
  <div class="flex flex-col gap-6 h-full">
    <h3 class="font-bold text-on-surface">Recomendaciones</h3>
    <div v-if="sortedRecommendations.length" class="flex flex-col gap-4">
      <div v-for="rec in sortedRecommendations" :key="rec.titulo" class="flex gap-2">
        <Icon :name="rec.icon" class="size-8 shrink-0"
          :class="rec.prioridad === 'alta' ? 'text-yellow-600 dark:text-yellow-400' : rec.prioridad === 'media' ? 'text-primary-600 dark:text-primary-400' : 'text-on-surface-variant'" />
        <div class="flex-1 min-w-0 flex flex-col gap-1">
          <div class="flex items-center justify-between gap-2">
            <p class="text-base font-bold text-on-surface">{{ rec.titulo }}</p>
            <span class="text-[15px] rounded px-1.5 py-0.5 shrink-0" :class="priorityConfig[rec.prioridad]?.color">
              {{ priorityConfig[rec.prioridad]?.label }}
            </span>
          </div>
          <p class="text-base text-on-surface">{{ rec.descripcion }}</p>
          <a v-if="rec.link" :href="rec.link" target="_blank" rel="noopener noreferrer"
            class="w-max flex items-center gap-1 mt-1 text-sm font-semibold text-primary-600 dark:text-primary-400 border-b border-primary-600 dark:border-primary-400">
            Resolver en Mercado Libre
            <Icon name="i-tabler-external-link" class="size-4" />
          </a>
        </div>
      </div>
    </div>
    <div v-else class="flex flex-col items-center justify-center gap-2 py-10 text-center">
      <Icon name="i-tabler-circle-check-filled" class="size-10 text-green-600 dark:text-green-400" />
      <p class="text-base font-semibold text-on-surface">¡Publicación en orden!</p>
      <p class="text-sm text-on-surface-variant max-w-xs">No hay recomendaciones pendientes para esta publicación.</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  recommendations: { type: Array, required: true },
})

const priorityConfig = {
  alta: { color: 'bg-red-400/10 text-red-600 dark:text-red-400', label: 'Alta prioridad', order: 0 },
  media: { color: 'bg-outline-variant/20 text-on-surface-variant', label: 'Media prioridad', order: 1 },
  baja: { color: 'bg-outline-variant/10 text-on-surface-variant', label: 'Baja prioridad', order: 2 },
}

const sortedRecommendations = computed(() => {
  return [...props.recommendations].sort((a, b) => {
    const orderA = priorityConfig[a.prioridad]?.order ?? 99
    const orderB = priorityConfig[b.prioridad]?.order ?? 99
    return orderA - orderB
  })
})
</script>