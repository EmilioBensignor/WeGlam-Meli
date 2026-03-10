<template>
    <div class="p-6">
        <NuxtLink to="/products" class="flex items-center gap-1 text-sm text-gray-dark hover:text-dark mb-6">
            <Icon name="tabler:arrow-left" class="w-4 h-4" />
            Volver a productos
        </NuxtLink>

        <div v-if="loading" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="space-y-4">
                <div class="h-64 rounded-xl bg-gray-light animate-pulse" />
                <div class="h-6 w-3/4 rounded bg-gray-light animate-pulse" />
                <div class="h-4 w-1/2 rounded bg-gray-light animate-pulse" />
            </div>
            <div class="space-y-4">
                <div class="h-40 rounded-xl bg-gray-light animate-pulse" />
                <div class="h-40 rounded-xl bg-gray-light animate-pulse" />
            </div>
        </div>

        <div v-else-if="!product" class="py-16 text-center text-gray-dark">
            Producto no encontrado
        </div>

        <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- LEFT: Product info -->
            <div class="space-y-5">
                <!-- Images -->
                <div class="grid grid-cols-3 gap-2">
                    <img v-for="img in images" :key="img.id" :src="img.url" :alt="product.titulo"
                        class="w-full aspect-square object-contain rounded-xl border border-gray-light bg-white p-2" />
                </div>

                <!-- Title + badges -->
                <div>
                    <div class="flex items-center gap-2 mb-2">
                        <UiBadge :text="product.estado" :variant="estadoBadge(product.estado)" />
                        <UiBadge v-if="product.condicion"
                            :text="product.condicion === 'new' ? 'Nuevo' : 'Usado'" variant="info" />
                    </div>
                    <h1 class="text-xl font-bold text-dark leading-snug">{{ product.titulo }}</h1>
                    <p class="text-xs text-gray-dark mt-1">ML ID: {{ product.ml_id }}
                        <span v-if="product.sku"> · SKU: {{ product.sku }}</span>
                    </p>
                </div>

                <!-- Stats -->
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div class="bg-gray-50 rounded-xl p-3 flex flex-col gap-1">
                        <span class="text-[0.65rem] text-gray-dark uppercase tracking-wide">Precio</span>
                        <span class="text-lg font-bold">{{ fmtCurrency(product.precio) }}</span>
                    </div>
                    <div class="bg-gray-50 rounded-xl p-3 flex flex-col gap-1">
                        <span class="text-[0.65rem] text-gray-dark uppercase tracking-wide">Stock</span>
                        <span class="text-lg font-bold" :class="product.disponibles === 0 ? 'text-red-600' : ''">
                            {{ product.disponibles ?? '—' }}
                        </span>
                    </div>
                    <div class="bg-gray-50 rounded-xl p-3 flex flex-col gap-1">
                        <span class="text-[0.65rem] text-gray-dark uppercase tracking-wide">Vendidos</span>
                        <span class="text-lg font-bold">{{ product.vendidos ?? '—' }}</span>
                    </div>
                    <div class="bg-gray-50 rounded-xl p-3 flex flex-col gap-1">
                        <span class="text-[0.65rem] text-gray-dark uppercase tracking-wide">Envío</span>
                        <span class="text-lg font-bold" :class="product.envio_gratis ? 'text-green-600' : ''">
                            {{ product.envio_gratis ? 'Gratis' : 'Pago' }}
                        </span>
                    </div>
                </div>

                <!-- Attributes -->
                <div v-if="attrs.length">
                    <h2 class="font-semibold mb-3 text-sm">Atributos</h2>
                    <div class="grid grid-cols-2 gap-2">
                        <div v-for="a in attrs" :key="a.nombre"
                            class="bg-gray-50 rounded-lg px-3 py-2 flex flex-col gap-0.5">
                            <span class="text-[0.6rem] text-gray-dark">{{ a.nombre }}</span>
                            <span class="text-xs font-medium">{{ a.valor }}</span>
                        </div>
                    </div>
                </div>

                <!-- Description -->
                <div v-if="product.descripcion">
                    <h2 class="font-semibold mb-2 text-sm">Descripción</h2>
                    <div class="relative">
                        <p class="text-xs text-dark whitespace-pre-wrap leading-relaxed bg-gray-50 rounded-xl p-4"
                            :class="descExpanded ? '' : 'line-clamp-5'">
                            {{ product.descripcion }}
                        </p>
                        <button @click="descExpanded = !descExpanded"
                            class="text-xs text-primary font-medium mt-1">
                            {{ descExpanded ? 'Ver menos' : 'Ver más' }}
                        </button>
                    </div>
                </div>

                <a v-if="product.permalink" :href="product.permalink" target="_blank" rel="noopener"
                    class="inline-flex items-center gap-2 bg-yellow-400 text-dark px-4 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-300">
                    <Icon name="tabler:external-link" class="w-4 h-4" />
                    Ver en MercadoLibre
                </a>
            </div>

            <!-- RIGHT: Costs + Profitability -->
            <div class="space-y-5">
                <!-- Cost form -->
                <div class="bg-white rounded-xl border border-gray-light p-5">
                    <h2 class="font-semibold mb-4">Costos</h2>
                    <div class="space-y-3">
                        <div>
                            <label class="text-xs text-gray-dark mb-1 block">Costo unitario (ARS)</label>
                            <input v-model.number="costForm.costo" type="number" min="0"
                                class="w-full border border-gray-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                        </div>
                        <div>
                            <label class="text-xs text-gray-dark mb-1 block">Otros costos (ARS)</label>
                            <input v-model.number="costForm.otros_costos" type="number" min="0"
                                class="w-full border border-gray-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                        </div>
                        <div>
                            <label class="text-xs text-gray-dark mb-1 block">Notas</label>
                            <input v-model="costForm.notas" type="text"
                                class="w-full border border-gray-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                        </div>
                        <button @click="saveCost" :disabled="savingCost"
                            class="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-60 flex items-center gap-2">
                            <Icon v-if="savingCost" name="tabler:loader-2" class="w-4 h-4 animate-spin" />
                            Guardar costos
                        </button>
                    </div>
                </div>

                <!-- Profitability -->
                <div class="bg-white rounded-xl border border-gray-light p-5">
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="font-semibold">Rentabilidad</h2>
                        <button @click="loadProfit" class="text-xs text-primary hover:underline flex items-center gap-1">
                            <Icon name="tabler:refresh" class="w-3.5 h-3.5" />
                            Actualizar
                        </button>
                    </div>
                    <div v-if="loadingProfit" class="space-y-2">
                        <div v-for="i in 6" :key="i" class="h-6 rounded bg-gray-light animate-pulse" />
                    </div>
                    <div v-else-if="profit" class="space-y-2 text-sm">
                        <!-- Desglose -->
                        <div class="flex justify-between py-1 border-b border-gray-light">
                            <span class="text-gray-dark">Ingresos brutos</span>
                            <span class="font-medium">{{ fmtCurrency(profit.ingresos_brutos) }}</span>
                        </div>
                        <div class="flex justify-between py-1 border-b border-gray-light">
                            <span class="text-gray-dark">− Costo producto</span>
                            <span class="text-red-600">{{ fmtCurrency(profit.costo_producto) }}</span>
                        </div>
                        <div class="flex justify-between py-1 border-b border-gray-light">
                            <span class="text-gray-dark">− Comisión ML</span>
                            <span class="text-red-600">{{ fmtCurrency(profit.comision_ml) }}</span>
                        </div>
                        <div class="flex justify-between py-1 border-b border-gray-light">
                            <span class="text-gray-dark">− Envío</span>
                            <span class="text-red-600">{{ fmtCurrency(profit.costo_envio) }}</span>
                        </div>
                        <div class="flex justify-between py-1 border-b border-gray-light">
                            <span class="text-gray-dark">− Pauta</span>
                            <span class="text-red-600">{{ fmtCurrency(profit.gasto_publicidad) }}</span>
                        </div>
                        <div class="flex justify-between py-2 font-bold text-base">
                            <span>= Ganancia neta</span>
                            <span :class="(profit.ganancia_neta ?? 0) > 0 ? 'text-green-600' : 'text-red-600'">
                                {{ fmtCurrency(profit.ganancia_neta) }}
                            </span>
                        </div>
                        <div class="grid grid-cols-3 gap-3 mt-2 pt-2 border-t border-gray-light">
                            <div class="text-center">
                                <div class="text-xs text-gray-dark">Margen</div>
                                <div class="font-semibold text-sm" :class="marginColor(profit.margen_porcentaje)">
                                    {{ fmtPercent(profit.margen_porcentaje) }}
                                </div>
                            </div>
                            <div class="text-center">
                                <div class="text-xs text-gray-dark">ROAS</div>
                                <div class="font-semibold text-sm">{{ profit.roas != null ? fmtMult(profit.roas) : '—' }}</div>
                            </div>
                            <div class="text-center">
                                <div class="text-xs text-gray-dark">ACoS</div>
                                <div class="font-semibold text-sm">{{ profit.acos != null ? fmtPercent(profit.acos) : '—' }}</div>
                            </div>
                        </div>
                    </div>
                    <p v-else class="text-sm text-gray-dark">Sin datos de rentabilidad aún</p>
                </div>

                <!-- Fees -->
                <div class="bg-white rounded-xl border border-gray-light p-5">
                    <div class="flex items-center justify-between mb-3">
                        <h2 class="font-semibold">Comisión ML estimada</h2>
                        <button @click="loadFees" :disabled="loadingFees"
                            class="text-xs text-primary hover:underline flex items-center gap-1 disabled:opacity-50">
                            <Icon v-if="loadingFees" name="tabler:loader-2" class="w-3.5 h-3.5 animate-spin" />
                            <Icon v-else name="tabler:search" class="w-3.5 h-3.5" />
                            Consultar comisión
                        </button>
                    </div>
                    <div v-if="fees" class="space-y-1.5 text-sm">
                        <div v-for="(val, key) in fees" :key="key" class="flex justify-between">
                            <span class="text-gray-dark capitalize">{{ key.replace(/_/g, ' ') }}</span>
                            <span class="font-medium">{{ typeof val === 'number' ? fmtCurrency(val) : val }}</span>
                        </div>
                    </div>
                    <p v-else class="text-xs text-gray-dark">Hacé click en "Consultar comisión" para ver el desglose</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { formatCurrency as fmtCurrency, formatPercent as fmtPercent, formatMultiplier as fmtMult, marginColor, marginBadgeClass as marginBadge } from '~/utils/format'

