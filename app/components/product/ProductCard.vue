<template>
  <NuxtLink :to="`${ROUTE_NAMES.PRODUCTOS}/${product.id}`"
    class="bg-surface-lowest rounded-xl p-4 flex gap-4 border border-outline-variant/30"
    :class="isOutOfStock(product) ? 'border-red-400/30' : ''">
    <div class="w-48 h-48 shrink-0 bg-surface-lowest rounded-xl overflow-hidden relative">
      <img :src="product.imagen" :alt="product.titulo" class="w-full h-full object-cover"
        :class="isOutOfStock(product) ? 'grayscale opacity-60' : 'grayscale-[0.2]'">
      <div v-if="isOutOfStock(product)" class="flex items-center justify-center absolute inset-0 bg-red-400/10">
        <span
          class="text-xs font-bold text-red-600 dark:text-red-400 bg-surface-base/90 rounded border border-red-400/30 px-2 py-1">
          Sin stock
        </span>
      </div>
      <div v-else class="absolute top-2 right-2">
        <div class="w-2 h-2 rounded-full"
          :class="product.trend > 0 ? 'bg-green-400 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-primary-400 shadow-[0_0_8px_rgba(108,195,224,0.6)]'" />
      </div>
    </div>

    <div class="flex-1 flex flex-col gap-3 min-w-0">
      <div class="flex justify-between items-start">
        <UBadge :label="product.categoria" color="primary" variant="solid" size="md" class="text-black" />
        <span class="text-sm font-semibold px-2 py-0.5 rounded flex items-center gap-1" :class="revenueClass">
          {{ formatRevenue(product.revenue30d) }}
        </span>
      </div>

      <HeadingH1 :level="2" class="line-clamp-2">
        {{ product.titulo }}
      </HeadingH1>

      <div class="border-t border-outline-variant/50 pt-3 flex flex-col gap-2">
        <p class="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Publicaciones</p>
        <div class="grid grid-cols-3 gap-2">
        <div>
          <p class="text-sm text-on-surface-variant">Activas</p>
          <p class="font-semibold text-green-600 dark:text-green-400">{{ product.publicacionesActivas }}</p>
        </div>
        <div>
          <p class="text-sm text-on-surface-variant">Pausadas</p>
          <p class="font-semibold" :class="product.publicacionesPausadas > 0 ? 'text-yellow-600 dark:text-yellow-400' : 'text-on-surface-variant'">
            {{ product.publicacionesPausadas }}
          </p>
        </div>
        <div>
          <p class="text-sm text-on-surface-variant">Sin stock</p>
          <p class="font-semibold" :class="product.sinStock > 0 ? 'text-red-600 dark:text-red-400' : 'text-on-surface-variant'">
            {{ product.sinStock }}
          </p>
        </div>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup>
import { ROUTE_NAMES } from '~/constants/ROUTE_NAMES.js'

const props = defineProps({
  product: { type: Object, required: true },
})

const isOutOfStock = (p) => p.stockTotal === 0

const revenueClass = computed(() => {
  const r = props.product.revenue30d
  if (r > 3000) return 'text-green-600 bg-green-200 dark:text-green-400 dark:bg-green-400/15'
  if (r > 0) return 'text-on-surface-variant bg-surface-highest'
  return 'text-red-600 bg-red-200 dark:text-red-400 dark:bg-red-400/15'
})
</script>