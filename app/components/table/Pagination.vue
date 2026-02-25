<template>
    <div class="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-2">
            <FormLabel class="mb-1">Items por página:</FormLabel>
            <select :value="itemsPerPage" @change="handleItemsPerPageChange"
                class="border border-gray-dark rounded-lg outline-none px-3 py-1">
                <option v-for="option in itemsPerPageOptions" :key="option" :value="option">
                    {{ option }}
                </option>
            </select>
        </div>

        <div class="flex items-center gap-2">
            <span class="text-sm lg:text-base text-gray-dark">
                Mostrando {{ startItem }} - {{ endItem }} de {{ totalItems }}
            </span>
        </div>

        <div class="flex items-center gap-2">
            <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"
                class="border border-gray-dark rounded-lg disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1">
                Anterior
            </button>

            <div class="flex gap-1">
                <button v-for="page in displayPages" :key="page" @click="page !== '...' && goToPage(page)" :class="[
                    'border border-gray-dark rounded-lg px-3 py-1',
                    page === currentPage ? 'bg-primary text-white' : '',
                    page === '...' ? 'cursor-default' : ''
                ]" :disabled="page === '...'">
                    {{ page }}
                </button>
            </div>

            <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages"
                class="border border-gray-dark rounded-lg disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1">
                Siguiente
            </button>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    currentPage: {
        type: Number,
        required: true
    },
    totalItems: {
        type: Number,
        required: true
    },
    itemsPerPage: {
        type: Number,
        required: true
    },
    itemsPerPageOptions: {
        type: Array,
        default: () => [10, 25, 50, 100]
    }
})

const emit = defineEmits(['update:currentPage', 'update:itemsPerPage'])

const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage))

const startItem = computed(() => {
    if (props.totalItems === 0) return 0
    return (props.currentPage - 1) * props.itemsPerPage + 1
})

const endItem = computed(() => {
    const end = props.currentPage * props.itemsPerPage
    return end > props.totalItems ? props.totalItems : end
})

const displayPages = computed(() => {
    const pages = []
    const maxPagesToShow = 5

    if (totalPages.value <= maxPagesToShow) {
        for (let i = 1; i <= totalPages.value; i++) {
            pages.push(i)
        }
    } else {
        if (props.currentPage <= 3) {
            for (let i = 1; i <= 4; i++) {
                pages.push(i)
            }
            pages.push('...')
            pages.push(totalPages.value)
        } else if (props.currentPage >= totalPages.value - 2) {
            pages.push(1)
            pages.push('...')
            for (let i = totalPages.value - 3; i <= totalPages.value; i++) {
                pages.push(i)
            }
        } else {
            pages.push(1)
            pages.push('...')
            pages.push(props.currentPage - 1)
            pages.push(props.currentPage)
            pages.push(props.currentPage + 1)
            pages.push('...')
            pages.push(totalPages.value)
        }
    }

    return pages
})

const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        emit('update:currentPage', page)
    }
}

const handleItemsPerPageChange = (event) => {
    emit('update:itemsPerPage', parseInt(event.target.value))
    emit('update:currentPage', 1)
}
</script>
