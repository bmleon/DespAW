<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useCartStore } from '~/stores/cart';
import { ApiMenuRepository } from '~/infrastructure/repositories/ApiMenuRepository';
import type { Plato } from '~/core/domain/plato.model';

const cartStore = useCartStore();
const menuRepository = new ApiMenuRepository();

// --- ESTADOS REACTIVOS ---
const menuItems = ref<Plato[]>([]);
const isLoading = ref(true);
const selectedCategory = ref('all');
const toastMessage = ref('');
const showToast = ref(false);

// Protector de enrutado para mitigar warnings de rutas undefined
const localePath = useLocalePath();
const resolveRoute = (path: string) => {
  if (!localePath) return path;
  const resolved = localePath(path);
  return resolved && !resolved.includes('undefined') ? resolved : path;
};

// --- CARGA DINÁMICA DESDE LA BD ---
onMounted(async () => {
  menuItems.value = await menuRepository.obtenerCarta();
  isLoading.value = false;
});

// --- SISTEMA DE NOTIFICACIONES (TOAST) ---
const triggerToast = (productName: string) => {
  toastMessage.value = `¡${productName} añadido al pedido!`;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 3000);
};

// --- CATEGORÍAS OFICIALES ---
const categories = [
  { id: 'all', name: 'Todo' },
  { id: 'entrantes', name: 'Entrantes' },
  { id: 'hosomaki', name: 'Hosomaki' },
  { id: 'nigiris', name: 'Nigiris' },
  { id: 'futomakis', name: 'Futomakis' },
  { id: 'uramakis', name: 'Uramakis' },
  { id: 'novedades', name: 'Novedades!' }, 
  { id: 'combos', name: 'Combos' },
  { id: 'variados ukiyo', name: 'Variados Ukiyo' },
  { id: 'pokes', name: 'Pokes' },
  { id: 'postres', name: 'Postres' },
  { id: 'bebidas', name: 'Bebidas' },
  { id: 'suplementos', name: 'Suplementos' },
];

// --- LÓGICA DE FILTRADO Y ORDENACIÓN GLOBAL ---
const filteredProducts = computed(() => {
  const normalizar = (texto: string) => {
    return texto
      .toLowerCase()
      .trim()
      .replace(/s$/, '')      
      .replace(/gui/g, 'gi'); 
  };

  if (selectedCategory.value === 'all') {
    return [...menuItems.value].sort((a, b) => {
      if (!a.categoria) return 1;
      if (!b.categoria) return -1;

      const catA = normalizar(a.categoria);
      const catB = normalizar(b.categoria);

      const indexA = categories.findIndex(c => catA.includes(normalizar(c.id)) || normalizar(c.id).includes(catA));
      const indexB = categories.findIndex(c => catB.includes(normalizar(c.id)) || normalizar(c.id).includes(catB));

      const posA = indexA === -1 ? 999 : indexA;
      const posB = indexB === -1 ? 999 : indexB;

      return posA - posB;
    });
  }
  
  const filtroLimpio = normalizar(selectedCategory.value);

  return menuItems.value.filter(p => {
    if (!p.categoria) return false;
    const categoriaBDLimpia = normalizar(p.categoria);
    return categoriaBDLimpia === filtroLimpio || categoriaBDLimpia.includes(filtroLimpio) || filtroLimpio.includes(categoriaBDLimpia);
  });
});

// --- FUNCIÓN PARA AÑADIR AL CARRITO ---
const addToCart = (product: Plato) => {
  cartStore.add({
    id: product.id,
    name: product.nombre,
    price: product.precio,
    // 🌟 AHORA SÍ PASAMOS LA IMAGEN REAL AL CARRITO
    image: product.imagen 
  });
  triggerToast(product.nombre);
};
</script>

