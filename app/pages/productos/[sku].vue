<template>
    <DefaultSection>
        <div class="w-full max-w-4xl flex flex-col gap-6">

            <div v-if="loading" class="w-full text-center py-16 text-gray-500 flex items-center justify-center gap-2">
                <Icon name="tabler:loader-2" class="w-5 h-5 animate-spin" />
                Cargando producto...
            </div>

            <div v-else-if="error" class="w-full text-center py-16 flex flex-col items-center gap-4">
                <p class="text-red-500">{{ error }}</p>
                <ButtonPrimary to="/">← Volver a productos</ButtonPrimary>
            </div>

            <template v-else-if="product">
                <div class="flex items-center justify-between gap-4">
                    <NuxtLink to="/" class="text-sm text-gray-500 hover:text-dark transition flex items-center gap-1">
                        <Icon name="tabler:arrow-left" class="w-4 h-4" />
                        Volver
                    </NuxtLink>
                    <a v-if="product.permalink" :href="product.permalink" target="_blank" rel="noopener noreferrer">
                        <ButtonPrimary>Ver en MercadoLibre</ButtonPrimary>
                    </a>
                </div>

                <HeadingH1>{{ product.titulo }}</HeadingH1>

                <div v-if="images.length" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    <img
                        v-for="(img, i) in images"
                        :key="i"
                        :src="typeof img === 'object' ? img.url : img"
                        :alt="`${product.titulo} - imagen ${i + 1}`"
                        class="w-full aspect-square object-contain rounded-xl border border-gray-dark bg-white p-2"
                    />
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="flex flex-col gap-1 bg-gray-light rounded-xl p-4">
                        <span class="text-xs text-gray-500 uppercase tracking-wide">Precio</span>
                        <span class="text-2xl font-semibold text-dark">{{ formatPrice(product.precio) }}</span>
                    </div>
                    <div class="flex flex-col gap-1 bg-gray-light rounded-xl p-4">
                        <span class="text-xs text-gray-500 uppercase tracking-wide">Stock disponible</span>
                        <span class="text-2xl font-semibold text-dark">{{ product.disponibles ?? '-' }}</span>
                    </div>
                    <div class="flex flex-col gap-1 bg-gray-light rounded-xl p-4">
                        <span class="text-xs text-gray-500 uppercase tracking-wide">Envío gratis</span>
                        <span class="text-2xl font-semibold" :class="product.envio_gratis ? 'text-green-600' : 'text-dark'">
                            {{ product.envio_gratis ? 'Sí' : 'No' }}
                        </span>
                    </div>
                </div>

                <p class="text-xs text-gray-400">SKU: {{ product.sku }}</p>
            </template>

        </div>
    </DefaultSection>
</template>

<script setup>
const route = useRoute()
const product = ref(null)
const loading = ref(true)
const error = ref(null)

const images = computed(() => product.value?.imagenes ?? [])

const formatPrice = (value) => {
    if (value == null) return '-'
    return '$' + new Intl.NumberFormat('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value)
}

onMounted(async () => {
    try {
        const data = await $fetch(`/api/sync-id-products/${route.params.sku}`)
        product.value = data
    } catch (e) {
        error.value = e?.data?.message || 'No se pudo cargar el producto.'
    } finally {
        loading.value = false
    }
})
</script>
