// Resetea el scroll al top en cada cambio de ruta
// Incluye el body (scroll por defecto) y el panel interno de UDashboardPanel
export default defineNuxtPlugin(() => {
  const router = useRouter()

  router.afterEach(() => {
    nextTick(() => {
      window.scrollTo({ top: 0, behavior: 'instant' })
      document.querySelectorAll('[data-slot="body"]').forEach((el) => {
        el.scrollTo?.({ top: 0, behavior: 'instant' })
      })
    })
  })
})
