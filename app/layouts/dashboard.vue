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
