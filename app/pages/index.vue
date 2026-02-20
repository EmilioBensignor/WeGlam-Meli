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
    { key: 'link_ml', label: 'Link', type: 'link', linkText: 'Ver en MeLi' },
]

// TODO (back-end): reemplazar MOCK_RESULTS con la llamada real a la API de Mercado Libre.
// La función search recibe `query.value` como término de búsqueda.
// La estructura de cada item debe coincidir con este mock.
const MOCK_RESULTS = [
    {
        sku: 'MLA1315284102',
        titulo: '10 Globos Burbuja Transparente Cristal + Luz Led + Varillas',
        descripcion: 'GLOBO DE LATEX DE 40 CM + 3 MTS DE ALAMBRE LED + VARILLA',
        precio: 29926,
        precio_original: null,
        moneda: 'ARS',
        condicion: 'new',
        disponibles: 21,
        garantia: 'Sin garantía',
        envio_gratis: false,
        imagenes: [
            'https://http2.mlstatic.com/D_615997-MLA77621615703_072024-O.jpg',
            'https://http2.mlstatic.com/D_699087-MLA77621615701_072024-O.jpg',
            'https://http2.mlstatic.com/D_745080-MLA77621615705_072024-O.jpg',
            'https://http2.mlstatic.com/D_965034-MLA77621615707_072024-O.jpg',
        ],
        categoria_ml: 'MLA62933',
        link_ml: 'https://articulo.mercadolibre.com.ar/MLA-1842267408-10-globos-burbuja-transparente-cristal-luz-led-varillas-_JM',
    },
    {
        sku: 'MLA9876543210',
        titulo: 'Set 50 Globos Metalizados Dorados 30cm Fiesta Decoración',
        descripcion: 'Globos metalizados dorados para todo tipo de eventos.',
        precio: 8500,
        precio_original: 10000,
        moneda: 'ARS',
        condicion: 'new',
        disponibles: 150,
        garantia: 'Sin garantía',
        envio_gratis: true,
        imagenes: [
            'https://http2.mlstatic.com/D_699087-MLA77621615701_072024-O.jpg',
        ],
        categoria_ml: 'MLA62933',
        link_ml: 'https://www.mercadolibre.com.ar',
    },
    {
        sku: 'MLA1122334455',
        titulo: 'Globo Número 5 Dorado 40cm Mylar Cumpleaños',
        descripcion: 'Globo de mylar número 5 color dorado ideal para cumpleaños.',
        precio: 3200,
        precio_original: null,
        moneda: 'ARS',
        condicion: 'new',
        disponibles: 80,
        garantia: 'Sin garantía',
        envio_gratis: false,
        imagenes: [
            'https://http2.mlstatic.com/D_745080-MLA77621615705_072024-O.jpg',
        ],
        categoria_ml: 'MLA62933',
        link_ml: 'https://www.mercadolibre.com.ar',
    },
]

const results = computed(() => {
    if (!searched.value || !query.value.trim()) return []
    const q = query.value.trim().toLowerCase()
    // TODO (back-end): eliminar este filtro local y reemplazar por resultados de la API.
    return MOCK_RESULTS.filter(p => p.titulo.toLowerCase().includes(q))
})

const search = () => {
    if (!query.value.trim()) return
    searched.value = true
}
</script>
