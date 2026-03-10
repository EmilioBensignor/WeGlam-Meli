<template>
    <div class="p-6 space-y-5">
        <div class="flex flex-wrap items-center justify-between gap-3">
            <h1 class="text-2xl font-bold text-dark">Órdenes</h1>
            <button @click="syncOrders" :disabled="syncing"
                class="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-60">
                <Icon :name="syncing ? 'tabler:loader-2' : 'tabler:refresh'" class="w-4 h-4" :class="{ 'animate-spin': syncing }" />
                {{ syncing ? 'Sincronizando...' : 'Sincronizar órdenes' }}
            </button>
        </div>

        <!-- Tabs -->
        <div class="flex border-b border-gray-light">
            <button v-for="tab in tabs" :key="tab.key"
                @click="activeTab = tab.key"
                class="px-4 py-2.5 text-sm font-medium border-b-2 transition-colors"
                :class="activeTab === tab.key
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-dark hover:text-dark'">
                {{ tab.label }}
            </button>
        </div>

        <!-- Tab: Resumen por producto -->
        <div v-if="activeTab === 'summary'">
            <div v-if="loadingSummary" class="space-y-2">
                <div v-for="i in 6" :key="i" class="h-12 rounded bg-gray-light animate-pulse" />
            </div>
            <div v-else class="bg-white rounded-xl border border-gray-light overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b border-gray-light text-left text-xs text-gray-dark bg-gray-50">
                            <th class="px-4 py-3 font-medium">Producto</th>
                            <th class="px-4 py-3 font-medium text-right">Ingresos</th>
                            <th class="px-4 py-3 font-medium text-right">Unidades</th>
                            <th class="px-4 py-3 font-medium text-right hidden sm:table-cell">Órdenes</th>
                            <th class="px-4 py-3 font-medium text-right hidden md:table-cell">Ticket prom.</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="row in summaryByIngreso" :key="row.ml_id"
                            class="border-b border-gray-light last:border-none hover:bg-gray-50">
                            <td class="px-4 py-3 text-xs">{{ row.ml_id }}</td>
                            <td class="px-4 py-3 text-right font-medium text-xs">{{ fmtCurrency(row.ingresos) }}</td>
                            <td class="px-4 py-3 text-right text-xs">{{ fmtNum(row.unidades) }}</td>
                            <td class="px-4 py-3 text-right text-xs hidden sm:table-cell">{{ fmtNum(row.ordenes) }}</td>
                            <td class="px-4 py-3 text-right text-xs hidden md:table-cell">
                                {{ row.ordenes ? fmtCurrency(row.ingresos / row.ordenes) : '—' }}
                            </td>
                        </tr>
                        <tr v-if="!summaryByIngreso.length">
                            <td colspan="5" class="py-10 text-center text-gray-dark text-sm">Sin datos</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Tab: Órdenes individuales -->
        <div v-if="activeTab === 'orders'" class="space-y-4">
            <!-- Filters -->
            <div class="flex gap-3 flex-wrap">
                <select v-model="statusFilter"
                    class="border border-gray-light rounded-lg px-3 py-2 text-xs bg-white focus:outline-none">
                    <option value="">Todos los estados</option>
                    <option value="paid">Pagadas</option>
                    <option value="cancelled">Canceladas</option>
                </select>
                <input type="date" v-model="dateFrom" class="border border-gray-light rounded-lg px-3 py-2 text-xs bg-white" />
                <span class="text-gray-dark text-xs self-center">→</span>
                <input type="date" v-model="dateTo" class="border border-gray-light rounded-lg px-3 py-2 text-xs bg-white" />
                <input v-model="productFilter" placeholder="ML ID del producto..."
                    class="border border-gray-light rounded-lg px-3 py-2 text-xs bg-white w-44 focus:outline-none" />
                <button @click="loadOrders"
                    class="bg-primary text-white px-4 py-2 rounded-lg text-xs font-medium hover:bg-primary/90">
                    Filtrar
                </button>
            </div>

            <div v-if="loadingOrders" class="space-y-2">
                <div v-for="i in 8" :key="i" class="h-12 rounded bg-gray-light animate-pulse" />
            </div>
            <div v-else class="bg-white rounded-xl border border-gray-light overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b border-gray-light text-left text-xs text-gray-dark bg-gray-50">
                            <th class="px-4 py-3 font-medium">Orden #</th>
                            <th class="px-4 py-3 font-medium hidden md:table-cell">Producto</th>
                            <th class="px-4 py-3 font-medium text-right">Monto</th>
                            <th class="px-4 py-3 font-medium text-right hidden sm:table-cell">Unidades</th>
                            <th class="px-4 py-3 font-medium">Estado</th>
                            <th class="px-4 py-3 font-medium hidden lg:table-cell">Fecha</th>
                            <th class="px-4 py-3 font-medium text-right hidden lg:table-cell">Envío</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="o in orders" :key="o.order_id"
                            class="border-b border-gray-light last:border-none hover:bg-gray-50">
                            <td class="px-4 py-3 text-xs font-mono">{{ o.order_id }}</td>
                            <td class="px-4 py-3 text-xs text-gray-dark hidden md:table-cell">{{ o.ml_id }}</td>
                            <td class="px-4 py-3 text-right font-medium text-xs">{{ fmtCurrency(o.total_amount) }}</td>
                            <td class="px-4 py-3 text-right text-xs hidden sm:table-cell">{{ o.quantity }}</td>
                            <td class="px-4 py-3">
                                <UiBadge :text="o.status" :variant="o.status === 'paid' ? 'success' : o.status === 'cancelled' ? 'danger' : 'gray'" />
                            </td>
                            <td class="px-4 py-3 text-xs text-gray-dark hidden lg:table-cell">{{ fmtDate(o.date_closed) }}</td>
                            <td class="px-4 py-3 text-right text-xs hidden lg:table-cell">{{ fmtCurrency(o.shipping_cost) }}</td>
                        </tr>
                        <tr v-if="!orders.length">
                            <td colspan="7" class="py-10 text-center text-gray-dark text-sm">Sin órdenes para los filtros seleccionados</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { formatCurrency as fmtCurrency, formatNumber as fmtNum, formatDate as fmtDate } from '~/utils/format'

