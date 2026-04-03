export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const id = getRouterParam(event, 'id');

  const response = await fetch(`${config.backendUrl}/products/${id}/publications`, {
    method: 'GET',
    headers: {
      'x-api-key': config.apiKey,
    },
  });

  if (!response.ok) {
    throw createError({ statusCode: response.status, message: 'Error al obtener publicaciones del backend' });
  }

  const data = await response.json();
  return data;
});
