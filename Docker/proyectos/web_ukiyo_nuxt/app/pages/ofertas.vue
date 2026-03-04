<script setup lang="ts">
// SEO: Configuración de metadatos optimizada
useHead({
  title: 'Ofertas Especiales | Ukiyo Cazorla',
  htmlAttrs: { lang: 'es' },
  meta: [
    { name: 'description', content: 'Descubre las mejores ofertas y promociones de Ukiyo en Cazorla. Packs de sushi, descuentos exclusivos y experiencias gastronómicas al mejor precio.' }
  ]
})

// Simulamos una variable para controlar si hay ofertas (ahora en false)
const hasOffers = ref(false);
</script>

<template>
  <div class="pb-20 min-h-screen bg-gray-50 dark:bg-ukiyo-dark transition-colors duration-300">
    
    <header class="pt-16 pb-10 text-center px-4">
      <h1 class="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-widest">
        Ofertas <span class="text-ukiyo-gold">Especiales</span>
      </h1>
      <p class="text-gray-600 dark:text-gray-400 text-sm md:text-base max-w-2xl mx-auto uppercase tracking-tighter">
        Mantente atento a nuestras próximas promociones exclusivas.
      </p>
    </header>

    <main v-if="!hasOffers" class="flex flex-col items-center justify-center py-16 text-center px-4">
      <div 
        class="w-24 h-24 bg-white dark:bg-ukiyo-nav rounded-full flex items-center justify-center mb-8 text-4xl shadow-xl border border-gray-200 dark:border-gray-800 animate-pulse"
        aria-hidden="true"
      >
        🎁
      </div>
      
      <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-tight">
        No hay ofertas activas en este momento
      </h2>
      <p class="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-10 leading-relaxed italic">
        "Lo bueno se hace esperar. Estamos diseñando nuevos packs y sorpresas para que tu experiencia Ukiyo sea inolvidable."
      </p>
      
      <NuxtLink 
        to="/delivery" 
        class="inline-block px-10 py-4 bg-ukiyo-gold text-black font-black uppercase tracking-widest rounded-full hover:bg-white hover:scale-105 transition-all duration-300 shadow-lg shadow-ukiyo-gold/20 active:scale-95"
      >
        Ver Carta Habitual
      </NuxtLink>
    </main>

    <section class="max-w-4xl mx-auto px-4 mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="p-8 bg-white dark:bg-ukiyo-nav rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:border-ukiyo-gold transition-colors duration-300">
            <h3 class="text-ukiyo-gold font-black mb-3 uppercase text-sm tracking-widest">¿Quieres ser el primero?</h3>
            <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Síguenos en nuestras redes sociales para enterarte antes que nadie de los cupones descuento y platos de edición limitada.
            </p>
        </div>
        
        <div class="p-8 bg-white dark:bg-ukiyo-nav rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:border-ukiyo-gold transition-colors duration-300">
            <h3 class="text-ukiyo-gold font-black mb-3 uppercase text-sm tracking-widest">Packs para Grupos</h3>
            <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Si estás planeando una cena con amigos, contacta con nosotros para diseñar un menú degustación a medida con precio cerrado.
            </p>
        </div>
    </section>

  </div>
</template>

<style scoped>
/* Mejora el rendimiento visual de la animación */
.animate-pulse {
  animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.05); }
}
</style>