export default defineNuxtConfig({
  compatibilityDate: '2026-02-03',

  future: {
    compatibilityVersion: 4,
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxt/image',
    '@nuxtjs/i18n',
    '@vercel/analytics/nuxt',
    '@vercel/speed-insights/nuxt',
    'nuxt-gtag',
    '@sentry/nuxt/module',
    '@vite-pwa/nuxt' // 📱 Módulo PWA añadido
  ],

  // 📱 Configuración de la App Instalable
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Ukiyo | Alta Cocina Japonesa',
      short_name: 'Ukiyo',
      description: 'El mundo flotante de la gastronomía japonesa en tu mesa.',
      theme_color: '#1a1a1a',
      background_color: '#000000',
      icons: [
        {
          src: '/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          src: '/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable'
        }
      ]
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico}']
    },
    devOptions: {
      enabled: true,
      type: 'module',
    }
  },

  gtag: {
    id: 'G-6TRS2ZSSTT' 
  },

  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: 'es',
    langDir: 'locales', 
    locales: [
      { code: 'es', name: 'Español', iso: 'es-ES', file: 'es.json' },
      { code: 'en', name: 'English', iso: 'en-US', file: 'en.json' }
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
    }
  },

  runtimeConfig: {
    public: {
      apiBase: '' 
    }
  },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'Ukiyo | Alta Cocina Japonesa',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
    }
  },

  devtools: {
    enabled: true
  },

  sentry: {
    org: 'cocina-para-vagos',
    project: 'ukiyo-web',
    autoInjectServerSentry: 'top-level-import'
  },

  sourcemap: {
    client: 'hidden'
  }
})