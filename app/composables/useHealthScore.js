export function useHealthScore(publication) {
  const criteria = computed(() => {
    const pub = toValue(publication)
    if (!pub) return []

    return [
      {
        nombre: 'Título',
        icon: 'i-tabler-typography',
        score: calculateTitleScore(pub),
        maxScore: 10,
      },
      {
        nombre: 'Fotos',
        icon: 'i-tabler-photo',
        score: calculatePhotosScore(pub),
        maxScore: 10,
      },
      {
        nombre: 'Descripción',
        icon: 'i-tabler-file-text',
        score: calculateDescriptionScore(pub),
        maxScore: 10,
      },
      {
        nombre: 'Precio competitivo',
        icon: 'i-tabler-currency-dollar',
        score: calculatePriceScore(pub),
        maxScore: 10,
      },
      {
        nombre: 'Ficha técnica',
        icon: 'i-tabler-list-check',
        score: calculateFichaTecnicaScore(pub),
        maxScore: 10,
      },
    ]
  })

  const totalScore = computed(() => {
    const items = criteria.value
    if (!items.length) return 0
    const sum = items.reduce((acc, c) => acc + c.score, 0)
    const max = items.reduce((acc, c) => acc + c.maxScore, 0)
    return Math.round((sum / max) * 100)
  })

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

function calculateTitleScore(pub) {
  if (!pub.titulo) return 0
  const len = pub.titulo.length
  if (len >= 50 && len <= 120) return 10
  if (len >= 30) return 7
  if (len >= 15) return 5
  return 3
}

function calculatePhotosScore(pub) {
  if (pub.healthScore >= 80) return 8
  if (pub.healthScore >= 60) return 6
  return 4
}

function calculateDescriptionScore(pub) {
  if (pub.healthScore >= 85) return 9
  if (pub.healthScore >= 70) return 7
  if (pub.healthScore >= 50) return 5
  return 3
}

function calculatePriceScore(pub) {
  if (pub.precioOriginal && pub.precioOriginal > pub.precio) return 9
  if (pub.healthScore >= 70) return 7
  return 5
}

function calculateFichaTecnicaScore(pub) {
  if (pub.healthScore >= 80) return 8
  if (pub.healthScore >= 60) return 6
  return 4
}
