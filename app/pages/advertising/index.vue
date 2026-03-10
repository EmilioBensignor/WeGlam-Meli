<template>
    <div class="p-6 space-y-5">
        <div class="flex flex-wrap items-center justify-between gap-3">
            <h1 class="text-2xl font-bold text-dark">Publicidad</h1>
            <button @click="syncAds" :disabled="syncing"
                class="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-60">
                <Icon :name="syncing ? 'tabler:loader-2' : 'tabler:refresh'" class="w-4 h-4" :class="{ 'animate-spin': syncing }" />
                {{ syncing ? 'Sincronizando...' : 'Sincronizar publicidad' }}
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

        <!-- Tab: Campañas -->
        <div v-if="activeTab === 'campaigns'">
            <div v-if="loadingCampaigns" class="space-y-2">
                <div v-for="i in 5" :key="i" class="h-12 rounded bg-gray-light animate-pulse" />
            </div>
            <div v-else class="bg-white rounded-xl border border-gray-light overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b border-gray-light text-left text-xs text-gray-dark bg-gray-50">
                            <th class="px-4 py-3 font-medium">Nombre</th>
                            <th class="px-4 py-3 font-medium">Estado</th>
                            <th class="px-4 py-3 font-medium text-right">Presupuesto</th>
                            <th class="px-4 py-3 font-medium hidden md:table-cell">Tipo</th>
                            <th class="px-4 py-3 font-medium hidden lg:table-cell">Última sync</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="c in campaigns" :key="c.id"
                            class="border-b border-gray-light last:border-none hover:bg-gray-50">
                            <td class="px-4 py-3 font-medium text-xs">{{ c.nombre }}</td>
                            <td class="px-4 py-3">
                                <UiBadge :text="c.status" :variant="c.status === 'active' ? 'success' : 'gray'" />
                            </td>
                            <td class="px-4 py-3 text-right text-xs">{{ fmtCurrency(c.budget) }}</td>
                            <td class="px-4 py-3 text-xs text-gray-dark hidden md:table-cell">{{ c.tipo ?? '—' }}</td>
                            <td class="px-4 py-3 text-xs text-gray-dark hidden lg:table-cell">{{ fmtDate(c.synced_at) }}</td>
                        </tr>
                        <tr v-if="!campaigns.length">
                            <td colspan="5" class="py-10 text-center text-gray-dark text-sm">Sin campañas</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Tab: Ads -->
        <div v-if="activeTab === 'ads'">
            <div class="flex gap-3 mb-4 flex-wrap">
                <select v-model="adCampaignFilter"
                    class="border border-gray-light rounded-lg px-3 py-2 text-xs bg-white focus:outline-none">
                    <option value="">Todas las campañas</option>
                    <option v-for="c in campaigns" :key="c.id" :value="c.id">{{ c.nombre }}</option>
                </select>
                <input v-model="adProductFilter" placeholder="Filtrar por producto..."
                    class="border border-gray-light rounded-lg px-3 py-2 text-xs bg-white focus:outline-none w-52" />
            </div>
            <div v-if="loadingAds" class="space-y-2">
                <div v-for="i in 5" :key="i" class="h-12 rounded bg-gray-light animate-pulse" />
            </div>
            <div v-else class="bg-white rounded-xl border border-gray-light overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b border-gray-light text-left text-xs text-gray-dark bg-gray-50">
                            <th class="px-4 py-3 font-medium">Producto (ML ID)</th>
                            <th class="px-4 py-3 font-medium">Campaña</th>
                            <th class="px-4 py-3 font-medium">Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="a in filteredAds" :key="a.id"
                            class="border-b border-gray-light last:border-none hover:bg-gray-50">
                            <td class="px-4 py-3 text-xs">{{ a.ml_id }}</td>
                            <td class="px-4 py-3 text-xs text-gray-dark">{{ a.campanas_publicidad?.nombre ?? a.campaign_id ?? '—' }}</td>
                            <td class="px-4 py-3">
                                <UiBadge :text="a.status" :variant="a.status === 'active' ? 'success' : 'gray'" />
                            </td>
                        </tr>
                        <tr v-if="!filteredAds.length">
                            <td colspan="3" class="py-10 text-center text-gray-dark text-sm">Sin ads</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Tab: Performance -->
        <div v-if="activeTab === 'stats'" class="space-y-5">
            <!-- Period filter -->
            <div class="flex gap-3 flex-wrap items-center">
                <input type="date" v-model="statsFrom" class="border border-gray-light rounded-lg px-3 py-2 text-xs bg-white" />
                <span class="text-gray-dark text-xs">→</span>
                <input type="date" v-model="statsTo" class="border border-gray-light rounded-lg px-3 py-2 text-xs bg-white" />
                <button @click="loadStats"
                    class="bg-primary text-white px-4 py-2 rounded-lg text-xs font-medium hover:bg-primary/90">
                    Aplicar
                </button>
            </div>

            <!-- KPI cards -->
            <div v-if="loadingStats" class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div v-for="i in 7" :key="i" class="h-20 rounded-xl bg-gray-light animate-pulse" />
            </div>
            <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                <UiKpiCard label="Impresiones" :value="fmtNum(statsAgg.impressions)" />
                <UiKpiCard label="Clicks" :value="fmtNum(statsAgg.clicks)" />
                <UiKpiCard label="CTR" :value="fmtPercent(statsAgg.ctr)" />
                <UiKpiCard label="Gasto" :value="fmtCurrency(statsAgg.spend)" />
                <UiKpiCard label="Ventas atribuidas" :value="fmtCurrency(statsAgg.attributed_sales)" />
                <UiKpiCard label="ROAS" :value="statsAgg.roas != null ? fmtMult(statsAgg.roas) : '—'" />
                <UiKpiCard label="Conversiones" :value="fmtNum(statsAgg.conversions)" />
            </div>

            <!-- Stats table -->
            <div class="bg-white rounded-xl border border-gray-light overflow-x-auto">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-gray-light text-left text-gray-dark bg-gray-50">
                            <th class="px-4 py-3 font-medium">Fecha</th>
                            <th class="px-4 py-3 font-medium hidden md:table-cell">Ad ID</th>
                            <th class="px-4 py-3 font-medium hidden lg:table-cell">Producto</th>
                            <th class="px-4 py-3 font-medium text-right">Impresiones</th>
                            <th class="px-4 py-3 font-medium text-right">Clicks</th>
                            <th class="px-4 py-3 font-medium text-right">CTR</th>
                            <th class="px-4 py-3 font-medium text-right">Gasto</th>
                            <th class="px-4 py-3 font-medium text-right hidden sm:table-cell">Ventas</th>
                            <th class="px-4 py-3 font-medium text-right hidden sm:table-cell">ROAS</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(row, i) in statsData" :key="i"
                            class="border-b border-gray-light last:border-none hover:bg-gray-50">
                            <td class="px-4 py-3">{{ fmtDate(row.date) }}</td>
                            <td class="px-4 py-3 text-gray-dark hidden md:table-cell">{{ row.ad_id }}</td>
                            <td class="px-4 py-3 text-gray-dark hidden lg:table-cell">{{ row.ml_id }}</td>
                            <td class="px-4 py-3 text-right">{{ fmtNum(row.impressions) }}</td>
                            <td class="px-4 py-3 text-right">{{ fmtNum(row.clicks) }}</td>
                            <td class="px-4 py-3 text-right">{{ fmtPercent(row.impressions ? row.clicks / row.impressions * 100 : 0) }}</td>
                            <td class="px-4 py-3 text-right">{{ fmtCurrency(row.spend) }}</td>
                            <td class="px-4 py-3 text-right hidden sm:table-cell">{{ fmtCurrency(row.attributed_sales) }}</td>
                            <td class="px-4 py-3 text-right hidden sm:table-cell">
                                {{ row.spend ? fmtMult(row.attributed_sales / row.spend) : '—' }}
                            </td>
                        </tr>
                        <tr v-if="!statsData.length">
                            <td colspan="9" class="py-10 text-center text-gray-dark">Sin datos para el período</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { formatCurrency as fmtCurrency, formatPercent as fmtPercent, formatMultiplier as fmtMult, formatNumber as fmtNum, formatDate as fmtDate } from '~/utils/format'

