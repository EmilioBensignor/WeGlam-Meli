<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <HeadingH1 :level="2" class="flex items-center gap-2">
        <Icon name="i-tabler-chart-dots" class="text-green-600 dark:text-green-400" size="24" />
        Salud de la Publicación
      </HeadingH1>
      <span class="text-base font-bold rounded-full px-3 py-1"
        :class="score >= 70 ? 'bg-green-400/10 text-green-600 dark:text-green-400' : score >= 40 ? 'bg-yellow-400/10 text-yellow-600 dark:text-yellow-400' : 'bg-red-400/10 text-red-600 dark:text-red-400'">
        Score: {{ score }}/100
      </span>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
      <div class="flex flex-col gap-4">
        <div class="flex items-center justify-center">
          <div class="relative w-40 h-40 flex items-center justify-center">
            <svg class="w-full h-full transform -rotate-90" role="img" :aria-label="`Score de salud: ${score} de 100`">
              <circle class="text-surface-highest" cx="80" cy="80" r="70" fill="transparent" stroke="currentColor"
                stroke-width="8" />
              <circle class="text-green-400 transition-all duration-1000" cx="80" cy="80" r="70" fill="transparent"
                stroke="currentColor" stroke-width="8" :stroke-dasharray="circumference" :stroke-dashoffset="dashOffset"
                stroke-linecap="round" />
            </svg>
            <div class="flex flex-col items-center gap-1 absolute">
              <span class="text-4xl font-black text-on-surface">{{ score }}</span>
              <span class="text-base font-medium text-on-surface">
                {{ label }}
              </span>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-4">
          <div v-for="c in criteria" :key="c.nombre" class="flex flex-col gap-2">
            <div class="flex justify-between text-base text-on-surface">
              <span class="flex items-center gap-2">
                <Icon :name="c.icon" class="size-5" />
                {{ c.nombre }}
              </span>
              <span :class="scoreColor(c.score, c.maxScore)">{{ c.score }}/{{ c.maxScore }}</span>
            </div>
            <div class="h-1 bg-surface-lowest rounded-full overflow-hidden">
              <div class="h-full rounded-full transition-all duration-700" :class="barColor(c.score, c.maxScore)"
                :style="{ width: barWidth(c.score, c.maxScore) }" />
            </div>
          </div>
        </div>
      </div>
      <slot />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  score: { type: Number, required: true },
  label: { type: String, required: true },
  criteria: { type: Array, required: true },
})

const radius = 70
const circumference = 2 * Math.PI * radius
const dashOffset = computed(() => {
  const progress = props.score / 100
  return circumference - (circumference * progress)
})

import { getHealthColor, getHealthBgColor } from '~/constants/HEALTH_THRESHOLDS.js'

function scoreColor(score, max) {
  const pct = (score / max) * 100
  return getHealthColor(pct)
}

function barColor(score, max) {
  const pct = (score / max) * 100
  return getHealthBgColor(pct)
}

function barWidth(score, max) {
  return `${(score / max) * 100}%`
}
</script>