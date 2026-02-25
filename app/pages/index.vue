<template>
    <DefaultSection>
        <HeadingH1>Productos We Glam</HeadingH1>
        <div class="w-full max-w-3xl flex gap-3 items-end">
            <div class="flex-1">
                <FormTextField id="search-query" v-model="query" label="Buscar producto"
                    placeholder="Ej: globo, luz led, decoración..." icon="search" />
            </div>
            <ButtonPrimary @click="fetchProducts" class="h-[3.375rem]">
                Actualizar
            </ButtonPrimary>
        </div>

        <div v-if="loading" class="w-full max-w-[90rem] overflow-hidden rounded-xl border border-gray-dark">
            <div class="grid grid-cols-6 gap-4 px-4 py-3 border-b border-gray-dark bg-gray-light">
                <div v-for="i in 6" :key="i" class="h-4 rounded-full bg-gray-mid animate-pulse" />
            </div>
            <div v-for="row in 8" :key="row"
                class="grid grid-cols-6 gap-4 items-center px-4 py-3 border-b border-gray-dark last:border-none"
                :class="row % 2 === 0 ? 'bg-gray-mid' : 'bg-gray-light'">
                <div class="flex justify-center">
                    <div class="w-16 h-16 rounded-lg bg-gray-mid animate-pulse" :style="`animation-delay: ${row * 60}ms`" />
                </div>
                <div class="h-3 rounded-full bg-gray-mid animate-pulse col-span-2" :style="`animation-delay: ${row * 80}ms`" />
                <div class="h-3 rounded-full bg-gray-mid animate-pulse w-2/3 mx-auto" :style="`animation-delay: ${row * 100}ms`" />
                <div class="h-3 rounded-full bg-gray-mid animate-pulse w-1/2 mx-auto" :style="`animation-delay: ${row * 120}ms`" />
                <div class="h-3 rounded-full bg-gray-mid animate-pulse w-1/2 mx-auto" :style="`animation-delay: ${row * 140}ms`" />
            </div>
        </div>

        <div v-else-if="error" class="w-full text-center py-12 text-red-500">
            {{ error }}
        </div>

        <template v-else-if="searched">
            <div class="w-full max-w-[90rem]">
                <TableLayout :data="paginatedResults" :columns="columns" :show-actions="false"
                    :empty-state-text="'No se encontraron productos para tu búsqueda.'" row-key="sku">
                    <template #cell-sku="{ item }">
                        <NuxtLink :to="`/productos/${item.sku}`"
                            class="text-dark underline underline-offset-2 whitespace-nowrap">
                            Ver detalle
                        </NuxtLink>
                    </template>
                </TableLayout>
            </div>

            <TablePagination
                v-model:currentPage="currentPage"
                v-model:itemsPerPage="pageSize"
                :total-items="results.length"
                :items-per-page-options="[10, 20, 50, 100]"
                class="w-full max-w-[90rem] mt-2"
            />
        </template>
    </DefaultSection>
</template>

<script setup>
import { useDebounceFn } from '~/composables/useDebounce'

const query = ref('')
const searched = ref(false)

const columns = [
    { key: 'imagenes', label: 'Imagen', type: 'image-array' },
    { key: 'titulo', label: 'Título', type: 'text' },
    { key: 'precio', label: 'Precio', type: 'currency' },
    { key: 'disponibles', label: 'Stock' },
    { key: 'envio_gratis', label: 'Envío gratis', type: 'yesno' },
    { key: 'permalink', label: 'Link', type: 'link', linkText: 'Ver en MeLi' },
    { key: 'sku', label: 'Detalle' },
]

const products = ref([])
const loading = ref(false)
const error = ref(null)

const pageSize = ref(10)
const currentPage = ref(1)

const results = computed(() => {
    if (!searched.value) return []
    if (!query.value.trim()) return products.value
    const q = query.value.trim().toLowerCase()
    return products.value.filter(p => p.titulo?.toLowerCase().includes(q))
})

const paginatedResults = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    return results.value.slice(start, start + pageSize.value)
})

watch(query, useDebounceFn(() => {
    currentPage.value = 1
}, 300))

watch(pageSize, () => {
    currentPage.value = 1
})

const fetchProducts = async () => {
    loading.value = true
    error.value = null
    try {
        const res = await fetch('/api/sync-products', { method: 'GET' })
        if (!res.ok) throw new Error('Error al obtener productos')
        products.value = await res.json()
        searched.value = true
        currentPage.value = 1
    } catch (e) {
        error.value = e.message || 'Error desconocido'
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchProducts()
})
</script>
