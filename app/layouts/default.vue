<template>
    <div class="flex h-screen bg-gray-50 overflow-hidden">
        <!-- Desktop Sidebar -->
        <NavSidebar class="hidden lg:flex" />

        <!-- Main area -->
        <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
            <!-- Mobile top bar -->
            <header class="flex lg:hidden items-center justify-between bg-secondary px-4 py-3 flex-shrink-0">
                <button @click="drawerOpen = true" aria-label="Abrir menú">
                    <Icon name="tabler:menu-2" class="w-6 h-6 text-light" />
                </button>
                <span class="text-light font-bold text-base">WeGlam BI</span>
                <div class="w-6" />
            </header>

            <!-- Page content -->
            <main class="flex-1 overflow-auto">
                <slot />
            </main>
        </div>
    </div>

    <!-- Mobile Drawer -->
    <NavDrawer :is-open="drawerOpen" @close="drawerOpen = false" />

    <NotificationContainer />
</template>

<script setup>
const drawerOpen = ref(false)
</script>
