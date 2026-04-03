export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const response = await fetch(`${config.backendUrl}/dashboard-stats`, {
    method: 'GET',
    headers: {
      'x-api-key': config.apiKey,
    },
  });

  if (!response.ok) {
    throw createError({ statusCode: response.status, message: 'Error al obtener estadísticas del backend' });
  }

  const data = await response.json();
  return data;
});