const route = useRoute()
const mlId = route.params.mlId
const { get, post } = useApi()
const notification = useNotification()

const product = ref(null)
const profit = ref(null)
const fees = ref(null)
const loading = ref(true)
const loadingProfit = ref(false)
const loadingFees = ref(false)
const savingCost = ref(false)
const descExpanded = ref(false)

const costForm = reactive({ costo: 0, otros_costos: 0, notas: '' })

const images = computed(() => product.value?.imagenes ?? [])
const attrs = computed(() =>
    (product.value?.atributos ?? []).filter(a => a.valor != null && a.valor !== '')
)

function estadoBadge(e) {
    if (e === 'active') return 'success'
    if (e === 'paused') return 'gray'
    if (e === 'closed') return 'danger'
    return 'default'
}

async function loadProduct() {
    loading.value = true
    try {
        product.value = await get(`/api/sync-id-products/${mlId}`)
    } catch (e) {
        // handled
    } finally {
        loading.value = false
    }
}

async function loadCost() {
    try {
        const costs = await get('/api/costs')
        const c = Array.isArray(costs) ? costs.find(c => c.ml_id == mlId) : null
        if (c) {
            costForm.costo = c.costo ?? 0
            costForm.otros_costos = c.otros_costos ?? 0
            costForm.notas = c.notas ?? ''
        }
    } catch (e) {}
}

async function loadProfit() {
    loadingProfit.value = true
    try {
        profit.value = await get(`/api/profitability/${mlId}`)
    } catch (e) {
    } finally {
        loadingProfit.value = false
    }
}

async function saveCost() {
    savingCost.value = true
    try {
        await post(`/api/costs/${mlId}`, costForm)
        notification.success('Costos guardados')
        await loadProfit()
    } catch (e) {
    } finally {
        savingCost.value = false
    }
}

async function loadFees() {
    loadingFees.value = true
    try {
        fees.value = await get(`/api/profitability/fees/${mlId}`)
    } catch (e) {
    } finally {
        loadingFees.value = false
    }
}

onMounted(async () => {
    await loadProduct()
    await Promise.all([loadCost(), loadProfit()])
})
</script>
