<script setup>
// Importamos la imagen del logo explícitamente
import logoImg from '@/assets/logo.png';
</script>

<template>
  <!-- Fondo gris en modo claro / Negro puro en modo oscuro para contraste -->
  <footer class="bg-gray-100 dark:bg-black border-t-2 border-gray-200 dark:border-gray-800 transition-colors duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      <!-- Grid de 4 columnas (1 en móvil, 2 en tablet, 4 en PC) -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        <!-- 1. MARCA -->
        <div class="flex flex-col items-center md:items-start text-center md:text-left">
          <div class="flex items-center gap-2 mb-4">
            <div class="h-10 w-auto flex items-center justify-center">
               <img :src="logoImg" alt="Logo Ukiyo" class="h-full w-auto object-contain" />
            </div>
            <span class="font-bold text-xl tracking-widest text-gray-900 dark:text-white">
              UKIYO <small class="text-xs text-ukiyo-gold font-normal">浮世</small>
            </span>
          </div>
          <p class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-xs">
            La esencia de la cocina japonesa llevada a tu mesa. Tradición y vanguardia en cada bocado.
          </p>
        </div>

        <!-- 2. CONTACTO -->
        <div class="flex flex-col items-center md:items-start text-center md:text-left">
          <h3 class="text-ukiyo-gold font-bold uppercase tracking-widest mb-4 text-sm">Contacto</h3>
          <ul class="space-y-3 text-gray-700 dark:text-gray-300 text-sm">
            <li class="flex items-center gap-2 justify-center md:justify-start">
              <span class="text-ukiyo-gold">📍</span>
              <span>Pl. Corredera, 15, 23470 Cazorla, Jaén</span>
            </li>
            <li class="flex items-center gap-2 justify-center md:justify-start">
              <span class="text-ukiyo-gold">📞</span>
              <a href="tel:+34643925344" class="hover:text-ukiyo-gold transition-colors">+34 643 925 344</a>
            </li>
            <li class="flex items-center gap-2 justify-center md:justify-start">
              <span class="text-ukiyo-gold">✉️</span>
              <a href="mailto:ukiyocazorla@gmail.com" class="hover:text-ukiyo-gold transition-colors">ukiyocazorla@gmail.com</a>
            </li>
          </ul>
        </div>

        <!-- 3. SÍGUENOS -->
        <div class="flex flex-col items-center md:items-start text-center md:text-left">
          <h3 class="text-ukiyo-gold font-bold uppercase tracking-widest mb-4 text-sm">Síguenos</h3>
          <div class="flex space-x-4">
            <!-- Instagram -->
            <a href="https://www.instagram.com/ukiyo_cazorla?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" class="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-ukiyo-gold hover:text-black transition-all shadow-md" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
          </div>
        </div>

        <!-- 4. UBICACIÓN (MAPA) -->
        <div class="flex flex-col items-center md:items-start w-full">
          <h3 class="text-ukiyo-gold font-bold uppercase tracking-widest mb-4 text-sm">Ubicación</h3>
          <div class="w-full h-40 rounded-lg overflow-hidden shadow-lg border-2 border-white dark:border-gray-700">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3147.823478258608!2d-3.0028064!3d37.9111885!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd6fa903de6d1e1b%3A0xdd35d94336896180!2sUkiyo%20Cazorla%20Sushi!5e0!3m2!1ses!2ses!4v1764070715735!5m2!1ses!2ses" 
              width="100%" 
              height="100%" 
              style="border:0;" 
              allowfullscreen="" 
              loading="lazy" 
              referrerpolicy="no-referrer-when-downgrade">
            </iframe>
          </div>
        </div>

      </div>

      <!-- COPYRIGHT Y LEGAL -->
      <div class="mt-12 pt-8 border-t border-gray-300 dark:border-gray-800 text-center flex flex-col gap-2">
        <p class="text-gray-600 dark:text-gray-400 text-xs">
          &copy; {{ new Date().getFullYear() }} Ukiyo Cazorla Restaurante. Todos los derechos reservados.
        </p>
        
        <div class="flex justify-center gap-4 text-xs text-gray-500 dark:text-gray-500">
          <NuxtLink to="/condiciones" class="hover:text-ukiyo-gold transition-colors underline">
            Condiciones de Compra
          </NuxtLink>
          <span>|</span>
          <NuxtLink to="/privacidad" class="hover:text-ukiyo-gold transition-colors underline">
            Política de Privacidad
          </NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>