<template>
  <div class="flex flex-col justify-between gap-6 bg-surface-lowest rounded-xl border border-outline-variant/30 p-4">
    <div class="flex justify-between items-start">
      <span class="text-on-surface text-sm font-medium uppercase tracking-wider">
        {{ label }}
      </span>
      <span class="w-9 h-9 flex justify-center items-center rounded-lg" :class="iconBgMap[color || 'primary']">
        <Icon :name="icon" class="size-5" />
      </span>
    </div>

    <div class="flex flex-col gap-1.5">
      <HeadingH1 :level="2" class="text-3xl! font-sans">
        <template v-if="healthParts">
          <span :class="healthColorClass">{{ healthParts.score }}</span><span>{{ healthParts.rest }}</span>
        </template>
        <template v-else>{{ value }}</template>
      </HeadingH1>
      <SharedTrendBadge v-if="trend" :value="trend" size="base" />
    </div>

    <slot />
  </div>
</template>

<script setup>
import { getHealthColor } from '~/constants/HEALTH_THRESHOLDS.js'

const props = defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  trend: { type: Number, default: null },
  icon: { type: String, required: true },
  color: { type: String, default: 'primary' },
})

const iconBgMap = {
  primary: 'bg-primary-200 text-primary-600 dark:bg-primary-400/15 dark:text-primary-400',
  success: 'bg-green-200 text-green-600 dark:bg-green-400/15 dark:text-green-400',
  warning: 'bg-yellow-200 text-yellow-600 dark:bg-yellow-400/15 dark:text-yellow-400',
  error: 'bg-red-200 text-red-600 dark:bg-red-400/15 dark:text-red-400',
}

const healthParts = computed(() => {
  if (!props.label?.toLowerCase().includes('salud')) return null
  const match = String(props.value).match(/^(\d+)(.*)$/)
  if (!match) return null
  return { score: match[1], rest: match[2] }
})

const healthColorClass = computed(() => {
  if (!healthParts.value) return ''
  return getHealthColor(parseInt(healthParts.value.score, 10)) + '!'
})
</script>