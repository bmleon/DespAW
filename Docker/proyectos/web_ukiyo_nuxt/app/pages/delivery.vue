<script setup lang="ts">
import { ref, computed } from 'vue';
import { useCartStore } from '~/stores/cart';

// Instanciamos el store de Pinia
const cartStore = useCartStore();

// --- SISTEMA DE NOTIFICACIONES (TOAST) ---
const toastMessage = ref('');
const showToast = ref(false);

const triggerToast = (productName: string) => {
  toastMessage.value = `¡${productName} añadido al pedido!`;
  showToast.value = true;
  // Ocultar después de 3 segundos
  setTimeout(() => {
    showToast.value = false;
  }, 3000);
};

// --- CATEGORÍAS OFICIALES ---
const categories = [
  { id: 'all', name: 'Todo' },
  { id: 'Entrantes', name: 'Entrantes' },
  { id: 'Hosomaki', name: 'Hosomaki' },
  { id: 'Nigiris', name: 'Nigiris' },
  { id: 'Futomakis', name: 'Futomakis' },
  { id: 'Uramakis', name: 'Uramakis' },
  { id: 'Novedades', name: 'Novedades!' }, 
  { id: 'Combos', name: 'Combos' },
  { id: 'Variados Ukiyo', name: 'Variados Ukiyo' },
  { id: 'Pokes', name: 'Pokes' },
  { id: 'Postres', name: 'Postres' },
  { id: 'Bebidas', name: 'Bebidas' },
  { id: 'Suplementos', name: 'Suplementos' },
];

const selectedCategory = ref('all');

