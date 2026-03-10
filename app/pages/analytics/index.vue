<template>
    <div class="p-6 space-y-5">
        <div class="flex flex-wrap items-center justify-between gap-3">
            <h1 class="text-2xl font-bold text-dark">Analytics / Visitas</h1>
            <button @click="syncVisits" :disabled="syncing"
                class="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-60">
                <Icon :name="syncing ? 'tabler:loader-2' : 'tabler:refresh'" class="w-4 h-4" :class="{ 'animate-spin': syncing }" />
                {{ syncing ? 'Sincronizando...' : 'Sincronizar visitas (30 días)' }}
            </button>
        </div>

        <!-- Bloque 1: Tasa de conversión -->
        <div class="bg-white rounded-xl border border-gray-light p-5">
            <h2 class="font-semibold mb-4">Tasa de conversión por producto</h2>
            <div v-if="loadingConversion" class="space-y-2">
                <div v-for="i in 6" :key="i" class="h-10 rounded bg-gray-light animate-pulse" />
            </div>
            <table v-else class="w-full text-sm">
                <thead>
                    <tr class="border-b border-gray-light text-left text-xs text-gray-dark">
                        <th class="pb-2 font-medium">Producto</th>
                        <th class="pb-2 font-medium text-right">Visitas</th>
                        <th class="pb-2 font-medium text-right hidden sm:table-cell">Unidades</th>
                        <th class="pb-2 font-medium text-right">Conversión</th>
                        <th class="pb-2 font-medium hidden lg:table-cell">Visual</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="row in sortedConversion" :key="row.ml_id"
                        class="border-b border-gray-light last:border-none hover:bg-gray-50">
                        <td class="py-2.5 text-xs">{{ row.ml_id }}</td>
                        <td class="py-2.5 text-right text-xs">{{ fmtNum(row.visitas) }}</td>
                        <td class="py-2.5 text-right text-xs hidden sm:table-cell">{{ fmtNum(row.unidades) }}</td>
                        <td class="py-2.5 text-right font-semibold text-xs"
                            :class="(row.tasa_conversion ?? 0) > 5 ? 'text-green-700' : (row.tasa_conversion ?? 0) > 2 ? 'text-yellow-700' : 'text-red-600'">
                            {{ row.tasa_conversion != null ? fmtPercent(row.tasa_conversion) : '0%' }}
                        </td>
                        <td class="py-2.5 hidden lg:table-cell w-32">
                            <div class="w-full bg-gray-light rounded-full h-1.5">
                                <div class="h-1.5 rounded-full bg-primary"
                                    :style="{ width: Math.min(row.tasa_conversion ?? 0, 20) * 5 + '%' }" />
                            </div>
                        </td>
                    </tr>
                    <tr v-if="!conversion.length">
                        <td colspan="5" class="py-10 text-center text-gray-dark text-sm">Sin datos de conversión</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Bloque 2: Gráfico de visitas -->
        <div class="bg-white rounded-xl border border-gray-light p-5">
            <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
                <h2 class="font-semibold">Visitas en el tiempo</h2>
                <div class="flex gap-3 flex-wrap items-center">
                    <select v-model="selectedProduct" @change="loadVisits"
                        class="border border-gray-light rounded-lg px-3 py-2 text-xs bg-white focus:outline-none w-56">
                        <option value="">Todos los productos</option>
                        <option v-for="row in conversion" :key="row.ml_id" :value="row.ml_id">
                            {{ row.ml_id }}
                        </option>
                    </select>
                    <input type="date" v-model="visitsFrom" class="border border-gray-light rounded-lg px-3 py-2 text-xs bg-white" />
                    <span class="text-gray-dark text-xs">→</span>
                    <input type="date" v-model="visitsTo" class="border border-gray-light rounded-lg px-3 py-2 text-xs bg-white" />
                    <button @click="loadVisits"
                        class="bg-primary text-white px-4 py-2 rounded-lg text-xs font-medium hover:bg-primary/90">
                        Ver
                    </button>
                </div>
            </div>

            <div v-if="loadingVisits" class="h-48 flex items-center justify-center">
                <Icon name="tabler:loader-2" class="w-6 h-6 animate-spin text-gray-dark" />
            </div>
            <div v-else class="h-48">
                <ChartsLineChart :data="visitsChartData" :height="192" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { formatPercent as fmtPercent, formatNumber as fmtNum, formatDate as fmtDate } from '~/utils/format'

const { get, post } = useApi()
const notification = useNotification()

const conversion = ref([])
const visits = ref([])
const loadingConversion = ref(false)
const loadingVisits = ref(false)
const syncing = ref(false)
const selectedProduct = ref('')
const visitsFrom = ref('')
const visitsTo = ref('')

const sortedConversion = computed(() =>
    [...conversion.value].sort((a, b) => (b.tasa_conversion ?? 0) - (a.tasa_conversion ?? 0))
)

const visitsChartData = computed(() =>
    visits.value.map(v => ({ label: fmtDate(v.date), value: v.visits ?? v.visitas ?? 0 }))
)

async function loadConversion() {
    loadingConversion.value = true
    try { conversion.value = await get('/api/analytics/conversion').then(d => Array.isArray(d) ? d : []) }
    catch (e) {} finally { loadingConversion.value = false }
}

async function loadVisits() {
    loadingVisits.value = true
    const params = {}
    if (selectedProduct.value) params.mlId = selectedProduct.value
    if (visitsFrom.value) params.from = visitsFrom.value
    if (visitsTo.value) params.to = visitsTo.value
    try { visits.value = await get('/api/analytics/visits', params).then(d => Array.isArray(d) ? d : []) }
    catch (e) {} finally { loadingVisits.value = false }
}

async function syncVisits() {
    syncing.value = true
    try {
        await post('/api/sync/visits')
        notification.success('Visitas sincronizadas')
        loadConversion()
        loadVisits()
    } catch (e) {} finally { syncing.value = false }
}

onMounted(async () => {
    await loadConversion()
    loadVisits()
})
</script>
