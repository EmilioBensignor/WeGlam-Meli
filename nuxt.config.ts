// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  runtimeConfig: {
    apiKey: process.env.API_KEY,
    backendUrl: process.env.BACKEND_URL,
  },
  devtools: { enabled: process.env.NODE_ENV === 'development' },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxt/ui',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxtjs/supabase',
  ],
  ui: {
    colorMode: true,
  },
  colorMode: {
    preference: 'light',
  },
  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/callback',
      exclude: [
        '/login',
        '/register',
        '/forgot-password',
        '/forgot-password-confirmation',
        '/reset-password',
      ]
    },
    cookieOptions: {
      maxAge: 60 * 60 * 8,
      secure: process.env.NODE_ENV === 'production'
    },
    clientOptions: {
      auth: {
        persistSession: true,
        detectSessionInUrl: true,
        autoRefreshToken: true,
      }
    },
  },
  fonts: {
    families: [
      { name: 'Outfit', provider: 'google', weights: [300, 400, 500, 600, 700, 800] },
    ],
  },
  icon: {
    size: '1rem',
    class: 'tablerIcon',
    serverBundle: {
      collections: ['tabler', 'lucide'],
    }
  },
  vite: {
    optimizeDeps: {
      include: [
        'vue-chartjs',
        'chart.js',
      ],
    },
  },
})