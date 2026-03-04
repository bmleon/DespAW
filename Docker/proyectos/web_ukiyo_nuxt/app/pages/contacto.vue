<script setup lang="ts">
import { ref } from 'vue';

// SEO: Configuración de metadatos para la página de contacto
useHead({
  title: 'Contacto | Ukiyo Cazorla',
  meta: [
    { name: 'description', content: 'Contacta con Ukiyo en Cazorla. Encuentra nuestra ubicación, teléfono y envíanos tus dudas sobre nuestra cocina japonesa, alérgenos o pedidos especiales.' }
  ]
})

// Datos del formulario reactivos
const form = ref({
  name: '',
  email: '',
  message: ''
});

// Errores para validación individual
const errors = ref({
  name: '',
  email: '',
  message: ''
});

const isSubmitting = ref(false);
const showSuccess = ref(false);

// --- VALIDACIONES EN TIEMPO REAL ---
const validateName = () => {
  errors.value.name = (!form.value.name || form.value.name.trim().length < 3) 
    ? 'El nombre debe tener al menos 3 caracteres.' : '';
};

const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  errors.value.email = (!form.value.email || !emailRegex.test(form.value.email))
    ? 'Introduce un email válido (ej: usuario@correo.com).' : '';
};

const validateMessage = () => {
  errors.value.message = (!form.value.message || form.value.message.trim().length < 10)
    ? 'El mensaje es demasiado corto (mín. 10 caracteres).' : '';
};

const validateAll = (): boolean => {
  validateName();
  validateEmail();
  validateMessage();
  return !Object.values(errors.value).some(error => error !== '');
};

// Función de envío simulada
const submitForm = () => {
  if (!validateAll()) return;

  isSubmitting.value = true;
  // Simulación de proceso
  setTimeout(() => {
    isSubmitting.value = false;
    showSuccess.value = true;
    
    // Resetear formulario y errores
    form.value = { name: '', email: '', message: '' };
    errors.value = { name: '', email: '', message: '' };
    
    // Ocultar mensaje de éxito tras 5 segundos
    setTimeout(() => showSuccess.value = false, 5000);
  }, 1500);
};
</script>

