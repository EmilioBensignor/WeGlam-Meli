export const formatCurrency = (value) => {
    if (value == null) return '—'
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value)
}

export const formatPercent = (value, decimals = 1) => {
    if (value == null) return '—'
    return `${Number(value).toFixed(decimals).replace('.', ',')}%`
}

export const formatMultiplier = (value) => {
    if (value == null) return '—'
    return `${Number(value).toFixed(1)}x`
}

export const formatNumber = (value) => {
    if (value == null) return '—'
    return new Intl.NumberFormat('es-AR').format(value)
}

export const formatDate = (value) => {
    if (!value) return '—'
    return new Date(value).toLocaleDateString('es-AR')
}

export const formatRelativeDate = (value) => {
    if (!value) return '—'
    const days = Math.floor((Date.now() - new Date(value)) / 86400000)
    if (days === 0) return 'hoy'
    if (days === 1) return 'hace 1 día'
    return `hace ${days} días`
}

export const formatMonthLabel = (value) => {
    if (!value) return ''
    const [year, month] = value.split('-')
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    return `${months[parseInt(month) - 1]} ${year.slice(2)}`
}

export const marginColor = (value) => {
    if (value == null) return 'text-gray-dark'
    if (value > 30) return 'text-green-700'
    if (value > 15) return 'text-green-500'
    if (value > 5) return 'text-yellow-600'
    if (value >= 0) return 'text-orange-500'
    return 'text-red-600'
}

export const marginBadgeClass = (value) => {
    if (value == null) return 'bg-gray-light text-gray-dark'
    if (value > 30) return 'bg-green-100 text-green-800'
    if (value > 15) return 'bg-green-50 text-green-700'
    if (value > 5) return 'bg-yellow-50 text-yellow-700'
    if (value >= 0) return 'bg-orange-50 text-orange-700'
    return 'bg-red-50 text-red-700'
}