const { get, post } = useApi()
const notification = useNotification()

const activeTab = ref('summary')
const tabs = [
    { key: 'summary', label: 'Resumen por producto' },
    { key: 'orders', label: 'Órdenes individuales' },
]

const summary = ref([])
const orders = ref([])
const loadingSummary = ref(false)
const loadingOrders = ref(false)
const syncing = ref(false)

const statusFilter = ref('paid')
const dateFrom = ref('')
const dateTo = ref('')
const productFilter = ref('')

const summaryByIngreso = computed(() =>
    [...summary.value].sort((a, b) => (b.ingresos ?? 0) - (a.ingresos ?? 0))
)

async function loadSummary() {
    loadingSummary.value = true
    try { summary.value = await get('/api/orders/summary').then(d => Array.isArray(d) ? d : []) }
    catch (e) {} finally { loadingSummary.value = false }
}

async function loadOrders() {
    loadingOrders.value = true
    const params = {}
    if (statusFilter.value) params.status = statusFilter.value
    if (dateFrom.value) params.from = dateFrom.value
    if (dateTo.value) params.to = dateTo.value
    if (productFilter.value.trim()) params.mlId = productFilter.value.trim()
    try { orders.value = await get('/api/orders', params).then(d => Array.isArray(d) ? d : []) }
    catch (e) {} finally { loadingOrders.value = false }
}

async function syncOrders() {
    syncing.value = true
    try {
        const res = await post('/api/sync/orders')
        notification.success(`Órdenes sincronizadas`)
        loadSummary()
    } catch (e) {} finally { syncing.value = false }
}

watch(activeTab, (tab) => {
    if (tab === 'summary' && !summary.value.length) loadSummary()
    if (tab === 'orders' && !orders.value.length) loadOrders()
})

onMounted(() => {
    loadSummary()
})
</script>
