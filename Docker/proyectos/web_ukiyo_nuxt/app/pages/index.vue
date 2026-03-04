<script setup>
// Datos para la sección de información
const schedule = [
  { day: 'LU', text: 'Cerrado', closed: true },
  { day: 'MA', text: 'Cerrado', closed: true },
  { day: 'MI', open: '19:30', close: '23:30' },
  { day: 'JU', open: '19:30', close: '23:30' },
  { day: 'VI', open: '19:30', close: '23:30' },
  { day: 'SA', open: '19:30', close: '23:30' },
  { day: 'DO', open: '19:30', close: '23:30' },
];

const services = [
  'Auto Servicio', 'Catering', 'Con amigos', 'Mastercard', 'Para celíacos', 'Sin gluten', 'Visa'
];
</script>

<template>
  <!-- CAMBIO: Quitamos 'min-h-screen' y 'bg-...' porque ya están en el layout default.vue -->
  <div class="w-full">

    <!-- 1. CONTENIDO PRINCIPAL (HERO) -->
    <!-- Ajustamos la altura para descontar el nav si queremos centrado perfecto, o dejamos auto -->
    <div class="relative z-10 flex flex-col items-center justify-center py-20 md:py-32 text-center px-4 overflow-hidden">
      <div class="mb-12">
        <p class="text-gray-800 dark:text-gray-200 text-sm md:text-2xl uppercase tracking-[0.3em] font-light mb-0 md:mb-[-1rem] relative z-20">
          Bienvenido a
        </p>
        <h1 class="font-black text-gray-900 dark:text-white leading-none flex flex-col md:flex-row items-center justify-center gap-0 md:gap-8 mt-4 md:mt-0 text-[18vw] md:text-9xl relative z-10">
          UKIYO
          <span class="text-ukiyo-gold font-normal text-[0.5em] md:text-[0.4em] mt-6 md:mt-0">浮世</span>
        </h1>
        <p class="text-ukiyo-gold text-lg md:text-2xl tracking-widest mt-4 font-medium">
          La esencia de Japón en tu mesa
        </p>
      </div>

      <!-- BOTONES -->
      <div class="flex flex-col md:flex-row gap-4 w-full md:w-auto items-center">
        <NuxtLink to="/delivery" class="w-4/5 md:w-auto px-10 py-3.5 bg-ukiyo-gold text-black font-bold rounded-full border-2 border-ukiyo-gold hover:shadow-[0_5px_15px_rgba(197,160,89,0.3)] hover:-translate-y-1 transition-all text-center">
          Ver Carta
        </NuxtLink>

        <NuxtLink to="/catering" class="w-4/5 md:w-auto px-10 py-3.5 bg-transparent text-ukiyo-gold font-bold rounded-full border-2 border-ukiyo-gold hover:bg-ukiyo-gold hover:text-black hover:-translate-y-1 transition-all text-center">
          Catering
        </NuxtLink>

        <NuxtLink to="/contacto" class="w-4/5 md:w-auto px-10 py-3.5 bg-transparent text-ukiyo-gold font-bold rounded-full border-2 border-ukiyo-gold hover:bg-ukiyo-gold hover:text-black hover:-translate-y-1 transition-all text-center">
          Contactanos
        </NuxtLink>
      </div>
    </div>

    <!-- 2. SECCIÓN DE HORARIOS Y SERVICIOS -->
    <div class="relative z-10 py-16 text-center border-t border-ukiyo-gold/20">

      <!-- Horario -->
      <div class="mb-16 px-4">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-8 uppercase tracking-widest">Horario del establecimiento</h2>

        <!-- Grid -->
        <div class="grid grid-cols-2 md:grid-cols-7 gap-3 max-w-5xl mx-auto">
          <div
            v-for="(item, index) in schedule"
            :key="index"
            class="border border-gray-300 dark:border-gray-700 rounded-lg p-4 flex flex-col items-center justify-center bg-white dark:bg-ukiyo-nav hover:border-ukiyo-gold hover:-translate-y-1 transition-all shadow-sm"
          >
            <div class="text-lg font-bold text-gray-900 dark:text-white mb-2">{{ item.day }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-300 leading-tight">
              <span v-if="item.closed" class="text-red-500 font-bold uppercase text-xs">{{ item.text }}</span>
              <div v-else class="flex flex-col">
                <span>{{ item.open }}</span>
                <span>{{ item.close }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Servicios -->
      <div class="px-4">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-widest">Servicios</h2>
        <div class="flex flex-col gap-2 text-lg text-gray-600 dark:text-gray-400 opacity-90">
          <span v-for="(service, index) in services" :key="index">
            {{ service }}
          </span>
        </div>
      </div>

    </div>

  </div>
</template>