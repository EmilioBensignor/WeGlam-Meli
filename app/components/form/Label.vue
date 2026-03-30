<template>
    <label v-if="id" :for="id" class="text-on-surface font-light lg:text-xl">
        <slot />
        <span v-if="required" class="text-primary-400 ml-1">*</span>
    </label>
    <p v-else class="text-on-surface font-light lg:text-xl">
        <slot />
        <span v-if="required" class="text-primary-400 ml-1">*</span>
    </p>
</template>

<script setup>
defineProps({
    id: {
        type: String,
        required: false
    },
    required: {
        type: Boolean,
        default: false
    }
})
</script>
