export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const res = await fetch(`${config.backendUrl}/sync-orders`, {
        method: 'POST',
        headers: { 'x-api-key': config.apiKey },
    })
    if (!res.ok) throw createError({ statusCode: res.status, message: 'Error al sincronizar órdenes' })
    return res.json()
})
