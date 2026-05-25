<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useCartStore } from '~/stores/cart';
import { useAuthStore } from '~/stores/auth';
import logoImg from '~/assets/logo.png';

type LocaleCode = 'es' | 'en';

const { locale, setLocale } = useI18n();
const localePath = useLocalePath();

const changeLanguage = (code: LocaleCode) => {
  setLocale(code);
};

// Rutas estáticas limpias para evitar conflictos con el router e i18n
const menuLinks = [
  { name: 'nav.home', path: '/' },
  { name: 'Carta', path: '/delivery' }, 
  { name: 'nav.offers', path: '/ofertas' },
  { name: 'nav.catering', path: '/catering' },
  { name: 'nav.contact', path: '/contacto' },
];

const isMenuOpen = ref(false);
const isDarkMode = ref(false);
const showScrollButton = ref(false);

const handleScroll = () => {
  showScrollButton.value = window.scrollY > 300;
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const cartStore = useCartStore();
const authStore = useAuthStore();
const cartCount = computed(() => cartStore?.count || 0);

const toggleMenu = () => { isMenuOpen.value = !isMenuOpen.value; };
const closeMenu = () => { isMenuOpen.value = false; };

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  const theme = isDarkMode.value ? 'dark' : 'light';
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  localStorage.setItem('theme', theme);
};

// Función de seguridad estricta para mitigar los warnings de rutas undefined
const resolveRoute = (path: string) => {
  if (!localePath) return path;
  const resolved = localePath(path);
  return resolved && !resolved.includes('undefined') ? resolved : path;
};