// --- MENÚ COMPLETO UKIYO ---
const menuItems = ref([
  // 1. ENTRANTES (.jpg)
  { id: 1, name: 'Edamame', category: 'Entrantes', price: 4.5, description: 'Tiernas vainas de soja al vapor.', image: 'edamame.jpg', allergens: ['Soja'] },
  { id: 2, name: 'Ensalada Wakame', category: 'Entrantes', price: 4.0, description: 'Alga marina aliñada al estilo japonés.', image: 'wakame.jpg', allergens: ['Pescado', 'Soja', 'Sésamo'] },
  { id: 3, name: 'Gyozas Cerdo (5 Uds)', category: 'Entrantes', price: 5.5, description: 'Empanadillas a la plancha rellenas de cerdo.', image: 'gyozas_cerdo.jpg', allergens: ['Gluten', 'Huevo', 'Soja'] },
  { id: 4, name: 'Gyozas Pollo (5 Uds)', category: 'Entrantes', price: 5.5, description: 'Empanadillas a la plancha rellenas de pollo.', image: 'gyozas_pollo.jpg', allergens: ['Gluten', 'Huevos', 'Soja', 'Apio', 'Sésamo'] },
  { id: 5, name: 'Gyozas vegetales (5 Uds)', category: 'Entrantes', price: 6.0, description: 'Deliciosa empanadilla japonesa a la plancha.', image: 'gyozas_vegetales.jpg', allergens: ['Gluten', 'Soja', 'Sésamo', 'Huevos', 'Apio'] },
  { id: 6, name: 'Xiaolongbao (5 Uds)', category: 'Entrantes', price: 6.0, description: 'Raviolis chinos al vapor con relleno jugoso.', image: 'xiaolongbao.jpg', allergens: ['Gluten', 'Soja', 'Apio', 'Sésamo'] },

  // 2. HOSOMAKIS (.jpg)
  { id: 7, name: 'HOSOMAKI SALMON (8 Uds)', category: 'Hosomaki', price: 4.50, description: 'Clásico rollo de arroz de sushi con salmón fresco.', image: 'hosomaki_salmon.jpg', allergens: ['Pescado'] },
  { id: 8, name: 'HOSOMAKI ATUN (8 Uds)', category: 'Hosomaki', price: 4.90, description: 'Rollo fino de arroz de sushi con atún de calidad.', image: 'hosomaki_atun.jpg', allergens: ['Pescado'] },
  { id: 9, name: 'HOSOMAKI AGUACATE (8 Uds)', category: 'Hosomaki', price: 3.50, description: 'Suavidad vegetal en un bocado cremoso y ligero.', image: 'hosomaki_aguacate.jpg', allergens: ['Sésamo'] },

  // 3. NIGIRIS (.jpg)
  { id: 10, name: 'NIGUIRIS SALMÓN (2 Uds)', category: 'Nigiris', price: 4.10, description: 'Sencillo y elegante, salmón fresco sobre arroz.', image: 'nigiris_salmon.jpg', allergens: ['Pescado'] },
  { id: 11, name: 'NIGUIRIS ATÚN (2 Uds)', category: 'Nigiris', price: 4.50, description: 'Atún tierno y jugoso sobre arroz.', image: 'nigiris_atun.jpg', allergens: ['Pescado'] },
  { id: 12, name: 'NIGUIRIS SALMÓN FLAMEADO (2 Uds)', category: 'Nigiris', price: 4.50, description: 'Suave sabor ahumado y cremosa mayo japonesa.', image: 'nigiris_salmon_flameado.jpg', allergens: ['Huevos', 'Pescado', 'Sésamo'] },
  { id: 13, name: 'NIGUIRIS ATÚN FLAMEADO (2 Uds)', category: 'Nigiris', price: 5.00, description: 'Toque flameado que potencia su sabor.', image: 'nigiris_atun_flameado.jpg', allergens: ['Gluten', 'Pescado', 'Sésamo', 'Soja'] },

  // 4. FUTOMAKIS (.jpg)
  { id: 14, name: 'FUTOMAKI SAMURAI ROLL (8 Uds)', category: 'Futomakis', price: 10.50, description: 'Salmon, aguacate, pepino y mayo japonesa.', image: 'futomaki_samurai.jpg', allergens: ['Huevos', 'Pescado', 'Sésamo'] },
  { id: 15, name: 'FUTOMAKI UKIYO TROPICAL (8 Uds)', category: 'Futomakis', price: 10.50, description: 'Surimi, rúcula, mango y queso crema.', image: 'futomaki_tropical.jpg', allergens: ['Crustáceos', 'Huevos', 'Pescado', 'Sésamo', 'Lácteos'] },
  { id: 16, name: 'FUTOMAKI SAKE PASION (8 Uds)', category: 'Futomakis', price: 10.50, description: 'Salmón, mango, aguacate y mayo picante.', image: 'futomaki_sake_pasion.jpg', allergens: ['Huevos', 'Pescado'] },
  { id: 17, name: 'FUTOMAKI TOKIO HEAT (8 Uds)', category: 'Futomakis', price: 10.50, description: 'Atún, pepino, cebolla crujiente y quesochill.', image: 'futomaki_tokio_heat.jpg', allergens: ['Gluten', 'Pescado', 'Lácteos'] },
  { id: 18, name: 'FUTOMAKI EBI CRUNCH (8 Uds)', category: 'Futomakis', price: 10.50, description: 'Langostino en panko, aguacate, tobiko y queso.', image: 'futomaki_ebi_crunch.jpg', allergens: ['Gluten', 'Crustáceos', 'Pescado', 'Lácteos'] },
  { id: 19, name: 'FUTOMAKI NATURE ROLL (8 Uds)', category: 'Futomakis', price: 9.50, description: '100% Vegetal y lleno de color.', image: 'futomaki_nature.jpg', allergens: ['Gluten', 'Sésamo'] },

  // 5. URAMAKIS (.jpg)
  { id: 20, name: 'URAMAKI SAKE TOBIKO (8 Uds)', category: 'Uramakis', price: 12.90, description: 'Salmón, surimi y pepino con cobertura de tobiko.', image: 'uramaki_sake_tobiko.jpg', allergens: ['Crustáceos', 'Huevos', 'Pescado', 'Sésamo'] },
  { id: 21, name: 'URAMAKI EBI SALMÓN (8 Uds)', category: 'Uramakis', price: 12.90, description: 'Langostino crujiente, aguacate y queso con salmón.', image: 'uramaki_ebi_salmon.jpg', allergens: ['Gluten', 'Crustáceos', 'Pescado', 'Lácteos'] },
  { id: 22, name: 'URAMAKI TERIYAKI KANI (8 Uds)', category: 'Uramakis', price: 12.90, description: 'Fusión cremosa y ahumada con brillo dulce-salado.', image: 'uramaki_teriyaki_kani.jpg', allergens: ['Gluten', 'Crustáceos', 'Huevos', 'Pescado', 'Sésamo', 'Lácteos'] },
  { id: 23, name: 'URAMAKI SALMÓN FLAME ROLL (8 Uds)', category: 'Uramakis', price: 12.90, description: 'Equilibrio tropical y sabor ahumado.', image: 'uramaki_salmon_flame.jpg', allergens: ['Huevos', 'Pescado', 'Sésamo', 'Lácteos'] },
  { id: 24, name: 'URAMAKI GALDEN TROPIC (8 Uds)', category: 'Uramakis', price: 11.90, description: 'Combinación cálida y tropical.', image: 'uramaki_galden_tropic.jpg', allergens: ['Gluten', 'Huevos', 'Sésamo', 'Lácteos'] },
  { id: 25, name: 'URAMAKI VEGGIE AVOCADO (8 Uds)', category: 'Uramakis', price: 10.90, description: 'Fresco y equilibrado, pensado para veganos.', image: 'uramaki_veggie_avocado.jpg', allergens: ['Gluten', 'Huevos', 'Sésamo'] },

  // 6. NOVEDADES! (.jpg)
  { id: 26, name: 'COMBO DELUXE 20', category: 'Novedades', price: 24.90, description: 'Gyozas, combo 20 piezas y helado caliente a elegir.', image: 'combo_deluxe_20.jpg', allergens: ['Gluten', 'Crustáceos', 'Huevos', 'Pescado', 'Sésamo', 'Lácteos', 'Moluscos'] },

  // 7. COMBOS (.jpg)
  { id: 27, name: 'COMBO 12 PIEZAS "STARTER BOX"', category: 'Combos', price: 10.90, description: 'Hosomakis, Futomakis, Uramakis y Niguiris variados.', image: 'combo_starter_box.jpg', allergens: ['Gluten', 'Crustáceos', 'Huevos', 'Pescado', 'Sésamo', 'Lácteos'] },
  { id: 28, name: 'COMBO 16 PIEZAS "TOKYO VIBES"', category: 'Combos', price: 14.90, description: 'Selección de 16 piezas variadas del cocinero.', image: 'combo_tokyo_vibes.jpg', allergens: ['Gluten', 'Crustáceos', 'Huevos', 'Pescado', 'Sésamo', 'Lácteos'] },
  { id: 29, name: 'COMBO 20 PIEZAS "SUSHI LOVERS"', category: 'Combos', price: 18.90, description: '20 piezas pensadas para los amantes del sushi.', image: 'combo_sushi_lovers.jpg', allergens: ['Gluten', 'Crustáceos', 'Huevos', 'Pescado', 'Lácteos'] },
  { id: 30, name: 'COMBO 26 PIEZAS "UKIYO EXPERIENCE"', category: 'Combos', price: 25.90, description: 'La experiencia completa de Ukiyo en 26 piezas.', image: 'combo_ukiyo_experience.jpg', allergens: ['Gluten', 'Crustáceos', 'Huevos', 'Pescado', 'Sésamo', 'Lácteos', 'Moluscos'] },
  { id: 31, name: 'COMBO VEGANO (14 Piezas) "GREEN SOUL"', category: 'Combos', price: 13.90, description: 'Sushi 100% vegetal con Nature Roll y Hosomakis.', image: 'combo_vegano_green_soul.jpg', allergens: ['Sésamo'] },

  // 8. VARIADOS UKIYO (.jpg )
  { id: 32, name: 'VARIADO HOSO 12 PIEZAS', category: 'Variados Ukiyo', price: 9.90, description: 'Mix de hosomakis de salmón y atún.', image: 'variado_hoso_12.jpg', allergens: ['Pescado'] },
  { id: 33, name: 'VARIADO FUTOMAKIS 12 PIEZAS', category: 'Variados Ukiyo', price: 10.90, description: '4 Samurai, 4 Tropical y 4 Sake Pasion.', image: 'variado_futo_12.jpg', allergens: ['Gluten', 'Crustáceos', 'Huevos', 'Pescado', 'Sésamo', 'Lácteos'] },
  { id: 34, name: 'VARIADO URAS 12 PIEZAS', category: 'Variados Ukiyo', price: 12.90, description: '4 Sake Tobiko, 4 Ebi Salmón y 4 Teriyaki Kani.', image: 'variado_uras_12.jpg', allergens: ['Gluten', 'Crustáceos', 'Huevos', 'Pescado', 'Sésamo', 'Lácteos'] },
  { id: 35, name: 'VARIADO NIGUIRIS 6 PIEZAS', category: 'Variados Ukiyo', price: 7.90, description: '3 Niguiris de Salmón y 3 de Atún.', image: 'variado_niguiris_6.jpg', allergens: ['Pescado'] },
  { id: 36, name: 'VARIADO NIGUIRIS 12 PIEZAS', category: 'Variados Ukiyo', price: 10.90, description: 'Mix de niguiris clásicos y flameados.', image: 'variado_niguiris_12.png', allergens: ['Gluten', 'Huevos', 'Pescado', 'Sésamo', 'Soja'] },

  // 9. POKES (.jpg)
  { id: 37, name: 'POKE UKIYO', category: 'Pokes', price: 12.50, description: 'Comer sano y rico es fácil.', image: 'poke_ukiyo.jpg', allergens: ['Gluten', 'Crustáceos', 'Pescado', 'Soja', 'Sésamo'] },

  // 10. POSTRES (.jpg)
  { id: 40, name: 'MOCHIS MANGO (2 Uds)', category: 'Postres', price: 3.50, description: 'Relleno de crema de mango tropical.', image: 'mochi_mango.jpg', allergens: ['Gluten', 'Cacahuetes', 'Soja', 'Lácteos', 'Frutos de cáscara'] },
  { id: 41, name: 'MOCHIS CHEESECAKE FRAMBUESA (2 Uds)', category: 'Postres', price: 3.50, description: 'Fusión cheesecake y mochi.', image: 'mochi_cheesecake_frambuesa.jpg', allergens: ['Gluten', 'Lácteos'] },
  { id: 42, name: 'MOCHIS CHEESECAKE MANGO (2 Uds)', category: 'Postres', price: 3.50, description: 'Suave crema de queso y mango.', image: 'mochi_cheesecake_mango.jpg', allergens: ['Gluten', 'Lácteos'] },
  { id: 43, name: 'HELADO CALIENTE CHOCOLATE DUBAI', category: 'Postres', price: 4.50, description: 'Contraste térmico irresistible.', image: 'helado_dubai.jpg', allergens: ['Gluten', 'Lácteos', 'Frutos de cáscara'] },
  { id: 44, name: 'HELADO CALIENTE DOBLE COOKIES', category: 'Postres', price: 4.50, description: 'Doble sabor a galleta y chocolate.', image: 'helado_cookies.jpg', allergens: ['Gluten', 'Lácteos', 'Huevos'] },
  { id: 45, name: 'HELADO CALIENTE PERFECTO TURRÓN', category: 'Postres', price: 4.50, description: 'Sabor tradicional cálido.', image: 'helado_turron.jpg', allergens: ['Lácteos', 'Frutos de cáscara', 'Huevos'] },
  { id: 58, name: 'MOCHIS HELADO FRAMBUESA (2 Uds)', category: 'Postres', price: 3.50, description: 'Refrescante helado de frambuesa envuelto en mochi.', image: 'mochi_helado_frambuesa.jpg', allergens: ['Soja', 'Lácteos'] },

  // 11. BEBIDAS (.png)
  { id: 46, name: 'AGUA', category: 'Bebidas', price: 1.50, description: 'Agua mineral natural 50cl.', image: 'agua.png', allergens: [] },
  { id: 47, name: 'COCA COLA', category: 'Bebidas', price: 2.50, description: 'Refresco original 33cl.', image: 'cocacola.png', allergens: [] },
  { id: 48, name: 'COCA COLA ZERO', category: 'Bebidas', price: 2.50, description: 'Sabor original zero azúcar.', image: 'cocacola_zero.png', allergens: [] },
  { id: 49, name: 'COCA COLA ZERO ZERO', category: 'Bebidas', price: 2.50, description: 'Zero azúcar y zero cafeína.', image: 'cocacola_zero_zero.png', allergens: [] },
  { id: 50, name: 'FANTA NARANJA', category: 'Bebidas', price: 2.50, description: 'Refresco naranja 33cl.', image: 'fanta_naranja.png', allergens: [] },
  { id: 51, name: 'FANTA LIMÓN', category: 'Bebidas', price: 2.50, description: 'Refresco limón 33cl.', image: 'fanta_limon.png', allergens: [] },
  { id: 52, name: 'ACUARIUS', category: 'Bebidas', price: 2.50, description: 'Bebida isotónica 33cl.', image: 'acuarius.png', allergens: [] },
  { id: 53, name: 'NESTEA', category: 'Bebidas', price: 2.50, description: 'Té frío con limón 33cl.', image: 'nestea.png', allergens: [] },
  
  // CERVEZAS AGRUPADAS
  { id: 54, name: 'MAHOU ZERO', category: 'Bebidas', price: 2.50, description: 'Cerveza sin alcohol 33cl.', image: 'mahou_zero.png', allergens: ['Gluten'] },
  { id: 57, name: 'MAHOU 5 ESTRELLAS', category: 'Bebidas', price: 2.50, description: 'La clásica lager equilibrada 33cl.', image: 'mahou_5_estrellas.png', allergens: ['Gluten'] },
  { id: 55, name: 'CERVEZA JAPONESA', category: 'Bebidas', price: 3.00, description: 'Importación tradicional japonesa.', image: 'cerveza_japonesa.png', allergens: ['Gluten'] },
  
  // RESTO DE BEBIDAS
  { id: 56, name: 'VINO BLANCO OROYA', category: 'Bebidas', price: 11.80, description: 'Especial para maridar con Sushi 0.75L.', image: 'vino_oroya.jpg', allergens: ['Sulfitos'] },

  // 12. SUPLEMENTOS
  { id: 38, name: 'SALSA EXTRA', category: 'Suplementos', price: 0.50, description: 'Tu salsa favorita extra.', image: '', allergens: [] },
  { id: 39, name: 'ENVASE EXTRA', category: 'Suplementos', price: 0.50, description: 'Envase adicional para transporte.', image: '', allergens: [] }
]);

