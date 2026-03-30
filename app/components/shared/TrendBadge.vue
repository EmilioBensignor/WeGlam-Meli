<template>
  <span class="w-max flex items-center font-semibold rounded " :class="[colorClass, sizeClass]">
    <span class="sr-only">{{ isPositive ? 'Tendencia positiva' : isNegative ? 'Tendencia negativa' : 'Sin cambios'
      }}:</span>
    <Icon :name="iconName" class="shrink-0" :class="size === 'sm' ? 'size-4' : 'size-4.5'" aria-hidden="true" />
    {{ formattedValue }}
  </span>
</template>

<script setup>
const props = defineProps({
  value: { type: Number, required: true },
  size: { type: String, default: 'md' },
})

const isPositive = computed(() => props.value > 0)
const isNegative = computed(() => props.value < 0)


const colorClass = computed(() => {
  if (isPositive.value) return 'text-green-600 bg-green-200 dark:text-green-400 dark:bg-green-400/15'
  if (isNegative.value) return 'text-red-600 bg-red-200 dark:text-red-400 dark:bg-red-400/15'
  return 'text-on-surface-variant bg-surface-highest'
})

const iconName = computed(() => {
  if (isPositive.value) return 'i-tabler-trending-up'
  if (isNegative.value) return 'i-tabler-trending-down'
  return 'i-tabler-minus'
})

const formattedValue = computed(() => {
  const prefix = isPositive.value ? '+' : ''
  return `${prefix}${props.value}%`
})

const sizeClass = computed(() => {
  return props.size === 'sm' ? 'text-[10px] px-1.5 py-0.5 gap-0.5' : 'text-sm px-2 py-0.5 gap-1'
})
</script>