onMounted(() => {
  authStore.initAuth();
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDarkMode.value = true;
    document.documentElement.classList.add('dark');
  }
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <div class="w-full h-20 flex items-center bg-zinc-950 text-white dark:bg-[#fcfaf7] dark:text-zinc-950 transition-colors duration-300">
    <div class="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex justify-between items-center">

      <NuxtLink :to="resolveRoute('/')" class="flex items-center gap-2 group no-underline" @click="closeMenu">
        <div class="h-12 w-auto flex items-center">
           <img :src="logoImg" alt="Logo Ukiyo" class="h-full w-auto object-contain" width="48" height="48" />
        </div>
        <div class="flex flex-col leading-none">
          <span class="font-bold text-2xl tracking-widest text-white dark:text-zinc-950 uppercase">UKIYO</span>
          <small class="text-xs text-ukiyo-gold font-normal">浮世</small>
        </div>
      </NuxtLink>

      <div class="hidden md:flex space-x-6 lg:space-x-8 items-center">
        <NuxtLink 
          v-for="link in menuLinks" 
          :key="link.path" 
          :to="resolveRoute(link.path)" 
          class="nav-link-item" 
          active-class="active-link-item"
        >
          {{ link.name.startsWith('nav.') ? $t(link.name) : link.name }}
        </NuxtLink>
      </div>

      <div class="flex items-center gap-2 md:gap-3">
        
        <div class="hidden xs:flex items-center gap-2 border-r border-zinc-800 dark:border-zinc-300 pr-4 mr-1">
          <button @click="changeLanguage('es')" :class="locale === 'es' ? 'text-ukiyo-gold font-black' : 'text-zinc-400 dark:text-zinc-600 font-medium'" class="text-[11px] uppercase tracking-tighter hover:text-ukiyo-gold transition-all">ES</button>
          <span class="text-zinc-700 dark:text-zinc-400 text-[10px]">|</span>
          <button @click="changeLanguage('en')" :class="locale === 'en' ? 'text-ukiyo-gold font-black' : 'text-zinc-400 dark:text-zinc-600 font-medium'" class="text-[11px] uppercase tracking-tighter hover:text-ukiyo-gold transition-all">EN</button>
        </div>

        <button @click="toggleTheme" class="p-2 text-white dark:text-zinc-950 hover:text-ukiyo-gold transition-colors text-sm" aria-label="Cambiar tema">
          <span v-if="isDarkMode">☀️</span>
          <span v-else>🌙</span>
        </button>

        <NuxtLink :to="resolveRoute('/cart')" class="relative p-2.5 text-white dark:text-zinc-950 hover:text-ukiyo-gold transition-colors duration-300 flex items-center" aria-label="Ver carrito">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <span v-if="cartCount > 0" class="absolute -top-0.5 -right-0.5 bg-ukiyo-gold text-black text-[9px] font-black rounded-full w-4.5 h-4.5 flex items-center justify-center border border-zinc-950 dark:border-[#fcfaf7] animate-pulse">
            {{ cartCount }}
          </span>
        </NuxtLink>

        <template v-if="!authStore.isAuthenticated">
          <NuxtLink :to="resolveRoute('/login')" class="hidden sm:flex items-center gap-2 px-5 py-2 rounded-full transition-all duration-300 font-bold uppercase text-[10px] tracking-widest bg-ukiyo-gold text-black hover:bg-zinc-900 hover:text-white dark:hover:bg-zinc-900 shadow-md hover:scale-105 active:scale-95">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            <span>Entrar</span>
          </NuxtLink>
        </template>
        
        <template v-else>
          <div class="hidden sm:flex items-center gap-2 ml-1 text-xs font-bold text-zinc-400 dark:text-zinc-600">
            Mi Perfil (<span class="text-ukiyo-gold">{{ authStore.user?.profile?.username }}</span>)
          </div>
        </template>

        <button @click="toggleMenu" class="md:hidden p-2 text-white dark:text-zinc-950 hover:text-ukiyo-gold transition-colors ml-1" aria-label="Abrir menú">
          <span class="text-xl">☰</span>
        </button>
      </div>

    </div>

    <div v-show="isMenuOpen" class="md:hidden bg-zinc-950 dark:bg-[#fcfaf7] border-b border-zinc-900 dark:border-zinc-200 absolute w-full top-20 left-0 shadow-2xl transition-all z-50">
      <div class="px-4 pt-4 pb-8 flex flex-col items-center gap-1">
        <NuxtLink 
          v-for="link in menuLinks" 
          :key="link.path" 
          :to="resolveRoute(link.path)" 
          class="mobile-link-item" 
          @click="closeMenu"
        >
          {{ link.name.startsWith('nav.') ? $t(link.name) : link.name }}
        </NuxtLink>
      </div>
    </div>
    
  </div>
  <transition 
      enter-active-class="transition duration-300 ease-out" 
      enter-from-class="translate-y-10 opacity-0" 
      enter-to-class="translate-y-0 opacity-100" 
      leave-active-class="transition duration-200 ease-in" 
      leave-from-class="translate-y-0 opacity-100" 
      leave-to-class="translate-y-10 opacity-0"
    >
      <button 
        v-if="showScrollButton" 
        @click="scrollToTop" 
        class="fixed bottom-8 right-8 w-12 h-12 bg-ukiyo-gold text-black rounded-full shadow-2xl flex items-center justify-center z-[60] hover:bg-white hover:scale-110 transition-all active:scale-95" 
        aria-label="Volver arriba"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <path d="m5 12 7-7 7 7"/>
          <path d="M12 19V5"/>
        </svg>
      </button>
    </transition>
</template>

<style scoped>
/* Clases de utilidad pesadas para blindar el cambio de color de las tipografías */
.nav-link-item {
  @apply text-white dark:text-zinc-900 font-bold uppercase text-[10px] lg:text-xs tracking-widest hover:text-ukiyo-gold dark:hover:text-ukiyo-gold transition-colors py-2 border-b-2 border-transparent;
}
.active-link-item {
  @apply text-ukiyo-gold dark:text-ukiyo-gold border-ukiyo-gold;
}
.mobile-link-item {
  @apply block px-3 py-3 text-lg font-bold text-white dark:text-zinc-950 hover:text-ukiyo-gold uppercase tracking-widest transition-colors w-full text-center;
}
</style>