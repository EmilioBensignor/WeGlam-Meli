<template>
    <div class="p-6 space-y-5">
        <div class="flex flex-wrap items-center justify-between gap-3">
            <h1 class="text-2xl font-bold text-dark">Productos</h1>
            <button @click="syncProducts" :disabled="syncing"
                class="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-60">
                <Icon :name="syncing ? 'tabler:loader-2' : 'tabler:refresh'" class="w-4 h-4" :class="{ 'animate-spin': syncing }" />
                {{ syncing ? 'Sincronizando...' : 'Sincronizar productos' }}
            </button>
        </div>

        <!-- Filters -->
        <div class="flex flex-wrap gap-3">
            <input v-model="query" placeholder="Buscar por título o SKU..."
                class="border border-gray-light rounded-lg px-3 py-2 text-sm bg-white w-64 focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <select v-model="estadoFilter"
                class="border border-gray-light rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option value="">Todos los estados</option>
                <option value="active">Activos</option>
                <option value="paused">Pausados</option>
                <option value="closed">Cerrados</option>
            </select>
        </div>

        <!-- Loading skeleton -->
        <div v-if="loading" class="bg-white rounded-xl border border-gray-light overflow-hidden">
            <div class="grid grid-cols-6 gap-4 px-4 py-3 border-b border-gray-light bg-gray-50">
                <div v-for="i in 6" :key="i" class="h-3 rounded-full bg-gray-light animate-pulse" />
            </div>
            <div v-for="row in 8" :key="row"
                class="grid grid-cols-6 gap-4 items-center px-4 py-3 border-b border-gray-light last:border-none">
                <div class="h-10 w-10 rounded bg-gray-light animate-pulse" />
                <div class="h-3 rounded-full bg-gray-light animate-pulse col-span-2" />
                <div class="h-3 rounded-full bg-gray-light animate-pulse w-2/3" />
                <div class="h-3 rounded-full bg-gray-light animate-pulse w-1/2" />
                <div class="h-3 rounded-full bg-gray-light animate-pulse w-1/2" />
            </div>
        </div>

        <!-- Table -->
        <div v-else class="bg-white rounded-xl border border-gray-light overflow-x-auto">
            <table class="w-full text-sm">
                <thead>
                    <tr class="border-b border-gray-light text-left text-xs text-gray-dark bg-gray-50">
                        <th class="px-4 py-3 font-medium w-12"></th>
                        <th class="px-4 py-3 font-medium">Título</th>
                        <th class="px-4 py-3 font-medium hidden md:table-cell">SKU</th>
                        <th class="px-4 py-3 font-medium text-right">Precio</th>
                        <th class="px-4 py-3 font-medium text-right">Stock</th>
                        <th class="px-4 py-3 font-medium text-right hidden sm:table-cell">Vendidos</th>
                        <th class="px-4 py-3 font-medium">Estado</th>
                        <th class="px-4 py-3 font-medium text-right hidden lg:table-cell">Margen</th>
                        <th class="px-4 py-3 font-medium text-right hidden lg:table-cell">Ganancia</th>
                        <th class="px-4 py-3 font-medium"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="p in paginated" :key="p.ml_id"
                        class="border-b border-gray-light last:border-none hover:bg-gray-50 transition-colors">
                        <td class="px-4 py-3">
                            <img v-if="p.thumbnail" :src="p.thumbnail"
                                class="w-10 h-10 rounded object-cover" />
                            <div v-else class="w-10 h-10 rounded bg-gray-light flex items-center justify-center">
                                <Icon name="tabler:photo" class="text-gray-dark w-4 h-4" />
                            </div>
                        </td>
                        <td class="px-4 py-3 max-w-[14rem]">
                            <a :href="p.permalink" target="_blank" rel="noopener"
                                class="hover:text-primary hover:underline line-clamp-2 text-xs leading-snug">
                                {{ p.titulo }}
                            </a>
                        </td>
                        <td class="px-4 py-3 text-gray-dark text-xs hidden md:table-cell">{{ p.sku ?? '—' }}</td>
                        <td class="px-4 py-3 text-right font-medium whitespace-nowrap">
                            {{ fmtCurrency(p.precio) }}
                            <span class="text-[0.6rem] text-gray-dark">{{ p.moneda }}</span>
                        </td>
                        <td class="px-4 py-3 text-right" :class="p.disponibles === 0 ? 'text-red-600 font-semibold' : ''">
                            {{ p.disponibles ?? '—' }}
                        </td>
                        <td class="px-4 py-3 text-right hidden sm:table-cell">{{ p.vendidos ?? '—' }}</td>
                        <td class="px-4 py-3">
                            <UiBadge :text="p.estado" :variant="estadoBadge(p.estado)" />
                        </td>
                        <td class="px-4 py-3 text-right hidden lg:table-cell">
                            <span v-if="profMap[p.ml_id]"
                                class="px-1.5 py-0.5 rounded-full text-[0.65rem] font-medium"
                                :class="marginBadge(profMap[p.ml_id]?.margen_porcentaje)">
                                {{ fmtPercent(profMap[p.ml_id]?.margen_porcentaje) }}
                            </span>
                            <span v-else class="text-gray-dark text-xs">—</span>
                        </td>
                        <td class="px-4 py-3 text-right hidden lg:table-cell text-xs font-medium">
                            {{ profMap[p.ml_id] ? fmtCurrency(profMap[p.ml_id]?.ganancia_neta) : '—' }}
                        </td>
                        <td class="px-4 py-3">
                            <NuxtLink :to="`/products/${p.ml_id}`"
                                class="text-primary text-xs font-medium hover:underline whitespace-nowrap">
                                Ver detalle
                            </NuxtLink>
                        </td>
                    </tr>
                    <tr v-if="!paginated.length">
                        <td colspan="10" class="py-12 text-center text-gray-dark text-sm">
                            {{ loading ? '' : 'No se encontraron productos' }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        <TablePagination
            v-model:currentPage="currentPage"
            v-model:itemsPerPage="pageSize"
            :total-items="filtered.length"
            :items-per-page-options="[10, 25, 50, 100]"
        />
    </div>
</template>

<script setup>
import { formatCurrency as fmtCurrency, formatPercent as fmtPercent, marginBadgeClass as marginBadge } from '~/utils/format'
import { useDebounceFn } from '~/composables/useDebounce'

const { get, post } = useApi()
const notification = useNotification()

const query = ref('')
const estadoFilter = ref('')
const pageSize = ref(25)
const currentPage = ref(1)

const products = ref([])
const profitability = ref([])
const loading = ref(false)
const syncing = ref(false)

const profMap = computed(() => {
    const map = {}
    profitability.value.forEach(p => { map[p.ml_id] = p })
    return map
})

const filtered = computed(() => {
    let list = products.value
    if (estadoFilter.value) list = list.filter(p => p.estado === estadoFilter.value)
    if (query.value.trim()) {
        const q = query.value.trim().toLowerCase()
        list = list.filter(p =>
            p.titulo?.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q)
        )
    }
    return list
})

const paginated = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    return filtered.value.slice(start, start + pageSize.value)
})

watch([query, estadoFilter], useDebounceFn(() => { currentPage.value = 1 }, 300))

function estadoBadge(estado) {
    if (estado === 'active') return 'success'
    if (estado === 'paused') return 'gray'
    if (estado === 'closed') return 'danger'
    return 'default'
}

async function load() {
    loading.value = true
    try {
        const [prods, prof] = await Promise.all([
            get('/api/sync-products'),
            get('/api/profitability').catch(() => []),
        ])
        products.value = Array.isArray(prods) ? prods : []
        profitability.value = Array.isArray(prof) ? prof : []
    } catch (e) {
        // notification already shown by useApi
    } finally {
        loading.value = false
    }
}

async function syncProducts() {
    syncing.value = true
    try {
        const res = await post('/api/sync/products')
        notification.success(`Sincronizados ${res?.synced ?? ''} productos`)
        await load()
    } catch (e) {
        // handled by useApi
    } finally {
        syncing.value = false
    }
}

onMounted(load)
</script>
