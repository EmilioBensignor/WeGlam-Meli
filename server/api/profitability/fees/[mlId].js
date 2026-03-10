export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const mlId = getRouterParam(event, 'mlId')
    const res = await fetch(`${config.backendUrl}/profitability/fees/${mlId}`, { headers: { 'x-api-key': config.apiKey } })
    if (!res.ok) throw createError({ statusCode: res.status, message: 'Error al obtener comisiones' })
    return res.json()
})
