export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const res = await fetch(`${config.backendUrl}/profitability`, { headers: { 'x-api-key': config.apiKey } })
    if (!res.ok) throw createError({ statusCode: res.status, message: 'Error al obtener rentabilidad' })
    return res.json()
})
