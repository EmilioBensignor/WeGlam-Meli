<template>
    <div class="p-6 space-y-5">
        <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
                <h1 class="text-2xl font-bold text-dark">Recomendaciones de pauta</h1>
                <p class="text-sm text-gray-dark mt-1">Basado en rentabilidad, conversión y eficiencia publicitaria actual.</p>
            </div>
        </div>

        <!-- Filters -->
        <div class="flex gap-3 flex-wrap items-center">
            <div class="flex rounded-lg border border-gray-light overflow-hidden bg-white">
                <button v-for="opt in filterOptions" :key="opt.value"
                    @click="filterPauta = opt.value"
                    class="px-4 py-2 text-xs font-medium transition-colors"
                    :class="filterPauta === opt.value ? 'bg-primary text-white' : 'text-gray-dark hover:bg-gray-50'">
                    {{ opt.label }}
                </button>
            </div>
            <select v-model="sortBy"
                class="border border-gray-light rounded-lg px-3 py-2 text-xs bg-white focus:outline-none">
                <option value="rank">Por rank</option>
                <option value="margen">Por margen</option>
                <option value="ganancia">Por ganancia</option>
            </select>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="i in 6" :key="i" class="bg-white rounded-xl border border-gray-light p-5 h-72 animate-pulse" />
        </div>

        <!-- Cards -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="item in filtered" :key="item.ml_id"
                class="bg-white rounded-xl border border-gray-light p-5 flex flex-col gap-3">
                <!-- Rank + image + title -->
                <div class="flex items-start gap-3">
                    <span class="text-secondary font-bold text-lg leading-none">#{{ item.rank }}</span>
                    <img v-if="item.thumbnail" :src="item.thumbnail"
                        class="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                    <div class="min-w-0">
                        <p class="text-xs font-semibold line-clamp-2 leading-snug">{{ item.titulo ?? item.ml_id }}</p>
                    </div>
                </div>

                <!-- Score bar -->
                <div>
                    <div class="flex justify-between text-xs text-gray-dark mb-1">
                        <span>Score</span>
                        <span class="font-medium text-dark">{{ ((item.score ?? 0) * 100).toFixed(0) }}%</span>
                    </div>
                    <div class="w-full bg-gray-light rounded-full h-2">
                        <div class="h-2 rounded-full bg-primary transition-all"
                            :style="{ width: ((item.score ?? 0) * 100) + '%' }" />
                    </div>
                </div>

                <!-- Metrics -->
                <div class="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                    <div class="flex justify-between">
                        <span class="text-gray-dark">Margen</span>
                        <span :class="marginColor(item.margen_porcentaje)">{{ fmtPercent(item.margen_porcentaje) }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-dark">Conversión</span>
                        <span>{{ item.tasa_conversion != null ? fmtPercent(item.tasa_conversion) : '—' }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-dark">Unidades</span>
                        <span>{{ fmtNum(item.unidades_vendidas) }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-dark">ROAS</span>
                        <span>{{ item.roas != null ? fmtMult(item.roas) : '—' }}</span>
                    </div>
                    <div class="flex justify-between col-span-2">
                        <span class="text-gray-dark">ACoS</span>
                        <span>{{ item.acos != null ? fmtPercent(item.acos) : '—' }}</span>
                    </div>
                </div>

                <!-- Recommendation badge -->
                <div class="mt-auto">
                    <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold w-full justify-center"
                        :class="recoBadge(item.recomendacion)">
                        {{ item.recomendacion ?? 'Sin recomendación' }}
                    </span>
                </div>

                <!-- Razón -->
                <p v-if="item.razon" class="text-[0.65rem] text-gray-dark italic leading-snug">
                    "{{ item.razon }}"
                </p>
            </div>

            <div v-if="!filtered.length" class="col-span-3 py-16 text-center text-gray-dark">
                Sin recomendaciones disponibles
            </div>
        </div>
    </div>
</template>

<script setup>
import { formatPercent as fmtPercent, formatMultiplier as fmtMult, formatNumber as fmtNum, marginColor } from '~/utils/format'

const { get } = useApi()

const data = ref([])
const loading = ref(false)
const filterPauta = ref('all')
const sortBy = ref('rank')

const filterOptions = [
    { label: 'Todos', value: 'all' },
    { label: 'Con pauta', value: 'con_pauta' },
    { label: 'Sin pauta', value: 'sin_pauta' },
]

const recoColors = {
    'Iniciar campaña de pauta': 'bg-blue-100 text-blue-800',
    'Aumentar presupuesto de pauta': 'bg-green-100 text-green-800',
    'Mantener inversión publicitaria': 'bg-green-50 text-green-700',
    'Evaluar iniciar pauta': 'bg-yellow-50 text-yellow-800',
    'Reducir o pausar pauta': 'bg-orange-50 text-orange-800',
    'No recomendado para pauta': 'bg-gray-100 text-gray-600',
}

function recoBadge(text) {
    return recoColors[text] ?? 'bg-gray-100 text-gray-600'
}

const filtered = computed(() => {
    let list = data.value
    if (filterPauta.value === 'con_pauta') list = list.filter(i => i.roas != null)
    if (filterPauta.value === 'sin_pauta') list = list.filter(i => i.roas == null)

    return [...list].sort((a, b) => {
        if (sortBy.value === 'rank') return (a.rank ?? 999) - (b.rank ?? 999)
        if (sortBy.value === 'margen') return (b.margen_porcentaje ?? 0) - (a.margen_porcentaje ?? 0)
        if (sortBy.value === 'ganancia') return (b.ganancia_neta ?? 0) - (a.ganancia_neta ?? 0)
        return 0
    })
})

async function load() {
    loading.value = true
    try {
        const res = await get('/api/recommendations')
        data.value = Array.isArray(res) ? res : []
    } catch (e) {
    } finally {
        loading.value = false
    }
}

onMounted(load)
</script>
