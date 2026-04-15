<template>
  <div class="flex flex-col gap-4">
    <UBreadcrumb :items="breadcrumbItems" />

    <PublicationProductHeader v-if="productInfo" :product="productInfo" />

    <PublicationFilters v-model:search-query="searchQuery" v-model:selected-status="selectedStatus"
      v-model:sort-by="sortBy" class="mt-4" />

    <PublicationTable :publications="filteredPublications" :loading="loading" @select="navigateToDetail" />
  </div>
</template>

<script setup>
import { ROUTE_NAMES } from '~/constants/ROUTE_NAMES.js'

definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const productId = computed(() => route.params.id)

const {
  filteredPublications,
  productInfo,
  loading,
  searchQuery,
  selectedStatus,
  sortBy,
  fetchPublications,
} = usePublications(productId)

onMounted(() => {
  fetchPublications()
})

const truncateTitle = (title, maxWords = 4) => {
  if (!title) return 'Producto'
  const words = title.split(' ')
  return words.length > maxWords ? words.slice(0, maxWords).join(' ') + '...' : title
}

const breadcrumbItems = computed(() => [
  { label: 'Productos', to: ROUTE_NAMES.PRODUCTOS },
  { label: truncateTitle(productInfo.value?.titulo) },
])

function navigateToDetail(row) {
  const mla = row.original?.mlaId || row.mlaId
  if (mla) navigateTo(`${ROUTE_NAMES.PRODUCTOS}/${productId.value}/${mla}`)
}
</script>
