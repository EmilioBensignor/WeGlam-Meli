export function formatCurrency(value) {
  return `$${value.toLocaleString('es-AR')}`
}

export function formatNumber(val) {
  return val?.toLocaleString('es-AR') || '0'
}

export function formatRevenue(value) {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`
  return `$${value}`
}

export function upgradeMLImage(url) {
  if (!url) return ''
  return url.replace(/-[A-Z]\.jpg$/, '-O.jpg').replace(/-[A-Z]\.webp$/, '-O.webp')
}
