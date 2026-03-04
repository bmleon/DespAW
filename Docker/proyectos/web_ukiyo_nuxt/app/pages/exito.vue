<script setup lang="ts">
import { ref, onMounted } from 'vue';

// Variables reactivas para mostrar al usuario
const numeroPedido = ref('');
const tiempoEstimado = ref('');

onMounted(() => {
  // 1. Generamos un número de pedido ficticio temporalmente
  // Cuando el backend esté listo, esto lo leeremos de la URL (ej: /exito?id=123)
  numeroPedido.value = 'UKY-' + Math.floor(1000 + Math.random() * 9000);
  
  // 2. Calculamos la hora estimada (Hora actual + 40 minutos)
  const ahora = new Date();
  ahora.setMinutes(ahora.getMinutes() + 40);
  
  // Formateamos la hora para que salga bonita (ej. 21:45)
  tiempoEstimado.value = ahora.toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
});
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 py-20 text-center">
    <div class="bg-white dark:bg-ukiyo-nav p-10 md:p-16 rounded-3xl shadow-2xl border-t-4 border-ukiyo-gold relative overflow-hidden">
      
      <div class="absolute top-0 right-0 -mt-10 -mr-10 text-9xl opacity-5 dark:opacity-10 pointer-events-none">
        🎌
      </div>

      <div class="w-24 h-24 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-8 shadow-inner">
        <svg class="w-12 h-12 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>

      <h1 class="text-4xl md:text-5xl font-black text-gray-900 dark:text-white uppercase tracking-widest mb-4">
        ¡Oído <span class="text-ukiyo-gold">Cocina</span>!
      </h1>
      <p class="text-lg text-gray-500 dark:text-gray-400 mb-10">
        Tu pedido ha sido confirmado y ya estamos preparándolo con la mejor esencia de Japón.
      </p>

      <div class="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 mb-10 inline-block text-left border border-gray-100 dark:border-gray-700 shadow-sm">
        <div class="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
          
          <div>
            <p class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Número de pedido</p>
            <p class="text-3xl font-black text-gray-900 dark:text-white tracking-wider">{{ numeroPedido }}</p>
          </div>
          
          <div class="hidden md:block w-px h-16 bg-gray-200 dark:bg-gray-700"></div>
          
          <div>
            <p class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Hora estimada</p>
            <p class="text-3xl font-black text-ukiyo-gold">{{ tiempoEstimado }}</p>
          </div>

        </div>
      </div>

      <div class="flex flex-col sm:flex-row justify-center gap-4 mt-4">
        <NuxtLink 
          to="/" 
          class="px-8 py-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold uppercase tracking-widest rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          Volver al inicio
        </NuxtLink>
        <NuxtLink 
          to="/delivery" 
          class="px-8 py-4 bg-ukiyo-gold text-black font-black uppercase tracking-widest rounded-xl shadow-lg shadow-ukiyo-gold/20 hover:-translate-y-1 transition-all"
        >
          Ver la carta
        </NuxtLink>
      </div>
      
    </div>
  </div>
</template>