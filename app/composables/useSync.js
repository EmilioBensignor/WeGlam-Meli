export function useSync() {
  const toast = useToast()
  const syncing = ref(false)

  async function runSync() {
    if (syncing.value) return
    syncing.value = true

    try {
      await $fetch('/api/sync/products', { method: 'POST' })
      await $fetch('/api/sync/metrics', { method: 'POST' })

      toast.add({
        title: 'Sincronización completa',
        description: 'Productos y métricas actualizados.',
        color: 'success',
        icon: 'i-tabler-circle-check',
      })
    } catch (e) {
      toast.add({
        title: 'Error al sincronizar',
        description: e.data?.message || e.message || 'Intentá de nuevo.',
        color: 'error',
        icon: 'i-tabler-alert-circle',
      })
    } finally {
      syncing.value = false
    }
  }

  return { syncing: readonly(syncing), runSync }
}
