<template>
    <FormSelectField
        v-for="filter in filters"
        :key="filter.key"
        :modelValue="modelValue[filter.key] || null"
        @update:modelValue="handleChange(filter.key, $event)"
        :label="filter.label"
        :placeholder="filter.placeholder || `Todos los ${filter.label.toLowerCase()}`"
        :options="filter.options"
        :clearable="true"
        :allowEmpty="true"
        class="w-full max-w-md flex-shrink-0"
    />
</template>

<script setup>
const props = defineProps({
    filters: {
        type: Array,
        required: true,
    },
    modelValue: {
        type: Object,
        default: () => ({})
    }
})

const emit = defineEmits(['update:modelValue'])

const handleChange = (key, value) => {
    const newValue = { ...props.modelValue }
    if (value === null || value === '') {
        delete newValue[key]
    } else {
        newValue[key] = value
    }
    emit('update:modelValue', newValue)
}
</script>
