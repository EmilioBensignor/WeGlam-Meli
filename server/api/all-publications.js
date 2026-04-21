export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const response = await fetch(`${config.backendUrl}/all-publications`, {
    method: 'GET',
    headers: {
      'x-api-key': config.apiKey,
    },
  })

  if (!response.ok) {
    throw createError({ statusCode: response.status, message: 'Error al obtener todas las publicaciones del backend' })
  }

  return response.json()
})
