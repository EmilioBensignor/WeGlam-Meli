# Guía de Integración Backend — WeGlam Seller Analytics

Este documento describe todo lo que el equipo de backend necesita para conectar el frontend con datos reales. El frontend está 100% funcional con datos mock, listo para reemplazar por APIs reales.

---

## 1. Arquitectura General

```
[Usuario] → [Supabase Auth] → [Nuxt Frontend (app/)]
                                      ↓
                              [Server Routes (server/api/)]
                                      ↓ (proxy con x-api-key)
                              [Backend Render] → [MercadoLibre API]
```

### Variables de entorno (.env)

```env
SUPABASE_URL=supabase-url
SUPABASE_KEY=supabase-key
BACKEND_URL=backend-url
API_KEY=api-key
```

- `BACKEND_URL` y `API_KEY` se usan en `nuxt.config.ts` → `runtimeConfig` → disponibles solo en server routes
- Supabase se configura automáticamente via `@nuxtjs/supabase`

---

## 2. Endpoints Existentes (ya funcionan)

### `GET /api/sync-products`

**Archivo:** `server/api/sync-products.js`
**Proxea a:** `${BACKEND_URL}/products`
**Header:** `x-api-key: ${API_KEY}`

**Response esperada del backend:**

```json
[
  {
    "ml_id": "MLA3024583102",
    "sku": "WG-SER-001",
    "titulo": "Secaplatos Extensible...",
    "categoria": "Cocina",
    "imagenes": [{ "url": "https://..." }],
    "thumbnail": "https://...",
    "publicaciones_activas": 5,
    "disponibles": 100,
    "revenue_30d": 45600,
    "trend": 12
  }
]
```

**Mapeo en frontend** (`app/composables/useProducts.js` línea 161):

```
ml_id || id || sku       → id
sku                      → sku
titulo || title          → titulo
categoria                → categoria (default: 'Sin categoría')
imagenes[0].url || thumbnail → imagen
publicaciones_activas    → publicacionesActivas (default: 1)
disponibles ?? stock     → stockTotal (default: 0)
revenue_30d              → revenue30d (default: 0)
trend                    → trend (default: 0)
```

**Fallback:** Si el backend no responde, el frontend usa mock data hardcodeado.

---

### `GET /api/sync-id-products/:mlId`

**Archivo:** `server/api/sync-id-products/[mlId].js`
**Proxea a:** `${BACKEND_URL}/products/${mlId}`
**Header:** `x-api-key: ${API_KEY}`

**Response esperada del backend:**

```json
{
  "ml_id": "MLA3024583102",
  "sku": "WG-SER-001",
  "titulo": "Serum Facial Vitamina C Premium 30ml",
  "precio": 14500,
  "precio_original": 18000,
  "moneda": "ARS",
  "disponibles": 156,
  "vendidos": 245,
  "estado": "active",
  "condicion": "new",
  "envio_gratis": true,
  "imagenes": [{ "url": "https://..." }],
  "atributos": [{ "nombre": "Marca", "valor": "We Glam" }],
  "descripcion": "Serum facial con vitamina C...",
  "garantia": "Garantía del vendedor: 30 días",
  "permalink": "https://articulo.mercadolibre.com.ar/MLA-...",
  "actualizado_en": "2026-03-29T10:30:00Z"
}
```

---

## 3. Endpoints que Faltan Implementar

### 3.1 `GET /api/dashboard-stats`

**Consumido por:** `app/composables/useDashboardStats.js`
**Página:** Dashboard (`app/pages/index.vue`)

**Response esperada:**

```json
{
  "kpis": [
    {
      "label": "Ventas del mes",
      "value": "$2,450,000",
      "trend": 12.5,
      "icon": "i-tabler-cash",
      "color": "primary"
    },
    {
      "label": "Publicaciones activas",
      "value": "147",
      "trend": 5.4,
      "icon": "i-tabler-package",
      "color": "success"
    },
    {
      "label": "Visitas totales",
      "value": "23,841",
      "trend": -3.2,
      "icon": "i-tabler-eye",
      "color": "warning"
    },
    {
      "label": "Salud general",
      "value": "78/100",
      "trend": 2.1,
      "icon": "i-tabler-heart-rate-monitor",
      "color": "primary"
    }
  ],
  "salesData": [
    { "label": "01 Mar", "value": 82000 },
    { "label": "03 Mar", "value": 95000 }
  ],
  "adPerformanceData": [
    { "label": "S1", "gasto": 85000, "retorno": 210000 },
    { "label": "S2", "gasto": 72000, "retorno": 280000 }
  ],
  "topProducts": [
    {
      "id": "MLA3024583102",
      "nombre": "Serum Hyaluronic 2%",
      "imagen": "https://...",
      "unidades": 1240,
      "revenue": 325000,
      "badge": "Alta demanda"
    }
  ],
  "worstProducts": [
    {
      "id": "MLA3024583105",
      "nombre": "Brush Kit Classic",
      "imagen": "https://...",
      "unidades": 12,
      "revenue": 12400,
      "badge": "Crítico"
    }
  ]
}
```

**Notas:**

