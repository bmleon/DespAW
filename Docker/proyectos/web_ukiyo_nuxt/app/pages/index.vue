<script setup>
import { ref, onMounted } from 'vue';

const localePath = useLocalePath();

// Función de seguridad para mitigar las rutas undefined en la portada
const resolveRoute = (path) => {
  if (!localePath) return path;
  const resolved = localePath(path);
  return resolved && !resolved.includes('undefined') ? resolved : path;
};

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

// Lógica de control temporal de ambos vídeos sincronizados
const videoBackRef = ref(null);
const videoFrontRef = ref(null);

onMounted(() => {
  const vBack = videoBackRef.value;
  const vFront = videoFrontRef.value;
  
  if (!vBack || !vFront) return;

  vBack.currentTime = 7;
  vFront.currentTime = 7;

  vFront.addEventListener('timeupdate', () => {
    if (vFront.currentTime >= 37) {
      vBack.currentTime = 7;
      vFront.currentTime = 7;
      vBack.play();
      vFront.play();
    }
  });
});
</script>

<template>
  <div class="w-full">

    <div class="relative w-full h-[30vh] md:h-[45vh] bg-zinc-950 overflow-hidden border-b-4 border-ukiyo-gold flex items-center justify-center">
      <video 
        ref="videoBackRef"
        autoplay 
        muted 
        playsinline 
        loop
        class="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-110 pointer-events-none"
      >
        <source src="/ukiyo banner.mp4" type="video/mp4" />
      </video>

      <video 
        ref="videoFrontRef"
        autoplay 
        muted 
        playsinline 
        class="h-full max-w-full object-contain z-10 relative shadow-2xl"
      >
        <source src="/ukiyo banner.mp4" type="video/mp4" />
        Tu navegador no soporta vídeos.
      </video>

      <div class="absolute inset-0 bg-gradient-to-t from-zinc-950/20 via-transparent to-black/40 z-20 pointer-events-none"></div>
    </div>

    <div class="relative z-10 flex flex-col items-center justify-center py-16 md:py-24 text-center px-4 overflow-hidden">
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

      <div class="flex flex-col md:flex-row gap-4 w-full md:w-auto items-center">
        <NuxtLink :to="resolveRoute('/delivery')" class="w-4/5 md:w-auto px-10 py-3.5 bg-ukiyo-gold text-black font-bold rounded-full border-2 border-ukiyo-gold hover:shadow-[0_5px_15px_rgba(197,160,89,0.3)] hover:-translate-y-1 transition-all text-center">
          Ver Carta
        </NuxtLink>

        <NuxtLink :to="resolveRoute('/catering')" class="w-4/5 md:w-auto px-10 py-3.5 bg-transparent text-ukiyo-gold font-bold rounded-full border-2 border-ukiyo-gold hover:bg-ukiyo-gold hover:text-black hover:-translate-y-1 transition-all text-center">
          Catering
        </NuxtLink>

        <NuxtLink :to="resolveRoute('/contacto')" class="w-4/5 md:w-auto px-10 py-3.5 bg-transparent text-ukiyo-gold font-bold rounded-full border-2 border-ukiyo-gold hover:bg-ukiyo-gold hover:text-black hover:-translate-y-1 transition-all text-center">
          Contactanos
        </NuxtLink>
      </div>
    </div>

    <div class="relative z-10 py-12 text-center border-t border-ukiyo-gold/10">
      <div class="mb-16 px-4">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-8 uppercase tracking-widest">Horario del establecimiento</h2>
        <div class="grid grid-cols-2 md:grid-cols-7 gap-3 max-w-5xl mx-auto">
          <div
            v-for="(item, index) in schedule"
            :key="index"
            class="border border-gray-300 dark:border-gray-700 rounded-lg p-4 flex flex-col items-center justify-center bg-white dark:bg-zinc-800 hover:border-ukiyo-gold hover:-translate-y-1 transition-all shadow-sm"
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