export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const mlaId = getRouterParam(event, 'mlaId');

  const response = await fetch(`${config.backendUrl}/publications/${mlaId}/live`, {
    headers: { 'x-api-key': config.apiKey },
  });

  if (!response.ok) {
    throw createError({ statusCode: response.status, message: 'Error al obtener publicación en vivo' });
  }

  return response.json();
});