<template>
  <div class="min-h-screen pb-20 relative bg-gray-50 dark:bg-ukiyo-dark transition-colors duration-300">
    
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enter-to-class="transform translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100 sm:translate-x-0"
      leave-to-class="transform translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    >
      <div 
        v-if="showToast" 
        class="fixed bottom-6 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-auto sm:right-6 sm:bottom-6 z-50 bg-green-50 dark:bg-green-900/30 border border-green-500 text-green-700 dark:text-green-400 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 font-bold text-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        {{ toastMessage }}
      </div>
    </transition>

    <div class="pt-12 pb-8 text-center px-4">
      <h1 class="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-widest">
        Carta <span class="text-ukiyo-gold">Ukiyo</span>
      </h1>
      <p class="text-gray-600 dark:text-gray-400 text-sm md:text-base max-w-2xl mx-auto uppercase tracking-tighter italic font-light">
        "El mundo flotante de la gastronomía japonesa en tu mesa."
      </p>
    </div>

    <div class="sticky top-20 z-40 bg-white/95 dark:bg-ukiyo-nav/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 mb-8 shadow-sm">
      <div class="max-w-7xl mx-auto flex">
        <div class="overflow-x-auto no-scrollbar scroll-smooth flex items-center gap-3 px-4 py-4 w-full">
          <button 
            v-for="cat in categories" 
            :key="cat.id"
            @click="selectedCategory = cat.id"
            class="whitespace-nowrap px-6 py-2.5 rounded-full border-2 font-bold transition-all duration-300 text-xs uppercase tracking-widest flex-shrink-0"
            :class="selectedCategory === cat.id 
              ? 'bg-ukiyo-gold border-ukiyo-gold text-black shadow-lg shadow-ukiyo-gold/20' 
              : 'bg-transparent border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-ukiyo-gold hover:text-ukiyo-gold'"
          >
            {{ cat.name }}
          </button>
        </div>
      </div>
    </div>

    <div class="flex-grow max-w-7xl mx-auto px-4">
      <div class="flex flex-col items-center justify-center py-20 text-ukiyo-gold" v-if="isLoading">
        <span class="animate-pulse text-xl uppercase font-black tracking-widest">Cargando carta de la BD...</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" v-else-if="filteredProducts.length > 0">
        <div 
          v-for="product in filteredProducts" 
          :key="product.id"
          class="group bg-white dark:bg-ukiyo-nav rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-800 flex flex-col h-full hover:-translate-y-2"
        >
          <div class="relative h-56 overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <!-- 🌟 AHORA CARGAMOS LA IMAGEN REAL DESDE SUPABASE -->
            <img 
              v-if="product.imagen"
              :src="product.imagen" 
              :alt="product.nombre" 
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              loading="lazy" 
            />
            <div v-else class="flex flex-col items-center opacity-30">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-ukiyo-gold">
                <path d="m15 11-1 9"/><path d="m19 11-4-7"/><path d="M2 11h20"/><path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4"/><path d="m9 11 1 9"/><path d="M5 11 9 4"/>
              </svg>
            </div>
          </div>

          <div class="p-6 flex flex-col flex-grow">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white group-hover:text-ukiyo-gold transition-colors duration-300 uppercase tracking-tighter mb-2">
              {{ product.nombre }}
            </h3>
            <!-- 🌟 AHORA MOSTRAMOS LA DESCRIPCIÓN REAL ESCRITA EN EL PANEL -->
            <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 flex-grow line-clamp-3 italic">
              {{ product.descripcion }}
            </p>
            <div class="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
               <div class="text-2xl font-black text-gray-900 dark:text-white mb-4">
                  {{ product.precio.toFixed(2) }}€
               </div>
               <button 
                 @click="addToCart(product)"
                 class="w-full py-3.5 bg-ukiyo-gold text-black rounded-xl font-black uppercase tracking-widest text-xs transition-all duration-300 flex items-center justify-center gap-2 hover:bg-white hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
               >
                 <span>Añadir al pedido</span>
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
               </button>
            </div>
          </div>
        </div>
      </div>

      <!-- CONTENEDOR DE CONTROL -->
      <div v-if="filteredProducts.length === 0 && !isLoading" class="text-center py-20 text-gray-400 italic font-medium bg-white dark:bg-ukiyo-nav rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm max-w-2xl mx-auto px-4">
        No hay platos disponibles en la categoría {{ categories.find(c => c.id === selectedCategory)?.name }} en este momento.
      </div>
    </div>

  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>