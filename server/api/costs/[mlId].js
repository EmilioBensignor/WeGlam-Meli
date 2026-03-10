export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const mlId = getRouterParam(event, 'mlId')
    const method = getMethod(event)

    if (method === 'DELETE') {
        const res = await fetch(`${config.backendUrl}/costs/${mlId}`, {
            method: 'DELETE',
            headers: { 'x-api-key': config.apiKey },
        })
        if (!res.ok) throw createError({ statusCode: res.status, message: 'Error al eliminar costo' })
        return res.json()
    }

    const body = await readBody(event)
    const res = await fetch(`${config.backendUrl}/costs/${mlId}`, {
        method: 'POST',
        headers: { 'x-api-key': config.apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    })
    if (!res.ok) throw createError({ statusCode: res.status, message: 'Error al guardar costo' })
    return res.json()
})
