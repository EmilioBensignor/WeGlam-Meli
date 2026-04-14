export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const response = await fetch(`${config.backendUrl}/sync-metrics`, {
    method: 'POST',
    headers: { 'x-api-key': config.apiKey },
  });

  if (!response.ok) {
    throw createError({ statusCode: response.status, message: 'Error al sincronizar métricas' });
  }

  return response.json();
});
