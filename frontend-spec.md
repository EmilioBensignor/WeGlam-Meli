# Frontend Spec — MercadoLibre Business Intelligence

> Base URL de la API: `http://localhost:3000`
> Auth: todas las requests protegidas llevan el header `X-API-Key: {tu_api_key}`

---

## Resumen de pantallas

| # | Pantalla | Ruta sugerida |
|---|----------|---------------|
| 1 | Dashboard principal | `/` |
| 2 | Productos | `/products` |
| 3 | Rentabilidad | `/profitability` |
| 4 | Recomendaciones de pauta | `/recommendations` |
| 5 | Publicidad | `/advertising` |
| 6 | Órdenes | `/orders` |
| 7 | Analytics / Visitas | `/analytics` |
| 8 | Costos (carga manual) | `/costs` |

---

## 1. Dashboard principal (`/`)

**Propósito:** vista ejecutiva de todo el negocio de un vistazo.

### Datos que consume

```
GET /dashboard?from=YYYY-MM-DD&to=YYYY-MM-DD
GET /dashboard/top-products?limit=5
GET /dashboard/trends?months=6
```

### Layout

```
┌─────────────────────────────────────────────────────┐
│  Filtro de período: [Últimos 30 días ▼]  [Desde] [Hasta]
├──────────┬──────────┬──────────┬──────────┬─────────┤
│ Ingresos │ Ganancia │  Margen  │  Órdenes │ ROAS    │
│ $XXX.XXX │ $XX.XXX  │  34.2%   │   142    │  6.4x   │
│ brutos   │ neta     │ promedio │          │ global  │
├──────────┴──────────┴──────────┴──────────┴─────────┤
│  Gasto en pauta: $X.XXX     ACoS global: XX.X%      │
├────────────────────────┬────────────────────────────┤
│  Top 5 productos       │  Tendencia ingresos (bars) │
│  por ganancia neta     │  últimos 6 meses           │
│  (tabla simple)        │                            │
└────────────────────────┴────────────────────────────┘
```

### Cards de KPIs

Cada card muestra:
- Valor principal grande
- Label descriptivo abajo
- Color: verde si positivo, rojo si negativo (para margen y ganancia)

| Campo API | Label visible | Formato |
|-----------|--------------|---------|
| `total_ingresos_brutos` | Ingresos brutos | `$1.234.567` |
| `total_ganancia_neta` | Ganancia neta | `$234.567` |
| `margen_promedio` | Margen promedio | `34.2%` |
| `total_ordenes` | Órdenes | `142` |
| `roas_global` | ROAS | `6.4x` (null → "Sin datos") |
| `acos_global` | ACoS | `15.3%` (null → "Sin pauta") |
| `total_gasto_publicidad` | Gasto en pauta | `$12.340` |
| `total_productos_activos` | Productos activos | `87` |

### Top productos (tabla)

Datos de `GET /dashboard/top-products`:

| Columna | Campo |
|---------|-------|
| Producto | `productos.titulo` + `thumbnail` (imagen 40x40) |
| Ganancia neta | `ganancia_neta` |
| Margen | `margen_porcentaje` |
| Ingresos | `ingresos_brutos` |
| Unidades | `unidades_vendidas` |
| ROAS | `roas` |

### Gráfico de tendencia

Datos de `GET /dashboard/trends?months=6`:

- Tipo: barras verticales
- Eje X: `mes` (formato "Ene 25", "Feb 25", etc.)
- Eje Y: `ingresos`
- Tooltip: mostrar también `ordenes`

---

## 2. Productos (`/products`)

**Propósito:** ver todos los productos sincronizados con ML, con acceso rápido a su rentabilidad.

### Datos que consume

```
GET /products
GET /profitability   ← para enriquecer cada producto con su margen
```

Joinear por `ml_id` en el frontend.

### Layout

Barra superior:
- Buscador por título / SKU
- Filtro de estado: `active` / `paused` / `closed`
- Botón "Sincronizar productos" → `POST /sync-products`

Tabla principal:

| Columna | Campo | Notas |
|---------|-------|-------|
| Imagen | `thumbnail` | 48x48, rounded |
| Título | `titulo` | Link a `permalink` (nueva tab) |
| SKU | `sku` | |
| Precio | `precio` + `moneda` | `$1.234 ARS` |
| Stock | `disponibles` | rojo si 0 |
| Vendidos | `vendidos` | |
| Estado | `estado` | badge: verde=active, gris=paused, rojo=closed |
| Margen | `margen_porcentaje` del join | badge de color: verde >20%, amarillo 10-20%, rojo <10% |
| Ganancia neta | `ganancia_neta` del join | — |
| — | — | Botón "Ver detalle" → `/products/:mlId` |

### Detalle de producto (`/products/:mlId`)

Dos columnas:

**Columna izquierda — Ficha del producto**
- Imagen principal grande
- Título, precio, condición
- Descripción (colapsable si es larga)
- Atributos (tabla clave/valor)
- Links: ML permalink, thumbnail

**Columna derecha — Rentabilidad y costos**

Bloque "Costos" (editable):
```
Costo del producto:   [_______] ARS
Otros costos:         [_______] ARS
Notas:                [_______]
                      [Guardar] → POST /costs/:mlId
```

Bloque "Rentabilidad calculada" (read-only):
- Todos los campos de `GET /profitability/:mlId` (último snapshot)
- Mostrar desglose: ingresos → - costo → - comisión ML → - envío → - pauta = **ganancia neta**

Bloque "Comisión estimada ML":
- Botón "Consultar comisión" → `GET /profitability/fees/:mlId`
- Muestra el breakdown de fees devuelto por la API

---

## 3. Rentabilidad (`/profitability`)

**Propósito:** tabla completa de rentabilidad de todos los productos, ordenable.

### Datos que consume

```
GET /profitability
POST /profitability/calculate   ← botón "Recalcular"
```

### Layout

Barra superior:
- Botón "Recalcular rentabilidad" → abre modal para elegir período (from/to) → `POST /profitability/calculate`
  - Durante el cálculo: spinner + mensaje "Calculando X productos..."
  - Al terminar: toast "Calculados X productos para el período DD/MM - DD/MM"

Filtros: ordenar por (ganancia neta / margen / ingresos / ROAS), dirección ASC/DESC.

Tabla:

| Columna | Campo | Notas |
|---------|-------|-------|
| Producto | `productos.titulo` + thumbnail | |
| Ingresos | `ingresos_brutos` | |
| Costo total | suma de costos calculados | |
| Comisión ML | `comision_ml` | |
| Gasto pauta | `gasto_publicidad` | |
| **Ganancia neta** | `ganancia_neta` | negrita, color por valor |
| **Margen %** | `margen_porcentaje` | badge de color |
| ROI | `roi` | formato `2.3x` (null → "—") |
| ROAS | `roas` | formato `5.1x` (null → "Sin pauta") |
| ACoS | `acos` | `%` (null → "—") |
| Unidades | `unidades_vendidas` | |
| Snapshot | `snapshot_date` | "hace X días" |

**Colores de margen:**
- `> 30%` → verde oscuro
- `15–30%` → verde claro
- `5–15%` → amarillo
- `0–5%` → naranja
- `< 0%` → rojo

---

## 4. Recomendaciones de pauta (`/recommendations`)

**Propósito:** la pantalla más importante para tomar decisiones de inversión publicitaria.

### Datos que consume

```
GET /recommendations
```

### Layout

Header:
```
🎯 Recomendaciones de pauta
Basado en rentabilidad, conversión y eficiencia publicitaria actual.
```

Cards en grid (3 columnas desktop, 1 mobile), ordenadas por `rank`:

```
┌──────────────────────────────┐
│ #1  [thumbnail]              │
│     Nombre del producto      │
│                              │
│  Score: ████████░░ 0.82     │
│                              │
│  Margen:    34.2%            │
│  Conversión: 3.1%            │
│  Unidades:  142              │
│  ROAS:      6.4x             │
│  ACoS:      11.9%            │
│                              │
│ ┌────────────────────────┐   │
│ │ ▲ Aumentar presupuesto │   │ ← badge color según recomendación
│ └────────────────────────┘   │
│                              │
│  "Alto score y eficiencia    │
│   publicitaria excelente"    │
└──────────────────────────────┘
```