- `kpis[].value` es string formateado (el frontend lo muestra tal cual)
- `kpis[].trend` es número (porcentaje de cambio)
- `kpis[].color` debe ser: `"primary"`, `"success"`, `"warning"` o `"error"`
- `salesData` son datos diarios para chart de línea (últimos 30 días)
- `adPerformanceData` son datos semanales para chart de barras
- `badge` en productos: `"Alta demanda"`, `"Crítico"`, `"Bajo rendimiento"`

---

### 3.2 `GET /api/products/:productId/publications`

**Consumido por:** `app/composables/usePublications.js`
**Página:** Lista de publicaciones (`app/pages/productos/[id]/index.vue`)

**Response esperada:**

```json
[
  {
    "mlaId": "MLA-1847293001",
    "productId": "MLA3024583102",
    "titulo": "Secaplatos Extensible De Acero Inoxidable Con Cubiertero",
    "precio": 45990,
    "precioOriginal": 54990,
    "moneda": "ARS",
    "stock": 87,
    "stockMax": 120,
    "vendidos": 312,
    "estado": "active",
    "condicion": "new",
    "envioGratis": true,
    "imagen": "https://...",
    "visitas30d": 18400,
    "ventas30d": 312,
    "conversion": 1.7,
    "facturacion30d": 14348880,
    "preguntasSinResponder": 4,
    "healthScore": 92,
    "actualizadoEn": "2026-03-29T10:30:00Z"
  }
]
```

**Notas:**

- `estado`: `"active"` | `"paused"` | `"closed"`
- `condicion`: `"new"` | `"used"`
- `conversion` es porcentaje (ej: 1.7 = 1.7%)
- `healthScore` es 0-100
- El frontend calcula `productInfo` (título, stock total, revenue total) desde este array

---

### 3.3 `GET /api/publications/:mlaId/metrics`

**Consumido por:** `app/composables/usePublicationDetail.js`
**Página:** Detalle de publicación (`app/pages/productos/[id]/[mla].vue`)

**Response esperada:**

```json
{
  "visitas30d": 12400,
  "ventas30d": 245,
  "conversion": 2.4,
  "facturacion30d": 3552500,
  "preguntasSinResponder": 3,
  "healthScore": 85,
  "visitas_trend": 8,
  "ventas_trend": 15,
  "conversion_trend": -0.3,
  "profit": {
    "precioVenta": 14500,
    "costoProducto": 5800,
    "comisionMeli": 1885,
    "comisionPorcentaje": 13,
    "envio": 1100,
    "impuestos": 1250,
    "publicidad": 400,
    "gananciaNeta": 4065,
    "margen": 28,
    "roi": 1.7
  },
  "ads": {
    "activa": true,
    "impresiones": 84200,
    "clics": 3260,
    "ctr": 3.88,
    "acos": 8.2,
    "roiPublicitario": 4.8,
    "gastoTotal": 412500,
    "dailyData": [{ "label": "14 Mar", "gasto": 28000, "ventas": 68000 }]
  },
  "recommendations": [
    {
      "titulo": "Agregar fotos de uso",
      "descripcion": "Publicar fotos del producto siendo aplicado mejora la conversión en un 12%.",
      "prioridad": "alta",
      "icon": "i-tabler-camera-plus"
    }
  ]
}
```

**Notas:**

- `prioridad`: `"alta"` | `"media"` | `"baja"`
- `ads.dailyData` son los últimos 14 días
- `comisionPorcentaje` se muestra como "Comisión MeLi (X%)" — actualmente hardcodeado en 13%
- `visitas_trend`, `ventas_trend`, `conversion_trend` — actualmente hardcodeados en KpiRow.vue

---

## 4. Autenticación (Supabase)

### Flujo

1. **Login:** `client.auth.signInWithPassword({ email, password })`
2. **Registro:** `client.auth.signUp({ email, password, options: { data: { display_name } } })`
3. **Sesión:** Cookie con maxAge de 8 horas, auto-refresh habilitado
4. **Middleware:** Supabase redirige a `/login` si no hay sesión (excepto rutas públicas)

### Rutas públicas (sin auth)

- `/login`
- `/register`
- `/forgot-password`
- `/forgot-password-confirmation`
- `/reset-password`

### Validación de password (registro)

- Mínimo 8 caracteres
- Al menos 1 minúscula, 1 mayúscula, 1 dígito, 1 carácter especial
- Check contra Have I Been Pwned API

### Cache de sesión

- Archivo: `app/composables/useSupabaseCache.js`
- Key: `auth_session_cache` en localStorage
- TTL: 90% del tiempo de expiración del token

---

## 5. Datos Hardcodeados — Inventario

### Mock data en composables (REEMPLAZAR por API)

