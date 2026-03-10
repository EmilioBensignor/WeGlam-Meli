export const useApi = () => {
    const notification = useNotification()

    const apiFetch = async (url, options = {}) => {
        try {
            const res = await fetch(url, options)
            if (!res.ok) {
                const err = await res.json().catch(() => ({}))
                throw new Error(err.message || `Error ${res.status}`)
            }
            return await res.json()
        } catch (e) {
            notification.error(e.message || 'Error de conexión')
            throw e
        }
    }

    const get = (url, params = {}) => {
        const qs = new URLSearchParams(
            Object.fromEntries(Object.entries(params).filter(([, v]) => v != null && v !== ''))
        ).toString()
        return apiFetch(qs ? `${url}?${qs}` : url)
    }

    const post = (url, body = {}) =>
        apiFetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        })

    const del = (url) => apiFetch(url, { method: 'DELETE' })

    return { get, post, del, apiFetch }
}