**Colores del badge `recomendacion`:**

| Texto | Color |
|-------|-------|
| Iniciar campaña de pauta | azul |
| Aumentar presupuesto de pauta | verde |
| Mantener inversión publicitaria | verde claro |
| Evaluar iniciar pauta | amarillo |
| Reducir o pausar pauta | naranja |
| No recomendado para pauta | gris |

**Barra de score:** progress bar 0-100% mapeado del valor 0.0–1.0.

Filtro superior:
- Mostrar solo: Todos / Con pauta / Sin pauta
- Ordenar por: Score / Margen / Ganancia

---

## 5. Publicidad (`/advertising`)

**Propósito:** ver campañas activas, ads y su performance.

### Datos que consume

```
GET /advertising/campaigns
GET /advertising/ads
GET /advertising/stats?from=&to=
POST /sync-advertising   ← botón sincronizar
```

### Layout

**Tab 1 — Campañas**

Tabla:

| Columna | Campo |
|---------|-------|
| Nombre | `nombre` |
| Estado | `status` badge |
| Presupuesto | `budget` |
| Tipo | `tipo` |
| Última sync | `synced_at` |

**Tab 2 — Ads**

Filtro: por campaña (dropdown) / por producto (texto)

Tabla:

| Columna | Campo |
|---------|-------|
| Producto | `ml_id` + join con productos para mostrar título |
| Campaña | `campanas_publicidad.nombre` |
| Estado | `status` badge |

**Tab 3 — Performance**

Filtro de período (from/to) + filtro por producto.

Datos de `GET /advertising/stats`:

Métricas agregadas arriba (cards):
- Total impresiones
- Total clicks
- CTR = clicks / impresiones × 100
- Gasto total
- Ventas atribuidas
- ROAS = ventas atribuidas / gasto
- Conversiones

Tabla detallada:

| Columna | Campo |
|---------|-------|
| Fecha | `date` |
| Ad | `ad_id` |
| Producto | `publicidad_productos.ml_id` |
| Impresiones | `impressions` |
| Clicks | `clicks` |
| CTR | calculado |
| Gasto | `spend` |
| Ventas atribuidas | `attributed_sales` |
| ROAS | calculado |
| Conversiones | `conversions` |

---

## 6. Órdenes (`/orders`)

**Propósito:** historial de ventas completo, filtrable.

### Datos que consume

```
GET /orders?status=paid&from=&to=&mlId=
GET /orders/summary
POST /sync-orders   ← botón sincronizar
```

### Layout

**Sub-vista 1 — Resumen por producto**

Datos de `GET /orders/summary`:

Tabla ordenada por ingresos desc:

| Columna | Campo |
|---------|-------|
| Producto | `ml_id` (+ join con productos para título) |
| Ingresos totales | `ingresos` |
| Unidades vendidas | `unidades` |
| Cantidad de órdenes | `ordenes` |
| Ticket promedio | `ingresos / ordenes` calculado |

**Sub-vista 2 — Órdenes individuales**

Filtros: estado (paid / cancelled / otros), rango de fechas, producto.

Tabla:

| Columna | Campo |
|---------|-------|
| Orden # | `order_id` |
| Producto | `ml_id` |
| Monto | `total_amount` |
| Unidades | `quantity` |
| Estado | `status` badge |
| Fecha | `date_closed` formateada |
| Envío | `shipping_cost` |

---

## 7. Analytics / Visitas (`/analytics`)

**Propósito:** analizar tráfico y tasas de conversión por producto.

### Datos que consume

```
GET /analytics/visits?from=&to=
GET /analytics/conversion
POST /sync-visits   ← botón sincronizar
```

### Layout

Barra: botón "Sincronizar visitas (últimos 30 días)" + filtro de período.

**Bloque 1 — Tasa de conversión por producto**

Tabla de `GET /analytics/conversion`:

