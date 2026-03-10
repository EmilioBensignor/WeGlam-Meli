export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const res = await fetch(`${config.backendUrl}/sync-advertising`, {
        method: 'POST',
        headers: { 'x-api-key': config.apiKey },
    })
    if (!res.ok) throw createError({ statusCode: res.status, message: 'Error al sincronizar publicidad' })
    return res.json()
})
