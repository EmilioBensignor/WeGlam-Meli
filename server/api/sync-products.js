export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const response = await fetch(`${config.backendUrl}/products`, {
    method: 'GET',
    headers: {
      'x-api-key': config.apiKey,
    }
  });

  if (!response.ok) {
    throw createError({ statusCode: response.status, message: 'Error al obtener productos del backend' });
  }

  const data = await response.json();
  return data;
});
