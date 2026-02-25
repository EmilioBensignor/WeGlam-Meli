<template>
    <div class="w-full max-w-md">
        <div class="flex flex-col gap-2">
            <FormLabel>{{ label }}</FormLabel>
            <div class="relative">
                <FormTextField
                    :id="id"
                    :modelValue="searchQuery"
                    @update:modelValue="handleInput"
                    type="text"
                    :placeholder="placeholder"
                />
                <div class="flex items-center absolute top-1/2 right-0 transform -translate-y-1/2 pr-3">
                    <Icon name="tabler:search" class="w-5 h-5 text-gray-dark" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    label: {
        type: String,
        default: 'Buscar'
    },
    placeholder: {
        type: String,
        default: 'Buscar...'
    },
    id: {
        type: String,
        default: 'search'
    }
})

const emit = defineEmits(['update:modelValue'])

const searchQuery = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})

const handleInput = (value) => {
    emit('update:modelValue', value)
}
</script>