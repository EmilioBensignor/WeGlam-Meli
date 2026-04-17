<template>
  <div class="flex flex-col gap-4">
    <UBreadcrumb :items="breadcrumbItems" />

    <div v-if="loading" class="flex flex-col gap-4">
      <div class="h-72 bg-surface-lowest rounded-xl animate-pulse border border-outline-variant/30" />
      <div class="grid grid-cols-6 gap-4">
        <div v-for="i in 6" :key="i" class="h-24 bg-surface-lowest rounded-xl animate-pulse border border-outline-variant/30" />
      </div>
      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-8 h-96 bg-surface-lowest rounded-xl animate-pulse border border-outline-variant/30" />
        <div class="col-span-4 h-96 bg-surface-lowest rounded-xl animate-pulse border border-outline-variant/30" />
      </div>
    </div>

    <template v-else-if="publication && metrics">
      <PublicationHeader :publication="publication" />

      <div class="flex items-center gap-3">
        <button type="button" :disabled="syncing || !canSync" :aria-busy="syncing" @click="syncPublication"
          class="flex items-center gap-2 bg-primary-400 hover:bg-primary-300 rounded-xl px-4 py-2 text-base font-semibold text-primary-950 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          <Icon :name="syncing ? 'i-tabler-loader-2' : 'i-tabler-refresh'" class="size-5"
            :class="{ 'animate-spin': syncing }" />
          {{ syncing ? 'Actualizando...' : 'Actualizar datos' }}
        </button>
        <span v-if="syncStatusText" class="text-sm" :class="statusTextClass">
          <Icon v-if="syncStatusTone === 'success'" name="i-tabler-circle-check-filled" class="size-4 inline mr-1" />
          <Icon v-else-if="syncStatusTone === 'error'" name="i-tabler-alert-circle-filled" class="size-4 inline mr-1" />
          <Icon v-else name="i-tabler-clock" class="size-4 inline mr-1" />
          {{ syncStatusText }}
        </span>
      </div>

      <PublicationKpiRow :metrics="metrics" :stock="publication.stock" :stock-max="publication.stockMax" />

      <div class="grid grid-cols-12 gap-4 items-stretch">
        <section class="col-span-12 xl:col-span-8 bg-surface-lowest rounded-xl border border-outline-variant/30 p-4">
          <PublicationHealthScore :score="totalScore" :label="healthLabel" :criteria="criteria">
            <PublicationRecommendationList :recommendations="metrics.recommendations" />
          </PublicationHealthScore>
        </section>

        <div class="col-span-12 xl:col-span-4">
          <PublicationProfitBreakdown :profit="metrics.profit" />
        </div>
      </div>

      <PublicationAdPanel :ads="metrics.ads" />
    </template>

    <div v-else class="text-center py-20">
      <Icon name="i-tabler-alert-circle" class="size-12 text-on-surface-variant/40 mx-auto mb-4" />
      <p class="text-on-surface-variant text-lg">No se pudo cargar el detalle de la publicación</p>
    </div>
  </div>
</template>

<script setup>
import { ROUTE_NAMES } from '~/constants/ROUTE_NAMES.js'

definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const productId = computed(() => route.params.id)
const mlaId = computed(() => route.params.mla)

const { publication, metrics, loading, syncing, canSync, syncStatusText, syncStatusTone, fetchDetail, syncPublication } = usePublicationDetail(productId, mlaId)
const { criteria, totalScore, label: healthLabel } = useHealthScore(publication, metrics)

const statusTextClass = computed(() => {
  if (syncStatusTone.value === 'success') return 'text-green-600 dark:text-green-400'
  if (syncStatusTone.value === 'error') return 'text-red-600 dark:text-red-400'
  return 'text-on-surface-variant'
})

onMounted(() => {
  fetchDetail()
})

const truncateTitle = (title, maxWords = 4) => {
  if (!title) return 'Producto'
  const words = title.split(' ')
  return words.length > maxWords ? words.slice(0, maxWords).join(' ') + '...' : title
}

const breadcrumbItems = computed(() => [
  { label: 'Productos', to: ROUTE_NAMES.PRODUCTOS },
  { label: truncateTitle(publication.value?.titulo), to: `${ROUTE_NAMES.PRODUCTOS}/${productId.value}` },
  { label: mlaId.value },
])
</script>