| Archivo                                                  | Datos mock                                                     | Endpoint que debe proveerlo                   |
| -------------------------------------------------------- | -------------------------------------------------------------- | --------------------------------------------- |
| `app/composables/useDashboardStats.js`                   | KPIs, salesData, adPerformanceData, topProducts, worstProducts | `GET /api/dashboard-stats`                    |
| `app/composables/useProducts.js` líneas 1-90             | Array de 8 productos mock (fallback)                           | `GET /api/sync-products` (ya existe)          |
| `app/composables/usePublications.js` líneas 1-295        | mockPublicationsByProduct + generateDefaultMock                | `GET /api/products/:id/publications`          |
| `app/composables/usePublicationDetail.js` líneas 1-70    | mockMetrics (profit, ads, recommendations)                     | `GET /api/publications/:mlaId/metrics`        |
| `app/composables/usePublicationDetail.js` líneas 113-139 | Fallback publication data                                      | `GET /api/sync-id-products/:mlId` (ya existe) |

### Valores hardcodeados en componentes (HACER DINÁMICOS)

| Archivo                                          | Línea | Valor hardcodeado                  | Solución                                  |
| ------------------------------------------------ | ----- | ---------------------------------- | ----------------------------------------- |
| `app/components/publication/KpiRow.vue`          | 7     | `:value="8"` (trend visitas)       | Recibir de metrics API `visitas_trend`    |
| `app/components/publication/KpiRow.vue`          | 15    | `:value="15"` (trend ventas)       | Recibir de metrics API `ventas_trend`     |
| `app/components/publication/KpiRow.vue`          | 28    | `:value="-0.3"` (trend conversión) | Recibir de metrics API `conversion_trend` |
| `app/components/publication/ProfitBreakdown.vue` | 20    | `"Comisión MeLi (13%)"`            | Recibir `comisionPorcentaje` de profit    |

### Thresholds (se pueden dejar hardcodeados o hacerlos configurables)

| Archivo                                      | Concepto         | Valores                                                             |
| -------------------------------------------- | ---------------- | ------------------------------------------------------------------- |
| `app/composables/useHealthScore.js`          | Score labels     | >= 80: Saludable, >= 60: Aceptable, >= 40: Mejorable, < 40: Crítico |
| `app/composables/useHealthScore.js`          | Título óptimo    | 50-120 caracteres                                                   |
| `app/components/publication/HealthScore.vue` | Colores de score | >= 70: verde, >= 40: amarillo, < 40: rojo                           |

---

## 6. Guía de Integración — Orden Sugerido

### Paso 1: Dashboard Stats

1. Crear endpoint `GET /api/dashboard-stats` en el backend
2. Crear server route proxy en `server/api/dashboard-stats.js`
3. Modificar `app/composables/useDashboardStats.js`:
   - Reemplazar refs hardcodeadas por `$fetch('/api/dashboard-stats')`
   - Mantener mock data como fallback en el `catch`

### Paso 2: Publications por producto

1. Crear endpoint `GET /api/products/:id/publications` en el backend
2. Crear server route proxy en `server/api/products/[id]/publications.js`
3. Modificar `app/composables/usePublications.js`:
   - En `fetchPublications()`, reemplazar mock por `$fetch`
   - Mantener `generateDefaultMock()` como fallback

### Paso 3: Métricas de publicación

1. Crear endpoint `GET /api/publications/:mlaId/metrics` en el backend
2. Crear server route proxy
3. Modificar `app/composables/usePublicationDetail.js`:
   - Fetch metrics reales
   - Pasar trends a KpiRow como props (requiere modificar KpiRow.vue)

### Paso 4: Limpieza

1. Eliminar mock arrays de los composables (o dejar como fallback)
2. Actualizar `comisionPorcentaje` dinámico en ProfitBreakdown
3. Conectar trends dinámicos en KpiRow

---

## 7. Notas para integración con Claude Code

### Archivos clave a modificar

```
app/composables/useDashboardStats.js    — Reemplazar mocks por fetch
app/composables/usePublications.js      — Reemplazar mocks por fetch
app/composables/usePublicationDetail.js — Reemplazar mocks por fetch
app/components/publication/KpiRow.vue   — Hacer trends dinámicos (props)
app/components/publication/ProfitBreakdown.vue — comisión dinámica
```

### Server routes a crear (proxies)

```
server/api/dashboard-stats.js
server/api/products/[id]/publications.js
server/api/publications/[mlaId]/metrics.js
```

### Patrón de server route (copiar de los existentes)

```javascript
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const response = await $fetch(`${config.backendUrl}/endpoint`, {
    headers: { "x-api-key": config.apiKey },
  });
  return response;
});
```

### Cómo testear

1. `npm run dev`
2. Verificar que cada página carga datos del backend
3. Desconectar backend → verificar que el fallback mock funciona
4. Probar en dark y light mode (los estilos no deberían cambiar)

### Qué borrar después de integrar

- `mockProducts` en `useProducts.js` (líneas 1-90) — o dejar como fallback
- `mockPublicationsByProduct` y `generateDefaultMock` en `usePublications.js` (líneas 1-295)
- `mockMetrics` en `usePublicationDetail.js` (líneas 1-70)
- Mocks en `useDashboardStats.js` — todo el contenido de los refs

### Formatos importantes

- Moneda: ARS (Argentine Peso), formateado con `formatCurrency()` y `formatRevenue()`
- Timestamps: ISO 8601
- Porcentajes: número decimal (ej: 2.4 = 2.4%, no 0.024)
- Trends: número con signo (positivo = mejora, negativo = caída)
