export default defineEventHandler(async (event) => {
  const mlaId = getRouterParam(event, 'mlaId')
  const config = useRuntimeConfig()

  const response = await fetch(`${config.backendUrl}/publications/${mlaId}/sync`, {
    method: 'POST',
    headers: { 'x-api-key': config.apiKey },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw createError({
      statusCode: response.status,
      statusMessage: data.error || 'Error al sincronizar la publicación',
      data,
    })
  }

  return data
})
