# Guía de migración frontend — Agrupación por catálogo

## Resumen del cambio

El backend `GET /products` ahora devuelve productos **agrupados por `catalog_product_id`**.

### Estructura anterior (plana)
```json
[
  { "ml_id": "MLA123", "titulo": "Crema X 50ml", "precio": 5000, "estado": "active", ... },
  { "ml_id": "MLA124", "titulo": "Crema X 100ml", "precio": 8000, "estado": "active", ... },
  { "ml_id": "MLA125", "titulo": "Serum Y", "precio": 12000, "estado": "paused", ... }
]
```

### Estructura nueva (agrupada)
```json
[
  {
    "product_id": "MLA19441504",       // ← ID del grupo (catalog_product_id)
    "tipo": "catalogo",                 // ← "catalogo" o "standalone"
    "ml_id": "MLA123",                  // ← el item con más ventas del grupo
    "titulo": "Crema X 50ml",
    "thumbnail": "...",
    "publicaciones": 2,                 // ← NUEVO: cantidad de items en el grupo
    "publicaciones_activas": 2,
    "publicaciones_pausadas": 0,
    "precio_min": 5000,                 // ← NUEVO: rango de precios
    "precio_max": 8000,
    "moneda": "ARS",
    "disponibles": 150,                 // ← AGREGADO: stock total del grupo
    "vendidos": 45,
    "ventas_30d": 30,                   // ← AGREGADO
    "facturacion_30d": 240000,          // ← AGREGADO
    "visitas_30d": 1200,                // ← AGREGADO
    "preguntas_sin_responder": 3,       // ← AGREGADO
    "trend": 15,
    "sin_stock": 0,
    "envio_gratis": true,
    "healthScore": 72,                  // ← NUEVO: promedio del grupo
    "actualizado_en": "..."
  },
  {
    "product_id": "MLA125",            // ← standalone usa ml_id
    "tipo": "standalone",
    "ml_id": "MLA125",
    "titulo": "Serum Y",
    "publicaciones": 1,
    "precio_min": 12000,
    "precio_max": 12000,
    // ... mismos campos que antes + los nuevos
  }
]
```

---

## Archivos a modificar en el frontend

### 1. `app/composables/useProducts.js`
**Ya creado** — reemplazar con el archivo provisto. Cambios:
- Busca por `product_id` además de `ml_id` y `titulo`
- Filtros usan `publicaciones_activas` / `publicaciones_pausadas` en vez de `estado`
- Nuevo stat `conCatalogo`

### 2. `app/pages/productos/index.vue`
Adaptar la grilla/tabla para mostrar los campos nuevos:

```vue
<!-- Antes: se mostraba estado directamente -->
<StatusBadge :status="product.estado" />

<!-- Ahora: mostrar cantidad de publicaciones + badge de tipo -->
<div class="flex items-center gap-2">
  <UBadge v-if="product.tipo === 'catalogo'" color="primary" variant="subtle" size="xs">
    <UIcon name="i-tabler-stack-2" class="mr-1" />
    {{ product.publicaciones }} pub.
  </UBadge>
  <UBadge v-else color="neutral" variant="subtle" size="xs">
    Individual
  </UBadge>
</div>
```

Para el precio, mostrar rango si son diferentes:
```vue
<template v-if="product.precio_min !== product.precio_max">
  {{ formatCurrency(product.precio_min) }} - {{ formatCurrency(product.precio_max) }}
</template>
<template v-else>
  {{ formatCurrency(product.precio_min) }}
</template>
```

Para el health score:
```vue
<div class="flex items-center gap-1.5">
  <div class="w-8 h-2 rounded-full bg-surface-low overflow-hidden">
    <div
      class="h-full rounded-full"
      :class="product.healthScore >= 70 ? 'bg-green-500' : product.healthScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'"
      :style="{ width: `${product.healthScore}%` }"
    />
  </div>
  <span class="text-xs text-on-surface-variant">{{ product.healthScore }}</span>
</div>
```

### 3. Navegación al detalle (link del producto)
**Antes:** `navigateTo(`/productos/${product.ml_id}`)`
**Ahora:** `navigateTo(`/productos/${product.product_id}`)`

Esto hace que:
- Para grupos de catálogo → navega a `/productos/MLA19441504` (el catalog_product_id)
- Para standalone → navega a `/productos/MLA125` (el ml_id, igual que antes)

### 4. `app/pages/productos/[id]/index.vue`
Esta página ya usa `GET /products/:productId/publications`. El backend ahora:
- Si recibe un `catalog_product_id` → devuelve **todas las publicaciones** del grupo
- Si recibe un `ml_id` → devuelve solo esa publicación (backwards compatible)

La UTable de publicaciones ya debería funcionar, pero ahora mostrará **múltiples filas** para grupos de catálogo en vez de siempre 1.

Agregar columnas útiles:
```js
const columns = [
  { key: 'imagen', label: '' },
  { key: 'mlaId', label: 'MLA' },
  { key: 'titulo', label: 'Título' },
  { key: 'precio', label: 'Precio' },
  { key: 'estado', label: 'Estado' },
  { key: 'stock', label: 'Stock' },
  { key: 'ventas30d', label: 'Ventas 30d' },
  { key: 'healthScore', label: 'Salud' },
  { key: 'listingType', label: 'Tipo' },   // ← NUEVO
  { key: 'actions', label: '' },
]
```

### 5. `app/pages/productos/[id]/[mla].vue`
**Sin cambios necesarios** — esta página ya recibe un `mlaId` específico y llama a `GET /publications/:mlaId/metrics`. Sigue funcionando igual.

### 6. `app/composables/usePublications.js`
**Sin cambios necesarios** — ya llama a `GET /products/:productId/publications` con el ID de la ruta. Ahora recibirá 1+ publicaciones dependiendo de si es catálogo o standalone.

---

## Resumen visual del flujo

```
Lista de productos (agrupada)
├── Crema X (catálogo, 2 publicaciones)  →  click  →  /productos/MLA19441504
│   └── Tabla: MLA123 (50ml), MLA124 (100ml)
│       └── click MLA123  →  /productos/MLA19441504/MLA123  →  detalle con métricas
│       └── click MLA124  →  /productos/MLA19441504/MLA124  →  detalle con métricas
├── Serum Y (standalone, 1 publicación)  →  click  →  /productos/MLA125
│   └── Tabla: MLA125
│       └── click MLA125  →  /productos/MLA125/MLA125  →  detalle con métricas
```

---

## Checklist de implementación

- [ ] Reemplazar `useProducts.js` con el nuevo composable
- [ ] Actualizar `productos/index.vue` para usar `product_id`, mostrar badge de tipo, rango de precios, healthScore
- [ ] Cambiar navegación de `ml_id` a `product_id`
- [ ] Verificar que `productos/[id]/index.vue` muestra la tabla con múltiples publicaciones
- [ ] Opcionalmente: agregar columnas `listingType` y `healthScore` a la tabla de publicaciones
- [ ] Correr migración SQL en Supabase
- [ ] Reemplazar archivos del backend
- [ ] Ejecutar `POST /sync-products` para poblar las columnas nuevas
- [ ] Ejecutar `POST /sync-metrics` para poblar `ventas_diarias`