<template>
  <div class="pb-20">
    
    <div class="relative bg-white dark:bg-ukiyo-nav py-20 border-b border-gray-200 dark:border-gray-800 overflow-hidden">
      <div class="absolute top-0 right-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none transform translate-x-1/3 -translate-y-1/4">
         <svg viewBox="0 0 24 24" fill="currentColor" class="w-[600px] h-[600px] text-ukiyo-gold">
            <path d="M12 2L2 22h20L12 2zm0 3l7.5 15h-15L12 5z"/>
         </svg>
      </div>

      <div class="max-w-4xl mx-auto px-4 text-center relative z-10">
        <h1 class="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 uppercase tracking-widest">
          Nuestra <span class="text-ukiyo-gold">Esencia</span>
        </h1>
        
        <div class="bg-gray-50 dark:bg-gray-800/50 p-8 md:p-10 rounded-2xl border-l-4 border-ukiyo-gold shadow-sm text-left">
          <p class="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed font-light italic">
            "Ukiyo nace con la intención de introducir la cocina japonesa en Cazorla, adaptada al formato de comida para llevar. Su propuesta se centra en ofrecer un producto fresco, saludable y estéticamente cuidado, que combine tradición y modernidad."
          </p>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
      
      <div class="space-y-8">
        <div class="text-left">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-tight">Hablemos</h2>
          <p class="text-gray-600 dark:text-gray-400">
            ¿Tienes alguna duda sobre alérgenos? ¿Quieres organizar un catering grande o un pedido personalizado? Estamos aquí para escucharte.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="tel:+34643925344" class="group bg-white dark:bg-ukiyo-nav p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 hover:border-ukiyo-gold transition-all flex flex-col items-center text-center">
            <div class="w-12 h-12 bg-ukiyo-gold/10 text-ukiyo-gold rounded-full flex items-center justify-center text-2xl mb-3 group-hover:bg-ukiyo-gold group-hover:text-black transition-colors">📞</div>
            <h3 class="font-bold text-gray-900 dark:text-white mb-1 uppercase tracking-tighter">Llámanos</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 group-hover:text-ukiyo-gold transition-colors">643 925 344</p>
          </a>

          <a href="mailto:ukiyocazorla@gmail.com" class="group bg-white dark:bg-ukiyo-nav p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 hover:border-ukiyo-gold transition-all flex flex-col items-center text-center">
            <div class="w-12 h-12 bg-ukiyo-gold/10 text-ukiyo-gold rounded-full flex items-center justify-center text-2xl mb-3 group-hover:bg-ukiyo-gold group-hover:text-black transition-colors">✉️</div>
            <h3 class="font-bold text-gray-900 dark:text-white mb-1 uppercase tracking-tighter">Escríbenos</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 group-hover:text-ukiyo-gold transition-colors break-all italic">ukiyocazorla@gmail.com</p>
          </a>

          <a href="https://maps.app.goo.gl/LTXhmi2PPp6LECdE8" target="_blank" rel="noopener noreferrer" class="md:col-span-2 group bg-white dark:bg-ukiyo-nav p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 hover:border-ukiyo-gold transition-all flex flex-col items-center text-center">
            <div class="w-12 h-12 bg-ukiyo-gold/10 text-ukiyo-gold rounded-full flex items-center justify-center text-2xl mb-3 group-hover:bg-ukiyo-gold group-hover:text-black transition-colors">📍</div>
            <h3 class="font-bold text-gray-900 dark:text-white mb-1 uppercase tracking-tighter">Visítanos</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Pl. Corredera, 15, 23470 Cazorla, Jaén</p>
            <span class="text-xs text-ukiyo-gold mt-2 opacity-0 group-hover:opacity-100 transition-opacity font-bold">Abrir en Google Maps →</span>
          </a>
        </div>
      </div>

      <div class="bg-white dark:bg-ukiyo-nav p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 relative">
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b-2 border-ukiyo-gold inline-block pb-1 uppercase tracking-tighter">Envíanos un mensaje</h3>
        
        <form @submit.prevent="submitForm" class="space-y-6" novalidate>
          
          <div>
            <label for="contact-name" class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-tighter">Nombre completo</label>
            <input id="contact-name" v-model="form.name" type="text" required autocomplete="name" @blur="validateName"
              class="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border text-gray-900 dark:text-white focus:ring-2 focus:ring-ukiyo-gold outline-none transition-all"
              :class="errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'" placeholder="Tu nombre">
            <p class="text-[10px] text-red-500 font-bold mt-1.5 uppercase tracking-tight min-h-[1rem]" aria-live="polite">{{ errors.name }}</p>
          </div>

          <div>
            <label for="contact-email" class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-tighter">Correo electrónico</label>
            <input id="contact-email" v-model="form.email" type="email" required autocomplete="email" @blur="validateEmail"
              class="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border text-gray-900 dark:text-white focus:ring-2 focus:ring-ukiyo-gold outline-none transition-all"
              :class="errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'" placeholder="tu@email.com">
            <p class="text-[10px] text-red-500 font-bold mt-1.5 uppercase tracking-tight min-h-[1rem]" aria-live="polite">{{ errors.email }}</p>
          </div>

          <div>
            <label for="contact-message" class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-tighter">Mensaje</label>
            <textarea id="contact-message" v-model="form.message" rows="4" required @blur="validateMessage"
              class="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border text-gray-900 dark:text-white focus:ring-2 focus:ring-ukiyo-gold outline-none transition-all resize-none"
              :class="errors.message ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'" placeholder="¿En qué podemos ayudarte?"></textarea>
            <p class="text-[10px] text-red-500 font-bold mt-1.5 uppercase tracking-tight min-h-[1rem]" aria-live="polite">{{ errors.message }}</p>
          </div>

          <button type="submit" :disabled="isSubmitting" 
            class="w-full py-4 bg-ukiyo-gold text-black font-black uppercase tracking-widest rounded-lg hover:shadow-lg hover:-translate-y-1 transition-all disabled:opacity-50 flex justify-center items-center gap-2">
            <span v-if="isSubmitting">Enviando...</span>
            <span v-else>Enviar Mensaje</span>
            <svg v-if="!isSubmitting" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </form>

        <transition enter-active-class="transition duration-300" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100">
          <div v-if="showSuccess" class="absolute inset-0 bg-white/95 dark:bg-ukiyo-nav/95 z-50 flex flex-col items-center justify-center p-8 text-center rounded-2xl border-2 border-green-500">
            <div class="w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <h3 class="text-2xl font-black text-gray-900 dark:text-white uppercase mb-2">¡Mensaje Enviado!</h3>
            <p class="text-gray-600 dark:text-gray-400">Te responderemos muy pronto.</p>
          </div>
        </transition>

      </div>
    </div>
  </div>
</template>