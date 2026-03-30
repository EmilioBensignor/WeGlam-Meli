<template>
    <NuxtLink v-if="to" :to="to"
        class="h-12 flex justify-center items-center bg-primary-400 rounded-[0.625rem] shadow-md shadow-black/20 dark:shadow-primary-400/20 text-black lg:text-xl font-medium transition duration-300 py-3 px-12">
        <slot />
    </NuxtLink>
    <button v-else :type="type || 'button'"
        class="h-12 flex justify-center items-center bg-primary-400 rounded-[0.625rem] shadow-md shadow-black/20 dark:shadow-primary-400/20 text-black lg:text-xl font-medium transition duration-300 py-3 px-12">
        <slot />
    </button>
</template>

<script setup>
defineProps({
    to: {
        type: [String, Object],
        default: null
    },
    type: {
        type: String,
        default: 'button'
    }
})
</script>
