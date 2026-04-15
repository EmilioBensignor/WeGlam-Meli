<template>
  <UDashboardSidebar collapsible resizable :min-size="10" :max-size="10" :default-size="10" :ui="{
    root: 'bg-surface-low dark:bg-surface-lowest',
    header: 'p-4 lg:p-6',
    body: 'p-3',
    footer: 'py-4 px-3',
  }">
    <template #header="{ collapsed }">
      <NuxtLink v-if="!collapsed" :to="ROUTE_NAMES.HOME" class="">
        <NuxtImg src="/images/Logo-We-Glam-Negro.svg" alt="We Glam" class="h-8 dark:hidden object-contain" />
        <NuxtImg src="/images/Logo-We-Glam-Blanco.svg" alt="We Glam" class="h-8 hidden dark:block object-contain" />
      </NuxtLink>
    </template>

    <template #default="{ collapsed }">
      <UNavigationMenu :collapsed="collapsed" :items="navItems" orientation="vertical" color="primary" variant="pill"
        :highlight="false" :ui="{
          list: 'space-y-1 p-0',
          link: collapsed
            ? 'w-10 h-10 justify-center text-on-surface hover:before:bg-transparent! data-[active]:before:bg-primary-400! data-[active]:text-primary-950! py-2! px-2.5! '
            : 'gap-2 text-base text-on-surface hover:before:bg-transparent! data-[active]:before:bg-primary-400! data-[active]:text-primary-950! py-2',
          linkLeadingIcon: 'size-5! text-inherit!',
        }" />
    </template>

    <template #footer="{ collapsed }">
      <UButton :label="collapsed ? undefined : 'Cerrar Sesión'" icon="i-tabler-logout" color="error" variant="ghost"
        class="w-full justify-start hover:bg-red-500/15! transition-colors duration-300 py-2 px-2.5" :block="!collapsed"
        :square="collapsed" aria-label="Cerrar Sesión" @click="handleLogout" />
    </template>
  </UDashboardSidebar>
</template>

<script setup>
import { ROUTE_NAMES } from '~/constants/ROUTE_NAMES'

const supabase = useSupabaseClient()

const navItems = [
  {
    label: 'Dashboard',
    icon: 'i-tabler-layout-dashboard',
    to: ROUTE_NAMES.HOME,
  },
  {
    label: 'Productos',
    icon: 'i-tabler-package',
    to: ROUTE_NAMES.PRODUCTOS,
  },
]

async function handleLogout() {
  await supabase.auth.signOut()
  navigateTo(ROUTE_NAMES.LOGIN)
}
</script>