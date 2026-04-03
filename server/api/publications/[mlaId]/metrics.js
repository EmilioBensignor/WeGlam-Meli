export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const mlaId = getRouterParam(event, 'mlaId');

  const response = await fetch(`${config.backendUrl}/publications/${mlaId}/metrics`, {
    method: 'GET',
    headers: {
      'x-api-key': config.apiKey,
    },
  });

  if (!response.ok) {
    throw createError({ statusCode: response.status, message: 'Error al obtener métricas del backend' });
  }

  const data = await response.json();
  return data;
});
