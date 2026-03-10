<template>
    <div class="p-6 space-y-6">
        <!-- Header + period filter -->
        <div class="flex flex-wrap items-center justify-between gap-4">
            <h1 class="text-2xl font-bold text-dark">Dashboard</h1>
            <div class="flex items-center gap-2 flex-wrap">
                <select v-model="preset" @change="applyPreset"
                    class="border border-gray-light rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30">
                    <option value="30">Últimos 30 días</option>
                    <option value="7">Últimos 7 días</option>
                    <option value="90">Últimos 90 días</option>
                    <option value="custom">Personalizado</option>
                </select>
                <template v-if="preset === 'custom'">
                    <input type="date" v-model="from" class="border border-gray-light rounded-lg px-3 py-2 text-sm bg-white" />
                    <span class="text-gray-dark text-sm">→</span>
                    <input type="date" v-model="to" class="border border-gray-light rounded-lg px-3 py-2 text-sm bg-white" />
                    <button @click="loadAll"
                        class="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90">
                        Aplicar
                    </button>
                </template>
            </div>
        </div>

        <!-- KPI Cards skeleton / data -->
        <div v-if="loadingDash" class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div v-for="i in 8" :key="i" class="bg-white rounded-xl border border-gray-light p-5 h-24 animate-pulse" />
        </div>
        <div v-else class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <UiKpiCard label="Ingresos brutos" :value="fmtCurrency(dash?.total_ingresos_brutos)" />
            <UiKpiCard label="Ganancia neta" :value="fmtCurrency(dash?.total_ganancia_neta)"
                :color="(dash?.total_ganancia_neta ?? 0) > 0 ? 'positive' : 'negative'" />
            <UiKpiCard label="Margen promedio" :value="fmtPercent(dash?.margen_promedio)"
                :color="(dash?.margen_promedio ?? 0) > 0 ? 'positive' : 'negative'" />
            <UiKpiCard label="Órdenes" :value="fmtNum(dash?.total_ordenes)" />
            <UiKpiCard label="ROAS"
                :value="dash?.roas_global != null ? fmtMult(dash.roas_global) : 'Sin datos'" />
            <UiKpiCard label="ACoS"
                :value="dash?.acos_global != null ? fmtPercent(dash.acos_global) : 'Sin pauta'" />
            <UiKpiCard label="Gasto en pauta" :value="fmtCurrency(dash?.total_gasto_publicidad)" />
            <UiKpiCard label="Productos activos" :value="fmtNum(dash?.total_productos_activos)" />
        </div>

        <!-- Bottom grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Top products -->
            <div class="bg-white rounded-xl border border-gray-light p-5">
                <h2 class="font-semibold text-base mb-4">Top 5 productos por ganancia</h2>
                <div v-if="loadingTop" class="space-y-3">
                    <div v-for="i in 5" :key="i" class="h-10 rounded bg-gray-light animate-pulse" />
                </div>
                <table v-else class="w-full text-sm">
                    <thead>
                        <tr class="border-b border-gray-light text-left text-xs text-gray-dark">
                            <th class="pb-2 font-medium">Producto</th>
                            <th class="pb-2 font-medium text-right">Ganancia</th>
                            <th class="pb-2 font-medium text-right">Margen</th>
                            <th class="pb-2 font-medium text-right hidden sm:table-cell">Uds.</th>
                            <th class="pb-2 font-medium text-right hidden md:table-cell">ROAS</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(p, i) in topProducts" :key="i"
                            class="border-b border-gray-light last:border-none">
                            <td class="py-2.5 flex items-center gap-2 min-w-0">
                                <img v-if="p.productos?.thumbnail" :src="p.productos.thumbnail"
                                    class="w-8 h-8 rounded object-cover flex-shrink-0" />
                                <span class="truncate text-xs max-w-[9rem]">{{ p.productos?.titulo ?? '—' }}</span>
                            </td>
                            <td class="py-2.5 text-right font-medium text-green-700 whitespace-nowrap">{{ fmtCurrency(p.ganancia_neta) }}</td>
                            <td class="py-2.5 text-right">
                                <span class="px-1.5 py-0.5 rounded-full text-[0.65rem] font-medium"
                                    :class="marginBadge(p.margen_porcentaje)">
                                    {{ fmtPercent(p.margen_porcentaje) }}
                                </span>
                            </td>
                            <td class="py-2.5 text-right hidden sm:table-cell">{{ fmtNum(p.unidades_vendidas) }}</td>
                            <td class="py-2.5 text-right hidden md:table-cell">
                                {{ p.roas != null ? fmtMult(p.roas) : '—' }}
                            </td>
                        </tr>
                        <tr v-if="!topProducts.length">
                            <td colspan="5" class="py-8 text-center text-gray-dark text-xs">Sin datos disponibles</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Trends chart -->
            <div class="bg-white rounded-xl border border-gray-light p-5 flex flex-col">
                <h2 class="font-semibold text-base mb-4">Tendencia de ingresos ({{ trendMonths }} meses)</h2>
                <div v-if="loadingTrends" class="flex-1 flex items-center justify-center min-h-[13rem]">
                    <Icon name="tabler:loader-2" class="w-6 h-6 animate-spin text-gray-dark" />
                </div>
                <div v-else class="flex-1 min-h-[13rem]">
                    <ChartsBarChart :data="trendsData" bar-color="bg-primary">
                        <template #tooltip="{ item }">
                            <div>
                                <div class="font-medium">{{ item.label }}</div>
                                <div>Ingresos: {{ fmtCurrency(item.value) }}</div>
                                <div v-if="item.extra?.ordenes != null">Órdenes: {{ item.extra.ordenes }}</div>
                            </div>
                        </template>
                    </ChartsBarChart>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { formatCurrency as fmtCurrency, formatPercent as fmtPercent, formatMultiplier as fmtMult, formatNumber as fmtNum, formatMonthLabel, marginBadgeClass as marginBadge } from '~/utils/format'

const { get } = useApi()

const preset = ref('30')
const from = ref('')
const to = ref('')
const trendMonths = 6

const dash = ref(null)
const topProducts = ref([])
const trends = ref([])
const loadingDash = ref(false)
const loadingTop = ref(false)
const loadingTrends = ref(false)

function applyPreset() {
    if (preset.value === 'custom') return
    const days = parseInt(preset.value)
    const t = new Date()
    const f = new Date(Date.now() - days * 86400000)
    to.value = t.toISOString().slice(0, 10)
    from.value = f.toISOString().slice(0, 10)
    loadAll()
}

async function loadAll() {
    const params = from.value && to.value ? { from: from.value, to: to.value } : {}

    loadingDash.value = true
    get('/api/dashboard', params)
        .then(d => { dash.value = d })
        .catch(() => {})
        .finally(() => { loadingDash.value = false })

    loadingTop.value = true
    get('/api/dashboard/top-products', { limit: 5 })
        .then(d => { topProducts.value = Array.isArray(d) ? d : [] })
        .catch(() => {})
        .finally(() => { loadingTop.value = false })

    loadingTrends.value = true
    get('/api/dashboard/trends', { months: trendMonths })
        .then(d => { trends.value = Array.isArray(d) ? d : [] })
        .catch(() => {})
        .finally(() => { loadingTrends.value = false })
}

const trendsData = computed(() =>
    trends.value.map(t => ({
        label: formatMonthLabel(t.mes),
        value: t.ingresos ?? 0,
        extra: { ordenes: t.ordenes },
    }))
)

onMounted(() => {
    applyPreset()
})
</script>
