export default defineNuxtConfig({
  compatibilityDate: '2026-02-03',

  future: {
    compatibilityVersion: 4,
  },

  modules: [
    '@nuxtjs/tailwindcss', 
    '@pinia/nuxt', 
    '@nuxt/image',
    '@nuxtjs/i18n'
  ],

  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: 'es',
    // Apuntamos a la carpeta de traducciones
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
  }
})