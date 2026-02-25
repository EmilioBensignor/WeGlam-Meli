export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const mlId = getRouterParam(event, 'mlId');

  const response = await fetch(`${config.backendUrl}/products/${mlId}`, {
    method: 'GET',
    headers: {
      'x-api-key': config.apiKey,
    }
  });

  if (!response.ok) {
    throw createError({ statusCode: response.status, message: 'Error al obtener el producto del backend' });
  }

  const data = await response.json();
  return data;
});
