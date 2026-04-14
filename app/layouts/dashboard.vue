<template>
  <UDashboardGroup>
    <DashboardSidebar />

    <UDashboardPanel :ui="{ body: 'bg-surface-base' }" class="bg-surface-base">
      <template #header>
        <UDashboardNavbar>
          <template #leading>
            <UDashboardSidebarCollapse color="neutral" variant="ghost" class="text-on-surface" />
          </template>

          <template #right>
            <UTooltip text="Sincronizar productos y métricas">
              <UButton
                color="neutral"
                variant="ghost"
                :icon="syncing ? 'i-tabler-loader-2' : 'i-tabler-refresh'"
                :class="['text-on-surface', syncing && 'animate-spin']"
                :disabled="syncing"
                @click="runSync"
              />
            </UTooltip>
            <UColorModeButton color="neutral" variant="ghost" class="text-on-surface" />
          </template>
        </UDashboardNavbar>
      </template>

      <template #body>
        <slot />
      </template>
    </UDashboardPanel>
  </UDashboardGroup>
</template>

<script setup>
const { syncing, runSync } = useSync()
</script>
