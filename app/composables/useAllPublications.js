export function useAllPublications() {
  const publications = ref([])
  const loading = ref(true)
  const error = ref(null)

  async function fetchAllPublications() {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch('/api/all-publications')
      publications.value = Array.isArray(data) ? data : []
    } catch (e) {
      error.value = e.message || 'Error al cargar publicaciones'
      publications.value = []
    } finally {
      loading.value = false
    }
  }

  return {
    publications: readonly(publications),
    loading: readonly(loading),
    error: readonly(error),
    fetchAllPublications,
  }
}
