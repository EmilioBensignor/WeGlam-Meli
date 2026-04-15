<template>
  <div class="flex flex-col gap-6">
    <h3 class="font-bold text-on-surface">Recomendaciones</h3>
    <div class="flex flex-col gap-4">
      <div v-for="rec in recommendations" :key="rec.titulo" class="flex gap-2">
        <Icon :name="rec.icon" class="size-8 shrink-0"
          :class="rec.prioridad === 'alta' ? 'text-yellow-600 dark:text-yellow-400' : rec.prioridad === 'media' ? 'text-primary-600 dark:text-primary-400' : 'text-on-surface-variant'" />
        <div class="flex-1 min-w-0 flex flex-col gap-1">
          <div class="flex items-center justify-between">
            <p class="text-base font-bold text-on-surface">{{ rec.titulo }}</p>
            <span class="text-[15px] rounded px-1.5 py-0.5" :class="priorityConfig[rec.prioridad]?.color">
              {{ priorityConfig[rec.prioridad]?.label }}
            </span>
          </div>
          <p class="text-base text-on-surface">{{ rec.descripcion }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  recommendations: { type: Array, required: true },
})

const priorityConfig = {
  alta: { color: 'bg-red-400/10 text-red-600 dark:text-red-400', label: 'Alta' },
  media: { color: 'bg-outline-variant/20 text-on-surface-variant', label: 'Media' },
  baja: { color: 'bg-outline-variant/10 text-on-surface-variant', label: 'Baja' },
}
</script>