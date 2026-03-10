<template>
    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" :class="colorClass">
        {{ text }}
    </span>
</template>

<script setup>
const props = defineProps({
    text: { type: String, required: true },
    variant: { type: String, default: 'default' },
    // variants: default, success, warning, danger, info, gray
})

const variantMap = {
    default: 'bg-gray-light text-dark',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-50 text-yellow-800',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
    gray: 'bg-gray-100 text-gray-600',
    orange: 'bg-orange-50 text-orange-700',
}

const colorClass = computed(() => variantMap[props.variant] ?? variantMap.default)
</script>
