<template>
  <div class="flex items-center gap-4">
    <div class="w-32 h-32 shrink-0 rounded-xl overflow-hidden bg-surface-lowest">
      <img :src="product.imagen" :alt="product.titulo" class="w-full h-full object-cover">
    </div>
    <div class="h-full flex flex-col gap-2">
      <HeadingH1>{{ product.titulo }}</HeadingH1>
      <div class="flex items-center gap-6">
        <span class="text-on-surface-variant">
          <span class="font-bold text-on-surface">{{ product.totalPublicaciones }}</span> publicaciones activas
        </span>
        <span class="text-on-surface-variant">
          Stock total: <span class="font-bold text-on-surface">{{ product.stockTotal }} un.</span>
        </span>
        <span class="text-on-surface-variant">
          Revenue 30d: <span class="font-bold text-primary-600 dark:text-primary-400">{{ formatRevenue(product.revenue30d) }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  product: { type: Object, required: true },
})
</script>