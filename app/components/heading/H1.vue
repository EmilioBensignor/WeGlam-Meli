<script setup>
const props = defineProps({
  level: {
    type: Number,
    default: 1,
    validator: (v) => [1, 2].includes(v)
  }
})

const tag = computed(() => `h${props.level}`)

const classes = computed(() => {
  const base = 'font-bold text-on-surface'
  if (props.level === 1) return `${base} text-4xl font-bold`
  return `${base} text-xl`
})
</script>

<template>
  <component :is="tag" :class="classes"><slot /></component>
</template>
