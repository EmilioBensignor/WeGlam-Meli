export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const res = await fetch(`${config.backendUrl}/analytics/conversion`, { headers: { 'x-api-key': config.apiKey } })
    if (!res.ok) throw createError({ statusCode: res.status, message: 'Error al obtener conversiones' })
    return res.json()
})
