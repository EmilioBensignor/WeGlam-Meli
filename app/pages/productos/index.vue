<template>
  <section class="h-full flex flex-col justify-between gap-4">
    <div class="flex flex-col gap-4">
      <div>
        <div class="flex items-end gap-4">
          <HeadingH1>Productos</HeadingH1>
          <span class="bg-primary-400 rounded-full text-xs text-black font-medium border border-primary-400/50 px-3 py-1">
            {{ filteredProducts.length }}
          </span>
        </div>
      </div>

      <ProductFilters v-model:search-query="searchQuery" v-model:selected-category="selectedCategory"
        v-model:selected-status="selectedStatus" v-model:sort-by="sortBy" :categories="categories" />

      <div v-if="loading" class="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div v-for="i in 10" :key="i"
          class="bg-surface-lowest rounded-xl p-4 flex gap-4 animate-pulse border border-outline-variant/30">
          <div class="w-32 h-32 shrink-0 bg-surface-highest rounded-xl" />
          <div class="flex-1 flex flex-col gap-3">
            <div class="h-4 w-20 bg-surface-highest rounded" />
            <div class="h-6 w-3/4 bg-surface-highest rounded" />
            <div class="mt-auto h-12 bg-surface-highest rounded" />
          </div>
        </div>
      </div>

      <div v-else-if="paginatedProducts.length" class="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <ProductCard v-for="product in paginatedProducts" :key="product.id" :product="product" />
      </div>

      <div v-else class="text-center py-20">
        <Icon name="i-tabler-package-off" class="size-12 text-on-surface-variant/40 mx-auto mb-4" />
        <p class="text-on-surface-variant text-lg">No se encontraron productos</p>
        <p class="text-on-surface-variant/60 text-sm mt-1">Probá ajustando los filtros de búsqueda</p>
      </div>
    </div>

    <div v-if="totalPages > 1" class="flex items-center justify-between border-t border-on-surface/30 py-4 mt-4">
      <span class="text-sm text-on-surface">
        Mostrando {{ (currentPage - 1) * 10 + 1 }}-{{ Math.min(currentPage * 10, filteredProducts.length) }} de {{
          filteredProducts.length }}
      </span>
      <UPagination v-model:page="currentPage" :total="filteredProducts.length" :items-per-page="10" />
    </div>
  </section>
</template>

<script setup>
definePageMeta({ layout: 'dashboard' })

const {
  paginatedProducts,
  filteredProducts,
  loading,
  searchQuery,
  selectedCategory,
  selectedStatus,
  sortBy,
  currentPage,
  totalPages,
  categories,
  fetchProducts,
} = useProducts()

onMounted(() => {
  fetchProducts()
})
</script>