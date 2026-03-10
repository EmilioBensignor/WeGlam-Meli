export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const mlId = getRouterParam(event, 'mlId')
    const res = await fetch(`${config.backendUrl}/profitability/${mlId}`, { headers: { 'x-api-key': config.apiKey } })
    if (!res.ok) throw createError({ statusCode: res.status, message: 'Error al obtener rentabilidad del producto' })
    return res.json()
})
