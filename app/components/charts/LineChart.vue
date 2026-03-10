<template>
    <div class="w-full relative" :style="{ height: height + 'px' }">
        <svg v-if="points.length > 1" class="w-full h-full overflow-visible">
            <!-- Grid lines -->
            <line
                v-for="i in 4"
                :key="i"
                :x1="0"
                :y1="(i / 4) * svgHeight"
                :x2="'100%'"
                :y2="(i / 4) * svgHeight"
                stroke="#E8E9E9"
                stroke-width="1"
            />
            <!-- Area fill -->
            <path
                :d="areaPath"
                fill="rgba(59,130,246,0.08)"
            />
            <!-- Line -->
            <polyline
                :points="svgPoints"
                fill="none"
                stroke="#3B82F6"
                stroke-width="2"
                stroke-linejoin="round"
                stroke-linecap="round"
            />
            <!-- Dots -->
            <circle
                v-for="(pt, i) in points"
                :key="i"
                :cx="pt.x + '%'"
                :cy="pt.y + 'px'"
                r="3"
                fill="#3B82F6"
                class="group"
            >
                <title>{{ data[i]?.label }}: {{ data[i]?.value }}</title>
            </circle>
        </svg>

        <!-- Empty state -->
        <div v-else class="flex items-center justify-center h-full text-gray-dark text-sm">
            Sin datos suficientes
        </div>

        <!-- X labels -->
        <div class="flex justify-between mt-1">
            <span
                v-for="(item, i) in labeledData"
                :key="i"
                class="text-[0.6rem] text-gray-dark"
            >{{ item.label }}</span>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    data: { type: Array, default: () => [] }, // [{ label, value }]
    height: { type: Number, default: 160 },
})

const svgHeight = computed(() => props.height - 20)
const maxValue = computed(() => Math.max(...props.data.map(d => d.value || 0), 1))
const minValue = computed(() => Math.min(...props.data.map(d => d.value || 0), 0))

const points = computed(() => {
    if (props.data.length < 2) return []
    const range = maxValue.value - minValue.value || 1
    return props.data.map((item, i) => ({
        x: (i / (props.data.length - 1)) * 100,
        y: svgHeight.value - ((item.value - minValue.value) / range) * (svgHeight.value * 0.85) - svgHeight.value * 0.05,
    }))
})

const svgPoints = computed(() =>
    points.value.map(p => `${p.x}%,${p.y}px`).join(' ')
)

const areaPath = computed(() => {
    if (!points.value.length) return ''
    const pts = points.value.map(p => `${p.x}%,${p.y}px`).join(' L ')
    const last = points.value[points.value.length - 1]
    const first = points.value[0]
    return `M ${pts} L ${last.x}%,${svgHeight.value}px L ${first.x}%,${svgHeight.value}px Z`
})

// Show only ~5 labels
const labeledData = computed(() => {
    if (props.data.length <= 6) return props.data
    const step = Math.floor(props.data.length / 5)
    return props.data.filter((_, i) => i % step === 0 || i === props.data.length - 1)
})
</script>
