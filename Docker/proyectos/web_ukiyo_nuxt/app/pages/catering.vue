<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const localePath = useLocalePath();
const { t } = useI18n();

// 1. Fotos de catering (.jpeg)
const cateringImages = [
  '/catering/imagen1.jpeg',
  '/catering/imagen2.jpeg',
  '/catering/imagen3.jpeg',
  '/catering/imagen4.jpeg',
  '/catering/imagen5.jpeg'
];

const currentIndex = ref(0);
let timer: any = null;

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % cateringImages.length;
};

const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + cateringImages.length) % cateringImages.length;
};

// Lógica de temporizador automático
const startTimer = () => {
  stopTimer();
  timer = setInterval(nextSlide, 4500); 
};

const stopTimer = () => {
  if (timer) clearInterval(timer);
};

const manualNav = (direction: 'next' | 'prev') => {
  if (direction === 'next') nextSlide();
  else prevSlide();
  startTimer(); 
};

onMounted(() => {
  startTimer();
});

onUnmounted(() => {
  stopTimer();
});

const form = ref({
  nombre: '',
  email: '',
  fecha: '',
  invitados: '',
  tipoEvento: 'corporate',
  detalles: ''
});
</script>

<template>
  <div class="pb-20 bg-white dark:bg-ukiyo-dark">
    <div class="relative h-[60vh] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1920&auto=format&fit=crop" alt="Catering Ukiyo" class="w-full h-full object-cover opacity-90 dark:opacity-60">
        <div class="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-ukiyo-dark via-black/40 to-black/60"></div>
      </div>
      <div class="relative z-10 text-center px-4 mt-10">
        <p class="text-white/90 text-sm md:text-lg uppercase tracking-[0.3em] mb-4 font-light">Experiencias Exclusivas</p>
        <h1 class="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter"> UKIYO <span class="text-ukiyo-gold">EVENTS</span></h1>
        <p class="text-gray-200 text-lg max-w-2xl mx-auto font-light leading-relaxed"> Más que comida, creamos atmósferas. </p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 -mt-20 relative z-20 mb-20">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="service-card">
          <div class="text-4xl mb-4 bg-ukiyo-gold/10 w-16 h-16 flex items-center justify-center rounded-full">🏢</div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Eventos Corporativos</h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">Impresiona a tus clientes y socios con alta cocina japonesa de nivel ejecutivo.</p>
        </div>
        <div class="service-card">
          <div class="text-4xl mb-4 bg-ukiyo-gold/10 w-16 h-16 flex items-center justify-center rounded-full">💍</div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Bodas y Celebraciones</h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">El día más especial merece el mejor sabor. Estaciones de sushi en vivo (Showcooking).</p>
        </div>
        <div class="service-card">
          <div class="text-4xl mb-4 bg-ukiyo-gold/10 w-16 h-16 flex items-center justify-center rounded-full">🎉</div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Fiestas Privadas</h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">Lleva la experiencia Ukiyo a tu casa con nuestras bandejas personalizadas.</p>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 mb-24">
      <div class="flex flex-col md:flex-row items-center gap-12">
        <div class="w-full md:w-1/2">
          <h2 class="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-6 uppercase tracking-tighter"> EL ARTE DEL <span class="text-ukiyo-gold">DETALLE</span></h2>
          <p class="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed"> Nuestras bandejas de catering no son solo comida, son piezas de arte diseñadas para impactar visualmente antes del primer bocado. </p>
          <ul class="space-y-4 text-gray-700 dark:text-gray-400 font-medium italic">
            <li class="flex items-center gap-2"><span class="text-ukiyo-gold text-xl">✓</span> Pescado fresco cortado el mismo día. </li>
            <li class="flex items-center gap-2"><span class="text-ukiyo-gold text-xl">✓</span> Opciones veganas y sin gluten. </li>
            <li class="flex items-center gap-2"><span class="text-ukiyo-gold text-xl">✓</span> Presentación minimalista japonesa. </li>
          </ul>
        </div>

        <div class="w-full md:w-1/2 flex justify-center items-center">
          <div class="p-1.5 border-2 border-ukiyo-gold rounded-[2rem] shadow-2xl relative bg-transparent">
            <div class="relative w-full h-[400px] sm:w-[500px] rounded-[1.8rem] overflow-hidden bg-black group border-2 border-ukiyo-gold/30">
              <img 
                :src="cateringImages[currentIndex]" 
                alt="Sushi Catering Ukiyo" 
                class="w-full h-full object-cover"
              >
              <div class="absolute inset-0 flex items-center justify-between px-4 z-30 pointer-events-none">
                <button @click="manualNav('prev')" class="nav-button pointer-events-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                <button @click="manualNav('next')" class="nav-button pointer-events-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </button>
              </div>
              <div class="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-30">
                <span v-for="(_, i) in cateringImages" :key="i" 
                  class="h-1.5 rounded-full transition-all duration-300"
                  :class="currentIndex === i ? 'w-8 bg-ukiyo-gold' : 'w-2 bg-white/40'">
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-3xl mx-auto px-4">
      <div class="bg-white dark:bg-ukiyo-nav rounded-2xl shadow-xl border-t-4 border-ukiyo-gold p-8 md:p-12">
        <h2 class="text-3xl font-bold text-center text-gray-900 dark:text-white mb-10 uppercase tracking-tight">Solicita tu Presupuesto</h2>
        <form @submit.prevent class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input v-model="form.nombre" type="text" placeholder="Nombre / Empresa" class="input-style">
            <input v-model="form.email" type="email" placeholder="Email de contacto" class="input-style">
            <input v-model="form.fecha" type="date" class="input-style">
            <input v-model="form.invitados" type="number" placeholder="Nº Invitados" class="input-style">
          </div>
          <select v-model="form.tipoEvento" class="input-style">
            <option value="corporate">Evento Corporativo</option>
            <option value="wedding">Boda / Comunión</option>
            <option value="birthday">Fiesta Privada</option>
          </select>
          <textarea v-model="form.detalles" rows="4" class="input-style" placeholder="Cuéntanos más..."></textarea>
          <button type="submit" class="w-full py-4 bg-ukiyo-gold hover:bg-white text-black font-black uppercase tracking-widest rounded-lg transition-all shadow-lg hover:scale-[1.01]">
            Enviar Solicitud
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.service-card {
  @apply bg-white dark:bg-ukiyo-nav p-8 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2;
}

.input-style {
  @apply w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-ukiyo-gold outline-none;
}

.nav-button {
  @apply w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-ukiyo-gold hover:text-black transition-all shadow-xl;
}
</style>