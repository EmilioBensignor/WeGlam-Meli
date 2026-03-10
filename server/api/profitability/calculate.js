export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const body = await readBody(event)
    const res = await fetch(`${config.backendUrl}/profitability/calculate`, {
        method: 'POST',
        headers: { 'x-api-key': config.apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    })
    if (!res.ok) throw createError({ statusCode: res.status, message: 'Error al calcular rentabilidad' })
    return res.json()
})
