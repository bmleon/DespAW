<script setup>
import logoImg from '@/assets/logo.png';
</script>

<template>
  <div class="w-full bg-zinc-950 text-white dark:bg-[#fcfaf7] transition-colors duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        <div class="flex flex-col items-center md:items-start text-center md:text-left">
          <div class="flex items-center gap-2 mb-4">
            <div class="h-10 w-auto flex items-center justify-center">
               <img :src="logoImg" alt="Logo Ukiyo" class="h-full w-auto object-contain" />
            </div>
            <span class="font-bold text-xl tracking-widest text-white dark:text-zinc-950 uppercase">
              UKIYO <small class="text-xs text-ukiyo-gold font-normal">浮世</small>
            </span>
          </div>
          <p class="text-zinc-400 dark:text-zinc-700 text-sm leading-relaxed max-w-xs">
            La esencia de la cocina japonesa llevada a tu mesa. Tradición y vanguardia en cada bocado.
          </p>
        </div>

        <div class="flex flex-col items-center md:items-start text-center md:text-left">
          <h3 class="text-ukiyo-gold dark:text-zinc-950 font-bold uppercase tracking-widest mb-4 text-sm">
            Contacto
          </h3>
          <ul class="space-y-3 text-sm">
            <li class="flex items-center gap-2 justify-center md:justify-start">
              <span class="text-ukiyo-gold">📍</span>
              <span class="text-zinc-300 dark:text-zinc-800">Pl. Corredera, 15, 23470 Cazorla, Jaén</span>
            </li>
            <li class="flex items-center gap-2 justify-center md:justify-start">
              <span class="text-ukiyo-gold">📞</span>
              <a href="tel:+34643925344" class="hover:text-ukiyo-gold text-white dark:text-zinc-950 transition-colors font-medium">+34 643 925 344</a>
            </li>
            <li class="flex items-center gap-2 justify-center md:justify-start">
              <span class="text-ukiyo-gold">✉️</span>
              <a href="mailto:ukiyocazorla@gmail.com" class="hover:text-ukiyo-gold text-white dark:text-zinc-950 transition-colors font-medium">ukiyocazorla@gmail.com</a>
            </li>
          </ul>
        </div>

        <div class="flex flex-col items-center md:items-start text-center md:text-left">
          <h3 class="text-ukiyo-gold dark:text-zinc-950 font-bold uppercase tracking-widest mb-4 text-sm">
            Síguenos
          </h3>
          <div class="flex space-x-4">
            <a href="https://www.instagram.com/ukiyo_cazorla?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" class="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-900 dark:bg-zinc-200 text-zinc-300 dark:text-zinc-700 hover:bg-ukiyo-gold hover:text-black transition-all shadow-md" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
          </div>
        </div>

        <div class="flex flex-col items-center md:items-start w-full">
          <h3 class="text-ukiyo-gold dark:text-zinc-950 font-bold uppercase tracking-widest mb-4 text-sm">
            Ubicación
          </h3>
          <div class="w-full h-40 rounded-lg overflow-hidden shadow-lg border border-zinc-800 dark:border-zinc-300">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3163.467812345678!2d-3.001234567890123!3d37.91345678901234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDU0JzQ4LjQiTiAzwrAwMCcwNC40Ilc!5e0!3m2!1ses!2ses!4v1234567890123" 
              width="100%" 
              height="100%" 
              style="border:0;" 
              allowfullscreen="true" 
              loading="lazy" 
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

      </div>

      <div class="mt-12 pt-8 border-t border-zinc-900 dark:border-zinc-300 text-center flex flex-col gap-2">
        <p class="text-zinc-500 dark:text-zinc-600 text-xs">
          © 2026 Ukiyo Cazorla Restaurante. Todos los derechos reservados.
        </p>
        <div class="flex justify-center gap-4 text-xs text-zinc-500 dark:text-zinc-600">
          <NuxtLink to="/condiciones" class="hover:text-ukiyo-gold transition-colors underline">
            Conditions de Compra
          </NuxtLink>
          <span>|</span>
          <NuxtLink to="/privacidad" class="hover:text-ukiyo-gold transition-colors underline">
            Política de Privacidad
          </NuxtLink>
        </div>
      </div>

    </div>
  </div>
</template>