<template>
    <DefaultSection>
        <div class="w-full max-w-5xl flex flex-col gap-8">

            <div v-if="loading" class="flex flex-col gap-6">
                <div class="flex justify-between">
                    <div class="h-4 w-20 rounded-full bg-gray-mid animate-pulse" />
                    <div class="h-10 w-40 rounded-xl bg-gray-mid animate-pulse" />
                </div>
                <div class="h-8 w-2/3 rounded-full bg-gray-mid animate-pulse" />
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div v-for="i in 4" :key="i" class="aspect-square rounded-xl bg-gray-mid animate-pulse" />
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div v-for="i in 3" :key="i" class="h-20 rounded-xl bg-gray-mid animate-pulse" />
                </div>
            </div>

            <div v-else-if="error" class="w-full text-center py-16 flex flex-col items-center gap-4">
                <p class="text-red-500">{{ error }}</p>
                <ButtonPrimary to="/">← Volver a productos</ButtonPrimary>
            </div>

            <template v-else-if="product">

                <div class="flex items-center justify-between gap-4 flex-wrap">
                    <NuxtLink to="/"
                        class="text-xs lg:text-base text-gray-500 hover:text-dark transition flex items-center gap-1">
                        <Icon name="tabler:arrow-left" class="w-4 h-4" />
                        Volver a productos
                    </NuxtLink>
                    <a v-if="product.permalink" :href="product.permalink" target="_blank" rel="noopener noreferrer">
                        <ButtonPrimary>Ver en MercadoLibre</ButtonPrimary>
                    </a>
                </div>

                <div class="flex flex-col gap-2">
                    <div class="flex items-center gap-2 flex-wrap">
                        <span v-if="product.estado"
                            class="text-xs lg:text-base px-2 py-0.5 rounded-full font-medium"
                            :class="product.estado === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'">
                            {{ product.estado === 'active' ? 'Activo' : product.estado === 'closed' ? 'Cerrado' : product.estado }}
                        </span>
                        <span v-if="product.condicion"
                            class="text-xs lg:text-base px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
                            {{ product.condicion === 'new' ? 'Nuevo' : 'Usado' }}
                        </span>
                    </div>
                    <HeadingH1>{{ product.titulo }}</HeadingH1>
                    <p class="text-xs lg:text-sm text-gray-400">
                        ML ID: {{ product.ml_id }}
                        <span v-if="product.sku"> · SKU: {{ product.sku }}</span>
                    </p>
                </div>

                <div v-if="images.length" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    <img
                        v-for="img in images"
                        :key="img.id"
                        :src="img.url"
                        :alt="product.titulo"
                        class="w-full aspect-square object-contain rounded-xl border border-gray-dark bg-white p-2"
                    />
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div class="flex flex-col gap-1 bg-gray-light rounded-xl p-4">
                        <span class="text-xs lg:text-sm text-gray-500 uppercase tracking-wide">Precio</span>
                        <span class="text-xl lg:text-2xl font-semibold text-dark">{{ formatPrice(product.precio, product.moneda) }}</span>
                        <span v-if="product.precio_original" class="text-xs lg:text-sm text-gray-400 line-through">
                            {{ formatPrice(product.precio_original, product.moneda) }}
                        </span>
                    </div>
                    <div class="flex flex-col gap-1 bg-gray-light rounded-xl p-4">
                        <span class="text-xs lg:text-sm text-gray-500 uppercase tracking-wide">Stock</span>
                        <span class="text-xl lg:text-2xl font-semibold text-dark">{{ product.disponibles ?? '-' }}</span>
                    </div>
                    <div class="flex flex-col gap-1 bg-gray-light rounded-xl p-4">
                        <span class="text-xs lg:text-sm text-gray-500 uppercase tracking-wide">Vendidos</span>
                        <span class="text-xl lg:text-2xl font-semibold text-dark">{{ product.vendidos ?? '-' }}</span>
                    </div>
                    <div class="flex flex-col gap-1 bg-gray-light rounded-xl p-4">
                        <span class="text-xs lg:text-sm text-gray-500 uppercase tracking-wide">Envío gratis</span>
                        <span class="text-xl lg:text-2xl font-semibold" :class="product.envio_gratis ? 'text-green-600' : 'text-dark'">
                            {{ product.envio_gratis ? 'Sí' : 'No' }}
                        </span>
                    </div>
                </div>

                <p v-if="product.garantia" class="text-xs lg:text-lg text-gray-500 flex items-center gap-2">
                    <Icon name="tabler:shield-check" class="w-4 h-4 lg:w-5 lg:h-5 shrink-0" />
                    {{ product.garantia }}
                </p>

                <div v-if="filteredAtributos.length" class="flex flex-col gap-3">
                    <h2 class="text-base lg:text-2xl font-medium text-dark">Atributos</h2>
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        <div v-for="attr in filteredAtributos" :key="attr.nombre"
                            class="flex flex-col gap-0.5 bg-gray-light rounded-xl px-4 py-3">
                            <span class="text-xs lg:text-base text-gray-500">{{ attr.nombre }}</span>
                            <span class="text-sm lg:text-xl font-medium text-dark">{{ attr.valor }}</span>
                        </div>
                    </div>
                </div>

                <div v-if="product.descripcion" class="flex flex-col gap-3">
                    <h2 class="text-base lg:text-lg font-medium text-dark">Descripción</h2>
                    <p class="text-xs lg:text-base text-dark whitespace-pre-wrap leading-relaxed bg-gray-light rounded-xl p-4">
                        {{ product.descripcion }}
                    </p>
                </div>

                <p v-if="product.actualizado_en" class="text-xs lg:text-base text-gray-400">
                    Última actualización: {{ formatDate(product.actualizado_en) }}
                </p>

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

const filteredAtributos = computed(() =>
    (product.value?.atributos ?? []).filter(a => a.valor !== null && a.valor !== '')
)

const formatPrice = (value, moneda = 'ARS') => {
    if (value == null) return '-'
    const formatted = new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)
    return moneda === 'ARS' ? `$${formatted}` : `${moneda} ${formatted}`
}

const formatDate = (iso) => {
    if (!iso) return ''
    return new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
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
