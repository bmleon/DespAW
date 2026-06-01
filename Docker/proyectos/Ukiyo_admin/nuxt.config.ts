// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // 🌟 APAGAMOS EL RENDERIZADO EN EL SERVIDOR (Adiós errores de hidratación)
  ssr: false,

  // Volvemos a una fecha estable
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  
  modules: ['@nuxt/ui'],

  ui: {
    global: true
  },

  app: {
    head: {
      title: 'Ukiyo Admin Panel',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  },

  colorMode: {
    preference: 'dark' // Nota: Esto define el tema por defecto si el usuario no ha elegido uno
  },

  runtimeConfig: {
    public: {
      // SOLUCIÓN: Ponemos la URL "a fuego" aquí. 
      // Así nos aseguramos de que siempre apunte al Gateway de Kubernetes (30090).
      apiBase: 'https://ukiyocazorla.es'
    }
  }
})