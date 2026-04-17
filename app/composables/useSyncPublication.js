export function useSyncPublication(mlaId, onSuccess) {
  const syncing = ref(false)
  const lastSyncedAt = ref(0)
  const cooldownMessage = ref(null) // mensaje del back con segundos restantes
  const error = ref(null)

  // Texto de feedback al lado del botón
  const statusText = computed(() => {
    if (error.value) return error.value
    if (cooldownMessage.value) return cooldownMessage.value
    if (lastSyncedAt.value > 0) return 'Datos actualizados'
    return null
  })

  // Tono del texto (éxito / neutral / error)
  const statusTone = computed(() => {
    if (error.value) return 'error'
    if (cooldownMessage.value) return 'neutral'
    if (lastSyncedAt.value > 0) return 'success'
    return 'neutral'
  })

  async function sync() {
    if (syncing.value) return
    syncing.value = true
    error.value = null
    cooldownMessage.value = null
    try {
      const id = toValue(mlaId)
      const fresh = await $fetch(`/api/publications/${id}/sync`, { method: 'POST' })
      lastSyncedAt.value = Date.now()
      onSuccess?.(fresh)
    } catch (e) {
      const msg = e.data?.data?.error || e.data?.error || 'Error al sincronizar'
      if (e.statusCode === 429 || e.data?.statusCode === 429) {
        // Cooldown activo: mostrar el mensaje exacto del back
        cooldownMessage.value = msg
      } else {
        error.value = msg
      }
    } finally {
      syncing.value = false
    }
  }

  return { syncing, canSync: computed(() => !syncing.value), statusText, statusTone, sync }
}