const { get, post } = useApi()
const notification = useNotification()

const activeTab = ref('campaigns')
const tabs = [
    { key: 'campaigns', label: 'Campañas' },
    { key: 'ads', label: 'Ads' },
    { key: 'stats', label: 'Performance' },
]

const campaigns = ref([])
const ads = ref([])
const statsData = ref([])
const loadingCampaigns = ref(false)
const loadingAds = ref(false)
const loadingStats = ref(false)
const syncing = ref(false)

const adCampaignFilter = ref('')
const adProductFilter = ref('')
const statsFrom = ref('')
const statsTo = ref('')

const filteredAds = computed(() => {
    let list = ads.value
    if (adCampaignFilter.value) list = list.filter(a => a.campaign_id == adCampaignFilter.value)
    if (adProductFilter.value.trim()) {
        const q = adProductFilter.value.toLowerCase()
        list = list.filter(a => String(a.ml_id).toLowerCase().includes(q))
    }
    return list
})

const statsAgg = computed(() => {
    const impressions = statsData.value.reduce((s, r) => s + (r.impressions ?? 0), 0)
    const clicks = statsData.value.reduce((s, r) => s + (r.clicks ?? 0), 0)
    const spend = statsData.value.reduce((s, r) => s + (r.spend ?? 0), 0)
    const attributed_sales = statsData.value.reduce((s, r) => s + (r.attributed_sales ?? 0), 0)
    const conversions = statsData.value.reduce((s, r) => s + (r.conversions ?? 0), 0)
    return {
        impressions, clicks, spend, attributed_sales, conversions,
        ctr: impressions ? (clicks / impressions) * 100 : null,
        roas: spend ? attributed_sales / spend : null,
    }
})

async function loadCampaigns() {
    loadingCampaigns.value = true
    try { campaigns.value = await get('/api/advertising/campaigns').then(d => Array.isArray(d) ? d : []) }
    catch (e) {} finally { loadingCampaigns.value = false }
}

async function loadAds() {
    loadingAds.value = true
    try { ads.value = await get('/api/advertising/ads').then(d => Array.isArray(d) ? d : []) }
    catch (e) {} finally { loadingAds.value = false }
}

async function loadStats() {
    loadingStats.value = true
    try {
        const params = {}
        if (statsFrom.value) params.from = statsFrom.value
        if (statsTo.value) params.to = statsTo.value
        statsData.value = await get('/api/advertising/stats', params).then(d => Array.isArray(d) ? d : [])
    } catch (e) {} finally { loadingStats.value = false }
}

async function syncAds() {
    syncing.value = true
    try {
        const res = await post('/api/sync/advertising')
        notification.success(`Publicidad sincronizada`)
        loadCampaigns()
        loadAds()
    } catch (e) {} finally { syncing.value = false }
}

watch(activeTab, (tab) => {
    if (tab === 'campaigns' && !campaigns.value.length) loadCampaigns()
    if (tab === 'ads' && !ads.value.length) loadAds()
    if (tab === 'stats' && !statsData.value.length) loadStats()
})

onMounted(() => {
    loadCampaigns()
})
</script>
