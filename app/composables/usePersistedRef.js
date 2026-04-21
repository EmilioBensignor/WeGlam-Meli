export function usePersistedRef(key, defaultValue) {
  const data = ref(defaultValue)

  if (import.meta.client) {
    try {
      const stored = localStorage.getItem(key)
      if (stored) {
        data.value = JSON.parse(stored)
      }
    } catch (e) {
      localStorage.removeItem(key)
    }

    watch(data, (val) => {
      try {
        localStorage.setItem(key, JSON.stringify(val))
      } catch (e) {
        // localStorage lleno o deshabilitado, ignorar
      }
    }, { deep: true })
  }

  return data
}
