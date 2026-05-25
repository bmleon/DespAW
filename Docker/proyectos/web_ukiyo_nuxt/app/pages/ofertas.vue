<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ApiOfertasRepository } from '~/infrastructure/repositories/ApiOfertasRepository';
import type { Oferta } from '~/core/domain/oferta.model';

// SEO: Configuración de metadatos optimizada
useHead({
  title: 'Ofertas Especiales | Ukiyo Cazorla',
  htmlAttrs: { lang: 'es' },
  meta: [
    { name: 'description', content: 'Descubre las mejores ofertas y promociones de Ukiyo en Cazorla. Packs de sushi, descuentos exclusivos y experiencias gastronómicas al mejor precio.' }
  ]
});

const ofertasRepository = new ApiOfertasRepository();
const ofertas = ref<Oferta[]>([]);
const isLoading = ref(true);

// Protector de enrutado para i18n y ciclo de vida seguro sin undefined warnings
const localePath = useLocalePath();
const resolveRoute = (path: string) => {
  if (!localePath) return path;
  const resolved = localePath(path);
  return resolved && !resolved.includes('undefined') ? resolved : path;
};

onMounted(async () => {
  try {
    const data = await ofertasRepository.obtenerOfertasActivas();
    ofertas.value = data || [];
  } catch (error) {
    console.error("Error cargando ofertas:", error);
  } finally {
    isLoading.value = false;
  }
});
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

    <div v-if="isLoading" class="flex flex-col items-center justify-center py-16 text-ukiyo-gold">
      <span class="animate-pulse text-xl uppercase font-black tracking-widest">Buscando ofertas...</span>
    </div>

    <main v-else-if="ofertas.length === 0" class="flex flex-col items-center justify-center py-16 text-center px-4">
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
        :to="resolveRoute('/delivery')" 
        class="inline-block px-10 py-4 bg-ukiyo-gold text-black font-black uppercase tracking-widest rounded-full hover:bg-white hover:scale-105 transition-all duration-300 shadow-lg shadow-ukiyo-gold/20 active:scale-95"
      >
        Ver Carta Habitual
      </NuxtLink>
    </main>

    <main v-else class="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
      <div 
        v-for="oferta in ofertas" 
        :key="oferta.id"
        class="group bg-white dark:bg-ukiyo-nav rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800 p-6 flex flex-col justify-between hover:border-ukiyo-gold transition-all duration-300"
      >
        <div>
          <div class="relative h-48 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 mb-4">
            <img :src="`/ofertas/${oferta.imagen}`" :alt="oferta.titulo" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
            <span class="absolute top-3 right-3 bg-ukiyo-gold text-black text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest">
              {{ oferta.descuentoTexto }}
            </span>
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-tight mb-2">{{ oferta.titulo }}</h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4 italic">{{ oferta.descripcion }}</p>
        </div>
        <div v-if="oferta.codigoPromocional" class="mt-4 p-3 bg-gray-50 dark:bg-black/20 rounded-xl text-center border border-dashed border-gray-200 dark:border-gray-700">
          <span class="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Código de cupón:</span>
          <strong class="block text-lg text-ukiyo-gold tracking-widest font-black mt-0.5">{{ oferta.codigoPromocional }}</strong>
        </div>
      </div>
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
.animate-pulse {
  animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.05); }
}
</style>