export const HEALTH_THRESHOLDS = {
  GOOD: 70,
  WARNING: 40,
}

export function getHealthColor(score, prefix = 'text') {
  if (score >= HEALTH_THRESHOLDS.GOOD) return `${prefix}-green-600 dark:${prefix}-green-400`
  if (score >= HEALTH_THRESHOLDS.WARNING) return `${prefix}-yellow-600 dark:${prefix}-yellow-400`
  return `${prefix}-red-600 dark:${prefix}-red-400`
}

export function getHealthBgColor(score) {
  if (score >= HEALTH_THRESHOLDS.GOOD) return 'bg-green-400'
  if (score >= HEALTH_THRESHOLDS.WARNING) return 'bg-yellow-400'
  return 'bg-red-400'
}
