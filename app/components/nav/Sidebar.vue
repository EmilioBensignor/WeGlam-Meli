<template>
    <nav class="w-64 h-screen flex flex-col bg-secondary text-light flex-shrink-0 overflow-y-auto">
        <div class="p-5 border-b border-white/10">
            <span class="text-lg font-bold tracking-wide">WeGlam BI</span>
        </div>

        <div class="flex-1 p-3 space-y-0.5">
            <NuxtLink
                v-for="item in menu"
                :key="item.route"
                :to="item.route"
                :exact="item.exact"
                class="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 text-sm font-medium"
                :class="isActive(item) ? 'bg-white/20 text-white' : 'text-light/80 hover:bg-white/10 hover:text-white'"
            >
                <Icon :name="`tabler:${item.icon}`" class="w-[1.1rem] h-[1.1rem] flex-shrink-0" />
                <span>{{ item.title }}</span>
            </NuxtLink>
        </div>

        <div class="p-3 border-t border-white/10">
            <button
                @click="handleSignOut"
                :disabled="loggingOut"
                class="flex items-center gap-3 px-3 py-2.5 w-full text-sm font-medium text-light/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
            >
                <Icon v-if="!loggingOut" name="tabler:logout" class="w-[1.1rem] h-[1.1rem]" />
                <Icon v-else name="tabler:loader-2" class="w-[1.1rem] h-[1.1rem] animate-spin" />
                <span>{{ loggingOut ? 'Cerrando sesión...' : 'Cerrar sesión' }}</span>
            </button>
        </div>
    </nav>
</template>

<script setup>
import { ROUTE_NAMES } from '~/constants/ROUTE_NAMES'

const route = useRoute()
const router = useRouter()

const menu = [
    { title: 'Dashboard', icon: 'layout-dashboard', route: ROUTE_NAMES.HOME, exact: true },
    { title: 'Productos', icon: 'package', route: ROUTE_NAMES.PRODUCTS },
    { title: 'Rentabilidad', icon: 'trending-up', route: ROUTE_NAMES.PROFITABILITY },
    { title: 'Recomendaciones', icon: 'target', route: ROUTE_NAMES.RECOMMENDATIONS },
    { title: 'Publicidad', icon: 'speakerphone', route: ROUTE_NAMES.ADVERTISING },
    { title: 'Órdenes', icon: 'shopping-cart', route: ROUTE_NAMES.ORDERS },
    { title: 'Analytics', icon: 'chart-bar', route: ROUTE_NAMES.ANALYTICS },
    { title: 'Costos', icon: 'coin', route: ROUTE_NAMES.COSTS },
]

const isActive = (item) => {
    if (item.exact) return route.path === item.route
    return route.path.startsWith(item.route)
}

const loggingOut = ref(false)

async function handleSignOut() {
    if (loggingOut.value) return
    loggingOut.value = true
    try {
        const supabase = useSupabaseClient()
        await supabase.auth.signOut()
        localStorage.removeItem('lastLoginEmail')
        router.push(ROUTE_NAMES.LOGIN)
    } catch (e) {
        console.error('Error al cerrar sesión:', e.message)
    } finally {
        loggingOut.value = false
    }
}
</script>
