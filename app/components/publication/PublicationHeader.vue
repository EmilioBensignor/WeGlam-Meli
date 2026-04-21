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
          <button type="button" @click="copyMla"
            class="group inline-flex items-center gap-1.5 text-base text-on-surface-variant hover:text-on-surface transition-colors"
            :title="`Copiar ${publication.mlaId}`">
            <span>{{ publication.mlaId }}</span>
            <Icon :name="copied ? 'i-tabler-check' : 'i-tabler-copy'"
              class="size-4 opacity-0 group-hover:opacity-100 transition-opacity"
              :class="{ 'opacity-100 text-green-600 dark:text-green-400': copied }" />
          </button>
        </div>
        <HeadingH1>{{ publication.titulo }}</HeadingH1>
        <div class="flex items-center gap-6">
          <div class="flex items-center gap-2">
            <span class="text-3xl font-bold text-primary-600 dark:text-primary-400">{{ formatCurrency(precioVenta) }}</span>
            <span v-if="precioOriginal" class="text-base text-on-surface-variant line-through">
              {{ formatCurrency(precioOriginal) }}
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
  profit: { type: Object, default: null },
})

const statusLabel = computed(() => {
  const map = { active: 'Activa', paused: 'Pausada', closed: 'Inactiva' }
  return map[props.publication.estado] || props.publication.estado
})

// Precios: priorizar profit (que viene del endpoint /metrics con precios reales de ML)
const precioVenta = computed(() => props.profit?.precioVenta ?? props.publication.precio)
const precioOriginal = computed(() => props.profit?.precioOriginal ?? props.publication.precioOriginal)

const { success, error: notifyError } = useNotification()
const copied = ref(false)

async function copyMla() {
  try {
    await navigator.clipboard.writeText(props.publication.mlaId)
    copied.value = true
    success(`${props.publication.mlaId} copiado`)
    setTimeout(() => { copied.value = false }, 1500)
  } catch (e) {
    notifyError('No se pudo copiar el MLA')
  }
}
</script>