| Columna | Campo | Notas |
|---------|-------|-------|
| Producto | `ml_id` + título | |
| Visitas | `visitas` | |
| Unidades vendidas | `unidades` | |
| Tasa de conversión | `tasa_conversion` | formato `3.1%` |
| — | — | Barra visual proporcional |

Ordenar por tasa de conversión desc por defecto.

**Bloque 2 — Gráfico de visitas en el tiempo**

Filtro: elegir producto (dropdown con todos los ml_id + título).

Línea de tiempo con datos de `GET /analytics/visits?mlId=X`:
- Eje X: `date`
- Eje Y: `visits`
- Tooltip: fecha + visitas

---

## 8. Costos — carga manual (`/costs`)

**Propósito:** ingresar el costo de cada producto para que el cálculo de rentabilidad sea preciso.

### Datos que consume

```
GET /costs
POST /costs/:mlId   ← crear/actualizar
DELETE /costs/:mlId ← eliminar
GET /products       ← para mostrar los que NO tienen costo cargado aún
```

### Layout

Header con alerta si hay productos sin costo:
```
⚠️ 23 productos activos no tienen costo cargado. La rentabilidad calculada para esos productos asume costo = $0.
[Cargar costos pendientes]
```

**Tabla de costos cargados:**

| Columna | Campo |
|---------|-------|
| Producto | join con `productos.titulo` + thumbnail |
| Costo unitario | `costo` editable inline |
| Otros costos | `otros_costos` editable inline |
| Notas | `notas` |
| Actualizado | `actualizado_en` |
| — | botón guardar (inline) + botón eliminar |

**Productos sin costo (sub-sección o tab):**

Lista de productos de `GET /products` que no aparecen en `GET /costs`.
Para cada uno: mini formulario inline → `POST /costs/:mlId`.

---

## Sincronización — flujo recomendado

Agregar en algún lugar visible (sidebar o settings) un panel de "Última sincronización" con botones:

| Acción | Endpoint | Cuándo usarlo |
|--------|----------|---------------|
| Sincronizar productos | `POST /sync-products` | Al iniciar o cuando cambiaste el catálogo |
| Sincronizar órdenes | `POST /sync-orders` | Diariamente o para actualizar ventas |
| Sincronizar visitas | `POST /sync-visits` | Diariamente |
| Sincronizar publicidad | `POST /sync-advertising` | Diariamente o tras cambiar campañas |
| Calcular rentabilidad | `POST /profitability/calculate` | Luego de las syncs anteriores |

Mostrar fecha de última sync para cada uno (guardarlo en localStorage o en un estado global).

---

## Consideraciones de UX

### Estados de carga
- Cada sync puede tardar varios segundos (la API llama a ML de forma paginada)
- Mostrar spinner + "Sincronizando..." y deshabilitar el botón durante la operación
- Al terminar mostrar toast con el resultado: `{ synced: 142 }`

### Manejo de nulls
Varios campos pueden ser `null` cuando no hay datos suficientes:

| Campo | Cuándo es null | Mostrar como |
|-------|---------------|--------------|
| `roas` | Sin gasto en pauta | `—` o "Sin pauta" |
| `acos` | Sin ventas atribuidas | `—` |
| `roi` | Sin costos registrados | `—` |
| `tasa_conversion` | Sin visitas | `0%` |

### Formato de números
- Moneda: `$1.234.567,89` (punto como separador de miles, coma decimal — estilo AR)
- Porcentajes: `34,2%` (un decimal)
- ROAS: `6.4x`
- Score de recomendaciones: barra visual (no mostrar el número crudo)

---

## Pila tecnológica sugerida (opcional)

No es obligatorio, pero estas librerías se adaptan bien al tipo de datos:

- **Charts:** Recharts o Chart.js (barras para trends, líneas para visitas)
- **Tablas:** TanStack Table (sorting, filtering nativo)
- **Estado global:** Zustand o Context API (para guardar filtros de período activo)
- **HTTP:** fetch nativo o axios con un wrapper que inyecte el `X-API-Key` header automáticamente
- **UI:** cualquier component library (MUI, shadcn/ui, Mantine)
