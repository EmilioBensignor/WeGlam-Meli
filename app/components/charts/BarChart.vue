<template>
    <div class="w-full h-full flex flex-col">
        <!-- Bars -->
        <div class="flex-1 flex items-end gap-2 min-h-0">
            <div
                v-for="(item, i) in data"
                :key="i"
                class="flex-1 flex flex-col items-center justify-end gap-1 group relative"
            >
                <!-- Tooltip -->
                <div class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-dark text-white text-xs rounded px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    <slot name="tooltip" :item="item">
                        {{ item.label }}: {{ item.value }}
                    </slot>
                </div>
                <div
                    class="w-full rounded-t transition-all duration-500"
                    :class="barColor"
                    :style="{ height: barHeight(item.value) }"
                />
            </div>
        </div>

        <!-- X labels -->
        <div class="flex gap-2 mt-2">
            <div
                v-for="(item, i) in data"
                :key="i"
                class="flex-1 text-center text-[0.65rem] text-gray-dark truncate"
            >
                {{ item.label }}
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    data: { type: Array, default: () => [] },
    barColor: { type: String, default: 'bg-primary' },
    maxHeight: { type: String, default: '100%' },
})

const maxValue = computed(() => Math.max(...props.data.map(d => d.value || 0), 1))

const barHeight = (value) => {
    const pct = ((value || 0) / maxValue.value) * 100
    return `${pct}%`
}
</script>
