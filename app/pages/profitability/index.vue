<template>
    <div class="p-6 space-y-5">
        <div class="flex flex-wrap items-center justify-between gap-3">
            <h1 class="text-2xl font-bold text-dark">Rentabilidad</h1>
            <button @click="openCalc = true"
                class="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90">
                <Icon name="tabler:calculator" class="w-4 h-4" />
                Recalcular rentabilidad
            </button>
        </div>

        <!-- Sort bar -->
        <div class="flex gap-3 flex-wrap items-center">
            <span class="text-xs text-gray-dark">Ordenar por:</span>
            <button v-for="opt in sortOptions" :key="opt.key"
                @click="toggleSort(opt.key)"
                class="text-xs px-3 py-1.5 rounded-lg border transition-colors"
                :class="sortKey === opt.key ? 'bg-primary text-white border-primary' : 'bg-white border-gray-light hover:border-primary text-dark'">
                {{ opt.label }}
                <Icon v-if="sortKey === opt.key" :name="sortDir === 'desc' ? 'tabler:arrow-down' : 'tabler:arrow-up'" class="inline w-3 h-3 ml-0.5" />
            </button>
        </div>

        <!-- Skeleton -->
        <div v-if="loading" class="bg-white rounded-xl border border-gray-light overflow-hidden">
            <div v-for="i in 8" :key="i" class="flex gap-4 px-4 py-3 border-b border-gray-light">
                <div class="h-4 w-32 rounded bg-gray-light animate-pulse" />
                <div class="h-4 flex-1 rounded bg-gray-light animate-pulse" />
            </div>
        </div>

        <!-- Table -->
        <div v-else class="bg-white rounded-xl border border-gray-light overflow-x-auto">
            <table class="w-full text-sm">
                <thead>
                    <tr class="border-b border-gray-light text-left text-xs text-gray-dark bg-gray-50">
                        <th class="px-4 py-3 font-medium">Producto</th>
                        <th class="px-4 py-3 font-medium text-right">Ingresos</th>
                        <th class="px-4 py-3 font-medium text-right hidden md:table-cell">Comisión ML</th>
                        <th class="px-4 py-3 font-medium text-right hidden md:table-cell">Pauta</th>
                        <th class="px-4 py-3 font-medium text-right font-bold">Ganancia neta</th>
                        <th class="px-4 py-3 font-medium text-right">Margen</th>
                        <th class="px-4 py-3 font-medium text-right hidden lg:table-cell">ROI</th>
                        <th class="px-4 py-3 font-medium text-right hidden lg:table-cell">ROAS</th>
                        <th class="px-4 py-3 font-medium text-right hidden lg:table-cell">ACoS</th>
                        <th class="px-4 py-3 font-medium text-right hidden sm:table-cell">Uds.</th>
                        <th class="px-4 py-3 font-medium hidden xl:table-cell">Snapshot</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="p in sorted" :key="p.ml_id"
                        class="border-b border-gray-light last:border-none hover:bg-gray-50 transition-colors">
                        <td class="px-4 py-3 flex items-center gap-2 min-w-0 max-w-[14rem]">
                            <img v-if="p.productos?.thumbnail" :src="p.productos.thumbnail"
                                class="w-8 h-8 rounded object-cover flex-shrink-0" />
                            <span class="text-xs truncate">{{ p.productos?.titulo ?? p.ml_id }}</span>
                        </td>
                        <td class="px-4 py-3 text-right text-xs">{{ fmtCurrency(p.ingresos_brutos) }}</td>
                        <td class="px-4 py-3 text-right text-xs text-red-500 hidden md:table-cell">{{ fmtCurrency(p.comision_ml) }}</td>
                        <td class="px-4 py-3 text-right text-xs text-red-500 hidden md:table-cell">{{ fmtCurrency(p.gasto_publicidad) }}</td>
                        <td class="px-4 py-3 text-right font-bold text-sm"
                            :class="(p.ganancia_neta ?? 0) > 0 ? 'text-green-700' : 'text-red-600'">
                            {{ fmtCurrency(p.ganancia_neta) }}
                        </td>
                        <td class="px-4 py-3 text-right">
                            <span class="px-1.5 py-0.5 rounded-full text-[0.65rem] font-medium"
                                :class="marginBadge(p.margen_porcentaje)">
                                {{ fmtPercent(p.margen_porcentaje) }}
                            </span>
                        </td>
                        <td class="px-4 py-3 text-right text-xs hidden lg:table-cell">
                            {{ p.roi != null ? fmtMult(p.roi) : '—' }}
                        </td>
                        <td class="px-4 py-3 text-right text-xs hidden lg:table-cell">
                            {{ p.roas != null ? fmtMult(p.roas) : 'Sin pauta' }}
                        </td>
                        <td class="px-4 py-3 text-right text-xs hidden lg:table-cell">
                            {{ p.acos != null ? fmtPercent(p.acos) : '—' }}
                        </td>
                        <td class="px-4 py-3 text-right text-xs hidden sm:table-cell">{{ fmtNum(p.unidades_vendidas) }}</td>
                        <td class="px-4 py-3 text-xs text-gray-dark hidden xl:table-cell">{{ fmtRelDate(p.snapshot_date) }}</td>
                    </tr>
                    <tr v-if="!sorted.length">
                        <td colspan="11" class="py-12 text-center text-gray-dark text-sm">Sin datos de rentabilidad</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Recalculate Modal -->
        <Teleport to="body">
            <div v-if="openCalc" class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                <div class="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl space-y-4">
                    <h2 class="font-semibold text-lg">Recalcular rentabilidad</h2>
                    <div class="space-y-3">
                        <div>
                            <label class="text-xs text-gray-dark block mb-1">Desde</label>
                            <input type="date" v-model="calcFrom"
                                class="w-full border border-gray-light rounded-lg px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label class="text-xs text-gray-dark block mb-1">Hasta</label>
                            <input type="date" v-model="calcTo"
                                class="w-full border border-gray-light rounded-lg px-3 py-2 text-sm" />
                        </div>
                    </div>
                    <div class="flex gap-3 justify-end">
                        <button @click="openCalc = false"
                            class="px-4 py-2 text-sm rounded-lg border border-gray-light hover:bg-gray-50">
                            Cancelar
                        </button>
                        <button @click="calculate" :disabled="calculating"
                            class="px-4 py-2 text-sm rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-60 flex items-center gap-2">
                            <Icon v-if="calculating" name="tabler:loader-2" class="w-4 h-4 animate-spin" />
                            {{ calculating ? 'Calculando...' : 'Calcular' }}
                        </button>
                    </div>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<script setup>
