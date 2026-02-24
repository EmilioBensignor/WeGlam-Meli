<template>
    <DefaultSection>
        <HeadingH1>Productos We Glam</HeadingH1>
        <div class="w-full max-w-2xl flex gap-3 items-end">
            <div class="flex-1">
                <FormTextField
                    id="search-query"
                    v-model="query"
                    label="Buscar producto"
                    placeholder="Ej: globo, luz led, decoración..."
                    icon="search"
                    @keyup.enter="search"
                />
            </div>
            <ButtonPrimary @click="search">
                Buscar
            </ButtonPrimary>
        </div>
        <TableLayout
            v-if="searched"
            :data="results"
            :columns="columns"
            :show-actions="false"
            :empty-state-text="'No se encontraron productos para tu búsqueda.'"
            row-key="sku"
        />
    </DefaultSection>
</template>

<script setup>
const query = ref('')
const searched = ref(false)

const columns = [
    { key: 'imagenes', label: 'Imagen', type: 'image-array' },
    { key: 'titulo', label: 'Título', type: 'text' },
    { key: 'precio', label: 'Precio', type: 'currency' },
    { key: 'disponibles', label: 'Stock' },
    { key: 'envio_gratis', label: 'Envío gratis', type: 'yesno' },
    { key: 'permalink', label: 'Link', type: 'link', linkText: 'Ver en MeLi' },
]


const products = ref([])
const loading = ref(false)
const error = ref(null)


const results = computed(() => {
    if (!searched.value) return []
    if (!query.value.trim()) return products.value
    const q = query.value.trim().toLowerCase()
    return products.value.filter(p => p.titulo?.toLowerCase().includes(q))
})


const search = async () => {
    loading.value = true
    error.value = null
    try {
        const res = await fetch('/api/sync-products', { method: 'GET' })
        if (!res.ok) throw new Error('Error al obtener productos')
        products.value = await res.json()
        searched.value = true
    } catch (e) {
        error.value = e.message || 'Error desconocido'
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    search()
})
</script>
