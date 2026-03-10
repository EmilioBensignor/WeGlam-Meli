<template>
    <div class="p-6 space-y-5">
        <h1 class="text-2xl font-bold text-dark">Costos</h1>

        <!-- Alert: productos sin costo -->
        <div v-if="productsWithoutCost.length"
            class="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
            <Icon name="tabler:alert-triangle" class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
                <p class="text-sm font-medium text-yellow-800">
                    {{ productsWithoutCost.length }} producto{{ productsWithoutCost.length !== 1 ? 's' : '' }} activo{{ productsWithoutCost.length !== 1 ? 's' : '' }} sin costo cargado.
                    La rentabilidad para esos productos asume costo = $0.
                </p>
                <button @click="showMissing = !showMissing"
                    class="text-xs text-yellow-700 font-medium hover:underline mt-1">
                    {{ showMissing ? 'Ocultar' : 'Cargar costos pendientes' }}
                </button>
            </div>
        </div>

        <!-- Tabs -->
        <div class="flex border-b border-gray-light">
            <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key"
                class="px-4 py-2.5 text-sm font-medium border-b-2 transition-colors"
                :class="activeTab === tab.key ? 'border-primary text-primary' : 'border-transparent text-gray-dark hover:text-dark'">
                {{ tab.label }}
                <span v-if="tab.key === 'missing'" class="ml-1.5 bg-yellow-100 text-yellow-800 text-[0.6rem] px-1.5 py-0.5 rounded-full">
                    {{ productsWithoutCost.length }}
                </span>
            </button>
        </div>

        <!-- Tab: Costos cargados -->
        <div v-if="activeTab === 'loaded'">
            <div v-if="loading" class="space-y-2">
                <div v-for="i in 6" :key="i" class="h-14 rounded bg-gray-light animate-pulse" />
            </div>
            <div v-else class="bg-white rounded-xl border border-gray-light overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b border-gray-light text-left text-xs text-gray-dark bg-gray-50">
                            <th class="px-4 py-3 font-medium">Producto</th>
                            <th class="px-4 py-3 font-medium text-right">Costo unitario</th>
                            <th class="px-4 py-3 font-medium text-right hidden md:table-cell">Otros costos</th>
                            <th class="px-4 py-3 font-medium hidden lg:table-cell">Notas</th>
                            <th class="px-4 py-3 font-medium hidden xl:table-cell">Actualizado</th>
                            <th class="px-4 py-3 font-medium"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="c in costs" :key="c.ml_id"
                            class="border-b border-gray-light last:border-none hover:bg-gray-50 group">
                            <td class="px-4 py-3">
                                <div class="flex items-center gap-2">
                                    <img v-if="productMap[c.ml_id]?.thumbnail" :src="productMap[c.ml_id].thumbnail"
                                        class="w-8 h-8 rounded object-cover flex-shrink-0" />
                                    <span class="text-xs truncate max-w-[10rem]">
                                        {{ productMap[c.ml_id]?.titulo ?? c.ml_id }}
                                    </span>
                                </div>
                            </td>
                            <td class="px-4 py-3 text-right">
                                <input v-if="editing[c.ml_id]" v-model.number="editing[c.ml_id].costo" type="number" min="0"
                                    class="w-24 border border-gray-light rounded px-2 py-1 text-xs text-right focus:outline-none focus:ring-2 focus:ring-primary/30" />
                                <span v-else class="text-xs font-medium">{{ fmtCurrency(c.costo) }}</span>
                            </td>
                            <td class="px-4 py-3 text-right hidden md:table-cell">
                                <input v-if="editing[c.ml_id]" v-model.number="editing[c.ml_id].otros_costos" type="number" min="0"
                                    class="w-24 border border-gray-light rounded px-2 py-1 text-xs text-right focus:outline-none focus:ring-2 focus:ring-primary/30" />
                                <span v-else class="text-xs">{{ fmtCurrency(c.otros_costos) }}</span>
                            </td>
                            <td class="px-4 py-3 hidden lg:table-cell">
                                <input v-if="editing[c.ml_id]" v-model="editing[c.ml_id].notas" type="text"
                                    class="w-36 border border-gray-light rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30" />
                                <span v-else class="text-xs text-gray-dark">{{ c.notas ?? '—' }}</span>
                            </td>
                            <td class="px-4 py-3 text-xs text-gray-dark hidden xl:table-cell">{{ fmtRelDate(c.actualizado_en) }}</td>
                            <td class="px-4 py-3">
                                <div class="flex items-center gap-2">
                                    <template v-if="editing[c.ml_id]">
                                        <button @click="saveCost(c.ml_id)" :disabled="saving[c.ml_id]"
                                            class="text-xs text-white bg-primary px-2 py-1 rounded hover:bg-primary/90 disabled:opacity-60 flex items-center gap-1">
                                            <Icon v-if="saving[c.ml_id]" name="tabler:loader-2" class="w-3 h-3 animate-spin" />
                                            Guardar
                                        </button>
                                        <button @click="cancelEdit(c.ml_id)" class="text-xs text-gray-dark hover:text-dark">
                                            Cancelar
                                        </button>
                                    </template>
                                    <template v-else>
                                        <button @click="startEdit(c)" class="text-xs text-primary hover:underline opacity-0 group-hover:opacity-100 transition-opacity">
                                            Editar
                                        </button>
                                        <button @click="deleteCost(c.ml_id)" class="text-xs text-red-500 hover:underline opacity-0 group-hover:opacity-100 transition-opacity">
                                            Eliminar
                                        </button>
                                    </template>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="!costs.length">
                            <td colspan="6" class="py-10 text-center text-gray-dark text-sm">Sin costos cargados</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Tab: Sin costo -->
        <div v-if="activeTab === 'missing'" class="space-y-3">
            <p class="text-xs text-gray-dark">Ingresá el costo para cada producto activo sin costo registrado.</p>
            <div v-for="p in productsWithoutCost" :key="p.ml_id"
                class="bg-white rounded-xl border border-gray-light p-4 flex flex-wrap items-center gap-4">
                <div class="flex items-center gap-3 min-w-0 flex-1">
                    <img v-if="p.thumbnail" :src="p.thumbnail" class="w-10 h-10 rounded object-cover flex-shrink-0" />
                    <div class="min-w-0">
                        <p class="text-xs font-medium truncate">{{ p.titulo }}</p>
                        <p class="text-[0.6rem] text-gray-dark">{{ p.ml_id }}</p>
                    </div>
                </div>
                <div class="flex items-center gap-2 flex-wrap">
                    <div>
                        <label class="text-[0.6rem] text-gray-dark block mb-0.5">Costo</label>
                        <input v-model.number="newCosts[p.ml_id].costo" type="number" min="0" placeholder="0"
                            class="w-24 border border-gray-light rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    </div>
                    <div>
                        <label class="text-[0.6rem] text-gray-dark block mb-0.5">Otros</label>
                        <input v-model.number="newCosts[p.ml_id].otros_costos" type="number" min="0" placeholder="0"
                            class="w-20 border border-gray-light rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    </div>
                    <div class="self-end">
                        <button @click="saveNewCost(p.ml_id)" :disabled="saving[p.ml_id]"
                            class="bg-primary text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-primary/90 disabled:opacity-60 flex items-center gap-1">
                            <Icon v-if="saving[p.ml_id]" name="tabler:loader-2" class="w-3 h-3 animate-spin" />
                            Guardar
                        </button>
                    </div>
                </div>
            </div>
            <p v-if="!productsWithoutCost.length" class="py-8 text-center text-gray-dark text-sm">
                Todos los productos tienen costo cargado ✓
            </p>
        </div>
    </div>