// LÓGICA DE FILTRADO
const filteredProducts = computed(() => {
  if (selectedCategory.value === 'all') return menuItems.value;
  return menuItems.value.filter(p => p.category === selectedCategory.value);
});

// FUNCIÓN PARA AÑADIR AL CARRITO
const addToCart = (product: any) => {
  cartStore.add({
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image ? `/comida/${product.image}` : ''
  });
  // Disparamos la notificación
  triggerToast(product.name);
};
</script>

<template>
  <div class="min-h-screen pb-20 relative">
    
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

    <div class="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div 
        v-for="product in filteredProducts" 
        :key="product.id"
        class="group bg-white dark:bg-ukiyo-nav rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-800 flex flex-col h-full hover:-translate-y-2"
      >
        <div class="relative h-56 overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <img 
            v-if="product.image"
            :src="`/comida/${product.image}`" 
            :alt="product.name" 
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            loading="lazy" 
          />
          <div v-else class="flex flex-col items-center opacity-30">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-ukiyo-gold">
                <path d="m15 11-1 9"/><path d="m19 11-4-7"/><path d="M2 11h20"/><path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4"/><path d="m9 11 1 9"/><path d="M5 11 9 4"/>
              </svg>
          </div>

          <div v-if="product.allergens && product.allergens.length > 0" class="absolute top-3 left-3 flex gap-1 flex-wrap">
            <span v-for="alg in product.allergens" :key="alg" class="bg-black/60 backdrop-blur-sm text-[9px] text-white px-2 py-0.5 rounded uppercase font-bold border border-white/20">
              {{ alg }}
            </span>
          </div>
        </div>

        <div class="p-6 flex flex-col flex-grow">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white group-hover:text-ukiyo-gold transition-colors duration-300 uppercase tracking-tighter mb-2">
            {{ product.name }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 flex-grow line-clamp-3 italic">
            {{ product.description }}
          </p>
          <div class="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
             <div class="text-2xl font-black text-gray-900 dark:text-white mb-4">
                {{ product.price.toFixed(2) }}€
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
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>