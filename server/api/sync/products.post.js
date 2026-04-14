export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const response = await fetch(`${config.backendUrl}/sync-products`, {
    method: 'POST',
    headers: { 'x-api-key': config.apiKey },
  });

  if (!response.ok) {
    throw createError({ statusCode: response.status, message: 'Error al sincronizar productos' });
  }

  return response.json();
});