</template>

<script setup>
import { formatCurrency as fmtCurrency, formatRelativeDate as fmtRelDate } from '~/utils/format'

const { get, post, del } = useApi()
const notification = useNotification()

const tabs = [
    { key: 'loaded', label: 'Costos cargados' },
    { key: 'missing', label: 'Sin costo' },
]
const activeTab = ref('loaded')
const showMissing = ref(false)

const costs = ref([])
const products = ref([])
const loading = ref(false)
const editing = reactive({})
const saving = reactive({})
const newCosts = reactive({})

const productMap = computed(() => {
    const map = {}
    products.value.forEach(p => { map[p.ml_id] = p })
    return map
})

const costMlIds = computed(() => new Set(costs.value.map(c => c.ml_id)))

const productsWithoutCost = computed(() =>
    products.value.filter(p => p.estado === 'active' && !costMlIds.value.has(p.ml_id))
)

watch(productsWithoutCost, (list) => {
    list.forEach(p => {
        if (!newCosts[p.ml_id]) newCosts[p.ml_id] = { costo: 0, otros_costos: 0, notas: '' }
    })
}, { immediate: true })

watch(showMissing, (val) => {
    if (val) activeTab.value = 'missing'
})

function startEdit(c) {
    editing[c.ml_id] = { costo: c.costo ?? 0, otros_costos: c.otros_costos ?? 0, notas: c.notas ?? '' }
}

function cancelEdit(mlId) {
    delete editing[mlId]
}

async function saveCost(mlId) {
    saving[mlId] = true
    try {
        await post(`/api/costs/${mlId}`, editing[mlId])
        notification.success('Costo actualizado')
        delete editing[mlId]
        await load()
    } catch (e) {} finally { delete saving[mlId] }
}

async function saveNewCost(mlId) {
    saving[mlId] = true
    try {
        await post(`/api/costs/${mlId}`, newCosts[mlId])
        notification.success('Costo guardado')
        await load()
    } catch (e) {} finally { delete saving[mlId] }
}

async function deleteCost(mlId) {
    if (!confirm('¿Eliminar el costo de este producto?')) return
    try {
        await del(`/api/costs/${mlId}`)
        notification.success('Costo eliminado')
        await load()
    } catch (e) {}
}

async function load() {
    loading.value = true
    try {
        const [c, p] = await Promise.all([
            get('/api/costs').then(d => Array.isArray(d) ? d : []),
            get('/api/sync-products').then(d => Array.isArray(d) ? d : []),
        ])
        costs.value = c
        products.value = p
    } catch (e) {} finally { loading.value = false }
}

onMounted(load)
</script>
