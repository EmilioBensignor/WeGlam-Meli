# WeGlam Seller Analytics

Dashboard de analytics para sellers de Mercado Libre (marca WeGlam, cosmetics). Muestra KPIs de ventas, salud de publicaciones, rentabilidad, performance publicitaria y gestión de catálogo. Todos los datos son mock, preparados para conectar a APIs reales.

## Stack

- **Framework**: Nuxt 4.3, `app/` directory
- **Lenguaje**: JavaScript (NO TypeScript en componentes/composables)
- **UI**: Vue 3 `<script setup>`, Nuxt UI v4 (4.6.0), Tailwind CSS 4
- **Charts**: vue-chartjs + Chart.js (registrado en `plugins/chartjs.client.js`)
- **Auth**: @nuxtjs/supabase
- **Iconos**: @nuxt/icon — Tabler (`i-tabler-*`). Nuxt UI usa Lucide internamente (no tocar)
- **Fonts**: @nuxt/fonts — Outfit (sans)
- **Imágenes**: @nuxt/image

## Comandos

- `npm run dev` — Dev server
- `npm run build` — Build producción
- `npm run start` — Pull + install + dev (workflow equipo)

## Estructura

```
app/
  assets/css/main.css       — Design tokens @theme, overrides light/dark
  app.config.ts             — Colores semánticos Nuxt UI
  app.vue                   — Root: NuxtLayout + NuxtPage + NotificationContainer
  error.vue                 — Página de error 404
  components/
    dashboard/              — KpiCard, SalesChart, AdPerformanceChart, TopProductsTable
    publication/            — AdPanel, Filters, HealthScore, KpiRow, ProductHeader, ProfitBreakdown, PublicationHeader, RecommendationList, Table
    product/                — ProductCard, ProductFilters
    shared/                 — StatusBadge, TrendBadge
    form/                   — TextField, PasswordField, SelectField, etc. (auth pages)
    auth/                   — Header (auth layout)
    button/                 — Primary (auth pages)
    notification/           — Container, Toast
    default/                — Footer, Main, Section (auth pages)
    heading/                — H1 (componente unificado con prop level: 1|2)
  composables/
    useChartTheme.js        — Paleta de colores Chart.js reactiva al color mode
    useDashboardStats.js    — KPIs, datos de charts, rankings (mock)
    useProducts.js          — Productos con filtros, paginación (mock)
    usePublications.js      — Publicaciones de un producto (mock)
    usePublicationDetail.js — Detalle de publicación + profit + ads (mock)
    useHealthScore.js       — Cálculo de score de salud (0-100)
    useDebounce.js          — Utilidad debounce
    useDynamicForm.js       — Form builder dinámico (auth)
    useNotification.js      — Sistema de notificaciones
    useStorage.js           — Validación de archivos para Supabase
    useSupabaseCache.js     — Cache localStorage con TTL
  layouts/
    dashboard.vue           — UDashboardGroup + Sidebar + Panel + Navbar (con color mode toggle)
    auth.vue                — Layout de auth (NO TOCAR)
  pages/
    index.vue               — Dashboard principal (layout: dashboard)
    productos/index.vue     — Grid de productos con paginación (layout: dashboard)
    productos/[id]/index.vue — Publicaciones de un producto, UTable (layout: dashboard)
    productos/[id]/[mla].vue — Detalle de publicación (layout: dashboard)
    login.vue               — Login (layout: auth)
    register.vue            — Registro (layout: auth)
    forgot-password.vue     — Recuperar contraseña (layout: auth)
    forgot-password-confirmation.vue
    reset-password.vue
  plugins/
    chartjs.client.js       — Registro centralizado de Chart.js (client-only)
  utils/
    formatters.js           — formatCurrency, formatNumber, formatRevenue (auto-importados)
    errorHandler.js         — Mapeo de errores Supabase a español
  constants/
    ROUTE_NAMES.js          — Rutas nombradas
  types/
    product.js              — Definiciones JSDoc
server/
  api/
    sync-products.js        — Proxy GET a backend externo
    sync-id-products/[mlId].js — Proxy GET por ID
```

## Paleta de colores

Definida en `app/assets/css/main.css` via `@theme`:

| Token | Light | Dark |
|-------|-------|------|
| `primary-400` | #6CC3E0 | #6CC3E0 |
| `surface-base` | #F7F8FA | #0F1524 |
| `surface-container` | #FFFFFF | #1D1F26 |
| `surface-high` | #FFFFFF | #282A30 |
| `surface-highest` | #E4E7EB | #33353B |
| `surface-low` | #EEF0F3 | #191B22 |
| `surface-lowest` | #EEF0F4 | #0C0E14 |
| `on-surface` | #1A1C22 | #E2E2EA |
| `on-surface-variant` | #5A6370 | #BEC8CD |
| `outline` | #8B9199 | #889297 |
| `outline-variant` | #C8CDD3 | #3F484C |

Colores semánticos en `app.config.ts`: primary, success (green), warning (yellow), error (red), neutral (slate).

## Color mode

- **Default**: dark
- **Toggle**: `UColorModeButton` en el navbar del dashboard
- **Config**: `colorMode.preference: 'dark'` en nuxt.config.ts
- **CSS**: `@theme` define valores light (default), `.dark` los overridea
- **Charts**: usan `useChartTheme()` composable + colores inline con `colorMode.value` ternarios + `:key="colorMode.value"` para re-render
- **Contraste light**: colores semánticos usan `*-600 dark:*-400` (ej: `text-primary-600 dark:text-primary-400`)

## Convenciones

- JavaScript (NO TypeScript). Props validados con `defineProps()` + type/required
- `<script setup>` primero, luego `<template>` (dashboard). Auth pages usan orden inverso
- 2 espacios de indentación
- Nuxt auto-importa: NO hacer `import { ref, computed } from 'vue'`
- Nuxt auto-importa desde `utils/` y `composables/`
- Iconos: `i-tabler-*` via @nuxt/icon. Lucide solo dentro de Nuxt UI
- Charts: siempre via `vue-chartjs`, font-family `Outfit`, colores con ternario `colorMode.value === 'dark' ? X : Y`
- Formateo: usar `formatCurrency()`, `formatNumber()`, `formatRevenue()` de utils
- Tailwind CSS 4: tokens via `@theme` en main.css, NO hay tailwind.config.js
- Rutas: usar `ROUTE_NAMES` de `~/constants/ROUTE_NAMES.js`, NO hardcodear paths
- Headings: usar `<HeadingH1>` (h1 por defecto) o `<HeadingH1 :level="2">` (h2)
- Cards dashboard: `bg-surface-lowest rounded-xl border border-outline-variant/30 p-4`, gap-4 entre secciones
- Colores en light: usar `*-600 dark:*-400` para primary, green, yellow, red (contraste)
- UPagination: usar `v-model:page` (NO `v-model`)

## Reglas

- **NO tocar auth**: layouts/auth.vue, páginas de auth, middleware
- **NO tocar server routes**: server/api/*, composables de fetch
- **NO cambiar de JS a TS**
- **NO instalar dependencias** sin consultar
- **NO tomar decisiones de diseño** sin consultar
- **NO crear features nuevas** sin que se pidan

## Datos

Todo es mock. Los composables (`useDashboardStats`, `useProducts`, `usePublications`, `usePublicationDetail`) tienen datos hardcodeados con estructura preparada para APIs reales. El backend proxy está en Render (`BACKEND_URL` en .env).

## Variables de entorno

- `API_KEY` — Key para el backend proxy
- `BACKEND_URL` — URL del backend en Render
- Variables de Supabase (manejadas por @nuxtjs/supabase)
