<template>
  <section class="flex flex-col md:flex-row gap-4 items-start">
    <div class="w-40 h-40 bg-surface-lowest rounded-lg overflow-hidden shrink-0 group">
      <NuxtImg :src="publication.imagen" :alt="publication.titulo"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
    </div>

    <div class="min-w-0 h-full flex-1 flex flex-col justify-between">
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <SharedStatusBadge :status="statusLabel" />
          <span class="text-base text-on-surface-variant">{{ publication.mlaId }}</span>
        </div>
        <HeadingH1>{{ publication.titulo }}</HeadingH1>
        <div class="flex items-center gap-6">
          <div class="flex items-center gap-2">
            <span class="text-3xl font-bold text-primary-600 dark:text-primary-400">{{ formatCurrency(publication.precio) }}</span>
            <span v-if="publication.precioOriginal" class="text-base text-on-surface-variant line-through">
              {{ formatCurrency(publication.precioOriginal) }}
            </span>
          </div>
          <a v-if="publication.permalink && publication.permalink !== '#'" :href="publication.permalink" target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-1 text-primary-600 dark:text-primary-400 text-base font-semibold border-b border-primary-600 dark:border-primary-400">
            Ver en Mercado Libre
            <Icon name="i-tabler-external-link" class="size-4" />
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  publication: { type: Object, required: true },
})

const statusLabel = computed(() => {
  const map = { active: 'Activa', paused: 'Pausada', closed: 'Inactiva' }
  return map[props.publication.estado] || props.publication.estado
})
</script>