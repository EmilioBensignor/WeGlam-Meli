export function useChartTheme() {
  const colorMode = useColorMode()

  const chartColors = computed(() => {
    const isDark = colorMode.value === 'dark'
    return {
      tooltipBg: isDark ? '#0C0E14' : '#FFFFFF',
      tooltipTitle: isDark ? '#E2E2EA' : '#1A1C22',
      tooltipBody: isDark ? '#BEC8CD' : '#5A6370',
      tooltipBorder: isDark ? '#3F484C' : '#C8CDD3',
      gridColor: isDark ? 'rgba(226, 226, 234, 0.05)' : 'rgba(26, 28, 34, 0.08)',
      tickColor: isDark ? '#889297' : '#8B9199',
      pointHoverBorder: isDark ? '#0C0E14' : '#FFFFFF',
      barMuted: isDark ? 'rgba(63, 72, 76, 0.4)' : 'rgba(26, 28, 34, 0.12)',
      barDark: isDark ? 'rgba(51, 53, 59, 0.8)' : 'rgba(26, 28, 34, 0.2)',
      barAccentMuted: isDark ? 'rgba(108, 195, 224, 0.4)' : 'rgba(108, 195, 224, 0.5)',
      gradientStart: isDark ? 'rgba(108, 195, 224, 0.2)' : 'rgba(108, 195, 224, 0.3)',
      gradientEnd: 'rgba(108, 195, 224, 0)',
    }
  })

  return { colorMode, chartColors }
}
