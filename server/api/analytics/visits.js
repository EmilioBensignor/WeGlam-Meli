export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const query = getQuery(event)
    const qs = new URLSearchParams(query).toString()
    const url = `${config.backendUrl}/analytics/visits${qs ? '?' + qs : ''}`
    const res = await fetch(url, { headers: { 'x-api-key': config.apiKey } })
    if (!res.ok) throw createError({ statusCode: res.status, message: 'Error al obtener visitas' })
    return res.json()
})