import { formatCurrency as fmtCurrency, formatPercent as fmtPercent, formatMultiplier as fmtMult, formatNumber as fmtNum, formatRelativeDate as fmtRelDate, marginBadgeClass as marginBadge } from '~/utils/format'

const { get, post } = useApi()
const notification = useNotification()

const data = ref([])
const loading = ref(false)
const openCalc = ref(false)
const calculating = ref(false)
const calcFrom = ref('')
const calcTo = ref('')
const sortKey = ref('ganancia_neta')
const sortDir = ref('desc')

const sortOptions = [
    { key: 'ganancia_neta', label: 'Ganancia neta' },
    { key: 'margen_porcentaje', label: 'Margen' },
    { key: 'ingresos_brutos', label: 'Ingresos' },
    { key: 'roas', label: 'ROAS' },
]

function toggleSort(key) {
    if (sortKey.value === key) {
        sortDir.value = sortDir.value === 'desc' ? 'asc' : 'desc'
    } else {
        sortKey.value = key
        sortDir.value = 'desc'
    }
}

const sorted = computed(() => {
    return [...data.value].sort((a, b) => {
        const av = a[sortKey.value] ?? -Infinity
        const bv = b[sortKey.value] ?? -Infinity
        return sortDir.value === 'desc' ? bv - av : av - bv
    })
})

async function load() {
    loading.value = true
    try {
        const res = await get('/api/profitability')
        data.value = Array.isArray(res) ? res : []
    } catch (e) {
    } finally {
        loading.value = false
    }
}

async function calculate() {
    calculating.value = true
    try {
        const body = {}
        if (calcFrom.value) body.from = calcFrom.value
        if (calcTo.value) body.to = calcTo.value
        const res = await post('/api/profitability/calculate', body)
        const from = calcFrom.value ? new Date(calcFrom.value).toLocaleDateString('es-AR') : ''
        const to = calcTo.value ? new Date(calcTo.value).toLocaleDateString('es-AR') : ''
        notification.success(`Calculados ${res?.calculated ?? ''} productos${from ? ` para ${from} - ${to}` : ''}`)
        openCalc.value = false
        await load()
    } catch (e) {
    } finally {
        calculating.value = false
    }
}

onMounted(load)
</script>
