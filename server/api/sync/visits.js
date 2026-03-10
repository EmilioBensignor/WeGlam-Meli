export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const res = await fetch(`${config.backendUrl}/sync-visits`, {
        method: 'POST',
        headers: { 'x-api-key': config.apiKey },
    })
    if (!res.ok) throw createError({ statusCode: res.status, message: 'Error al sincronizar visitas' })
    return res.json()
})
