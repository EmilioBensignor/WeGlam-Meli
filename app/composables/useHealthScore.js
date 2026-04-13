export function useHealthScore(publication, metrics) {
  const criteria = computed(() => {
    const detalle = toValue(metrics)?.healthScoreDetalle
    if (!detalle) return []

    return [
      { nombre: 'Fotos', icon: 'i-tabler-photo', score: detalle.fotos ?? 0, maxScore: 10 },
      { nombre: 'Descripción', icon: 'i-tabler-file-text', score: detalle.descripcion ?? 0, maxScore: 10 },
      { nombre: 'Envío', icon: 'i-tabler-truck', score: detalle.envio ?? 0, maxScore: 10 },
      { nombre: 'Ficha técnica', icon: 'i-tabler-list-check', score: detalle.ficha ?? 0, maxScore: 10 },
      { nombre: 'Tipo de publicación', icon: 'i-tabler-tag', score: detalle.listingType ?? 0, maxScore: 10 },
    ]
  })

  const totalScore = computed(() => toValue(metrics)?.healthScore ?? 0)

  const label = computed(() => {
    const s = totalScore.value
    if (s >= 80) return 'Saludable'
    if (s >= 60) return 'Aceptable'
    if (s >= 40) return 'Mejorable'
    return 'Crítico'
  })

  return {
    criteria,
    totalScore,
    label,
  }
}
