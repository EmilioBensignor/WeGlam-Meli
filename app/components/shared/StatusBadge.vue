<template>
  <span class="w-max flex items-center text-base font-semibold rounded border px-2.5 py-0.5" :class="config.color">
    {{ config.label }}
  </span>
</template>

<script setup>
const props = defineProps({
  status: { type: String, required: true },
})

const config = computed(() => {
  const s = props.status.toLowerCase()
  switch (s) {
    case 'active':
    case 'activa':
    case 'alta demanda':
      return { color: 'text-primary-600 bg-primary-200 border-primary-300 dark:text-primary-400 dark:bg-primary-400/10 dark:border-primary-400/20', label: props.status }
    case 'paused':
    case 'pausada':
      return { color: 'text-yellow-600 bg-yellow-200 border-yellow-300 dark:text-yellow-400 dark:bg-yellow-400/10 dark:border-yellow-400/20', label: props.status }
    case 'closed':
    case 'cerrada':
    case 'inactiva':
    case 'crítico':
      return { color: 'text-red-600 bg-red-200 border-red-300 dark:text-red-400 dark:bg-red-400/10 dark:border-red-400/20', label: props.status }
    case 'bajo rendimiento':
      return { color: 'text-yellow-600 bg-yellow-200 border-yellow-300 dark:text-yellow-400 dark:bg-yellow-400/10 dark:border-yellow-400/20', label: props.status }
    case 'sin stock':
      return { color: 'text-red-600 bg-red-200 border-red-300 dark:text-red-400 dark:bg-red-400/10 dark:border-red-400/20', label: props.status }
    default:
      return { color: 'text-on-surface-variant bg-surface-highest/50 border-outline-variant/20', label: props.status }
  }
})
</script>