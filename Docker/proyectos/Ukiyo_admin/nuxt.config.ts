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
      // Backend real en Render. Se puede sobreescribir con la variable de entorno
      // NUXT_PUBLIC_API_BASE (recomendado para producción en Vercel).
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'https://proyecto-ukiyo-backend.onrender.com'
    }
  }
})