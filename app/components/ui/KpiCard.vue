<template>
    <div class="bg-white rounded-xl border border-gray-light p-5 flex flex-col gap-1">
        <span class="text-xs font-medium text-gray-dark uppercase tracking-wide">{{ label }}</span>
        <span class="text-2xl font-bold mt-1" :class="valueClass">{{ value }}</span>
        <span v-if="sub" class="text-xs text-gray-dark">{{ sub }}</span>
    </div>
</template>

<script setup>
const props = defineProps({
    label: { type: String, required: true },
    value: { type: [String, Number], default: '—' },
    sub: { type: String, default: null },
    color: { type: String, default: 'default' },
})

const valueClass = computed(() => {
    if (props.color === 'positive') return 'text-green-600'
    if (props.color === 'negative') return 'text-red-600'
    return 'text-dark'
})
</script>
