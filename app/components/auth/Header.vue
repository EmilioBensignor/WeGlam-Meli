<template>
  <header class="flex justify-center items-center relative bg-primary-400 dark:bg-surface-lowest p-6">
    <NuxtLink :to="ROUTE_NAMES.LOGIN">
      <NuxtImg src="/images/Logo-Motix-Negro.svg" alt="Logo Motix" class="h-8 lg:h-12 dark:hidden" />
      <NuxtImg src="/images/Logo-Motix-Blanco.svg" alt="Logo Motix" class="h-8 lg:h-12 hidden dark:block" />
    </NuxtLink>
    <UColorModeButton color="neutral" variant="ghost" class="absolute right-6 hover:bg-transparent!" />
  </header>
</template>

<script setup>
import { ROUTE_NAMES } from '~/constants/ROUTE_NAMES'
</script>