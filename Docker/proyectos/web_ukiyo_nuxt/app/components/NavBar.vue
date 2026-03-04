<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useCartStore } from '~/stores/cart';
import { useAuthStore } from '~/stores/auth';
import logoImg from '~/assets/logo.png';

// --- i18n: LÓGICA DE IDIOMAS ---
// Le decimos a TypeScript que solo acepte 'es' o 'en' para evitar el error 2345
type LocaleCode = 'es' | 'en';

const { locale, setLocale } = useI18n();
const localePath = useLocalePath();

const changeLanguage = (code: LocaleCode) => {
  setLocale(code);
};

// Enlaces traducibles (usando las claves del JSON)
const menuLinks = [
  { name: 'nav.home', path: '/' },
  { name: 'nav.menu', path: '/delivery' },
  { name: 'nav.offers', path: '/ofertas' },
  { name: 'nav.catering', path: '/catering' },
  { name: 'nav.contact', path: '/contacto' },
];

// Estado del menú móvil y tema
const isMenuOpen = ref(false);
const isDarkMode = ref(false);

// --- LÓGICA DEL BOTÓN "VOLVER ARRIBA" ---
const showScrollButton = ref(false);

const handleScroll = () => {
  showScrollButton.value = window.scrollY > 300;
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Lógica de Pinia para el carrito y autenticación
const cartStore = useCartStore();
const authStore = useAuthStore();
const cartCount = computed(() => cartStore.count);

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

const handleLogout = () => {
  authStore.logout();
  closeMenu();
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
  <nav class="sticky top-0 z-50 w-full bg-white dark:bg-ukiyo-nav border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-20">

        <NuxtLink :to="localePath('/')" class="flex items-center gap-2 group no-underline" @click="closeMenu">
          <div class="h-12 w-auto flex items-center">
             <img :src="logoImg" alt="Logo Ukiyo" class="h-full w-auto object-contain" width="48" height="48" />
          </div>
          <div class="flex flex-col leading-none">
            <span class="font-bold text-2xl tracking-widest text-gray-900 dark:text-white uppercase">UKIYO</span>
            <small class="text-xs text-ukiyo-gold font-normal">浮世</small>
          </div>
        </NuxtLink>

        <div class="hidden md:flex space-x-6 lg:space-x-8 items-center">
          <NuxtLink 
            v-for="link in menuLinks" 
            :key="link.path" 
            :to="localePath(link.path)" 
            class="nav-link" 
            active-class="active-link"
          >
            {{ $t(link.name) }}
          </NuxtLink>
        </div>

        <div class="flex items-center gap-2 md:gap-4">
          
          <div class="hidden xs:flex items-center gap-2 border-r border-gray-200 dark:border-gray-700 pr-4 mr-1">
            <button 
              @click="changeLanguage('es')"
              :class="locale === 'es' ? 'text-ukiyo-gold font-black' : 'text-gray-400 font-medium'"
              class="text-[11px] uppercase tracking-tighter hover:text-ukiyo-gold transition-all"
            >
              ES
            </button>
            <span class="text-gray-300 dark:text-gray-700 text-[10px]">|</span>
            <button 
              @click="changeLanguage('en')"
              :class="locale === 'en' ? 'text-ukiyo-gold font-black' : 'text-gray-400 font-medium'"
              class="text-[11px] uppercase tracking-tighter hover:text-ukiyo-gold transition-all"
            >
              EN
            </button>
          </div>

          <template v-if="!authStore.isAuthenticated">
            <NuxtLink 
              :to="localePath('/login')" 
              class="hidden sm:flex items-center gap-2 px-5 py-2 rounded-full transition-all duration-300 font-bold uppercase text-[10px] tracking-widest group shadow-md hover:scale-105 active:scale-95 bg-gray-900 text-white hover:bg-black dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:rotate-12">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              <span class="hidden lg:inline">Entrar</span>
            </NuxtLink>
          </template>
          
          <template v-else>
            <div class="hidden sm:flex items-center gap-3">
              <span class="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest hidden lg:inline-block">
                Hola, <span class="text-ukiyo-gold">{{ authStore.user?.profile?.username }}</span>
              </span>
              <NuxtLink :to="localePath('/perfil')" class="text-[10px] font-bold text-gray-400 hover:text-ukiyo-gold uppercase tracking-widest transition-colors ml-1 mr-1">
                Mi Perfil
              </NuxtLink>
              <button @click="handleLogout" class="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors" title="Cerrar Sesión">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
              </button>
            </div>
          </template>

          <button @click="toggleTheme" class="p-2 text-gray-700 dark:text-gray-200 hover:text-ukiyo-gold transition-colors" aria-label="Cambiar tema">
            <span v-if="isDarkMode">☀️</span>
            <span v-else>🌙</span>
          </button>

          <NuxtLink 
            :to="localePath('/cart')" 
            class="relative px-5 py-2.5 bg-ukiyo-gold text-black rounded-full hover:scale-105 hover:bg-white transition-all shadow-lg shadow-ukiyo-gold/20 flex items-center gap-3 group"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <span class="font-bold text-sm md:text-base tracking-tight uppercase">Hacer Pedido</span>
            <span v-if="cartCount > 0" class="absolute -top-1 -right-1 bg-black dark:bg-white text-white dark:text-black text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center border-2 border-ukiyo-gold shadow-md">
              {{ cartCount }}
            </span>
          </NuxtLink>

          <button @click="toggleMenu" class="md:hidden p-2 text-gray-900 dark:text-white hover:text-ukiyo-gold transition-colors ml-1" aria-label="Abrir menú">
            <div class="w-6 h-0.5 bg-current mb-1.5 transition-all" :class="{'rotate-45 translate-y-2': isMenuOpen}"></div>
            <div class="w-6 h-0.5 bg-current mb-1.5 transition-all" :class="{'opacity-0': isMenuOpen}"></div>
            <div class="w-6 h-0.5 bg-current transition-all" :class="{'-rotate-45 -translate-y-2': isMenuOpen}"></div>
          </button>
        </div>
      </div>
    </div>

    <div v-show="isMenuOpen" class="md:hidden bg-white dark:bg-ukiyo-nav border-b dark:border-gray-800 absolute w-full left-0 shadow-2xl transition-all">
      <div class="px-4 pt-4 pb-8 flex flex-col items-center gap-2">
        <NuxtLink v-for="link in menuLinks" :key="link.path" :to="localePath(link.path)" class="mobile-link" @click="closeMenu">
          {{ $t(link.name) }}
        </NuxtLink>
        
        <div class="w-full border-t border-gray-100 dark:border-gray-800 my-4"></div>

        <div class="flex gap-8 mb-4">
            <button @click="changeLanguage('es')" :class="locale === 'es' ? 'text-ukiyo-gold font-bold underline' : 'text-gray-400'" class="text-xs tracking-widest">ESPAÑOL</button>
            <button @click="changeLanguage('en')" :class="locale === 'en' ? 'text-ukiyo-gold font-bold underline' : 'text-gray-400'" class="text-xs tracking-widest">ENGLISH</button>
        </div>
        
        <template v-if="!authStore.isAuthenticated">
          <NuxtLink :to="localePath('/login')" class="w-full flex justify-center items-center gap-2 font-bold uppercase text-xs tracking-widest py-4 rounded-xl shadow-sm transition-colors bg-gray-900 text-white dark:bg-white dark:text-gray-900" @click="closeMenu">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            Mi Cuenta / Entrar
          </NuxtLink>
        </template>
        
        <template v-else>
          <div class="w-full text-center mb-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
            Hola, <span class="text-ukiyo-gold">{{ authStore.user?.profile?.username }}</span>
          </div>
          
          <NuxtLink :to="localePath('/perfil')" class="w-full flex justify-center items-center gap-2 font-bold uppercase text-xs tracking-widest py-4 rounded-xl shadow-sm transition-colors border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 mb-2" @click="closeMenu">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
            </svg>
            Mi Perfil
          </NuxtLink>

          <button @click="handleLogout" class="w-full flex justify-center items-center gap-2 font-bold uppercase text-xs tracking-widest py-4 rounded-xl shadow-sm transition-colors border border-red-100 dark:border-red-900/50 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Cerrar Sesión
          </button>
        </template>
      </div>
    </div>

    <transition enter-active-class="transition duration-300 ease-out" enter-from-class="translate-y-10 opacity-0" enter-to-class="translate-y-0 opacity-100" leave-active-class="transition duration-200 ease-in" leave-from-class="translate-y-0 opacity-100" leave-to-class="translate-y-10 opacity-0">
      <button v-if="showScrollButton" @click="scrollToTop" class="fixed bottom-8 right-8 w-12 h-12 bg-ukiyo-gold text-black rounded-full shadow-2xl flex items-center justify-center z-[60] hover:bg-white hover:scale-110 transition-all active:scale-95" aria-label="Volver arriba">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
      </button>
    </transition>
  </nav>
</template>

<style scoped>
.nav-link {
  @apply text-gray-900 dark:text-gray-100 font-bold uppercase text-[10px] lg:text-xs tracking-widest hover:text-ukiyo-gold dark:hover:text-ukiyo-gold transition-colors py-2 border-b-2 border-transparent;
}

.active-link {
  @apply text-ukiyo-gold border-ukiyo-gold;
}

.mobile-link {
  @apply block px-3 py-3 text-lg font-bold text-gray-900 dark:text-white hover:text-ukiyo-gold dark:hover:text-ukiyo-gold uppercase tracking-widest transition-colors w-full text-center;
}

.mobile-link.router-link-active {
  @apply text-ukiyo-gold;
}
</style>