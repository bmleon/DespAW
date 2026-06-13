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
  // FUNCIÓN AUXILIAR: Normaliza cualquier texto para emparejar categorías de forma segura
  const normalizar = (texto: string) => {
    return texto
      .toLowerCase()
      .trim()
      .replace(/s$/, '')      // Quita la 's' final
      .replace(/gui/g, 'gi'); // Soluciona "niguiri" vs "nigiri"
  };

  // 🌟 CASO 1: Si seleccionamos "TODO", ordenamos todos los platos por el orden de vuestras categorías
  if (selectedCategory.value === 'all') {
    // Hacemos una copia estructurada con [...array] para no mutar el estado original
    return [...menuItems.value].sort((a, b) => {
      if (!a.categoria) return 1;
      if (!b.categoria) return -1;

      const catA = normalizar(a.categoria);
      const catB = normalizar(b.categoria);

      // Buscamos en qué posición (índice) está la categoría en vuestro array de botones oficiales
      const indexA = categories.findIndex(c => catA.includes(normalizar(c.id)) || normalizar(c.id).includes(catA));
      const indexB = categories.findIndex(c => catB.includes(normalizar(c.id)) || normalizar(c.id).includes(catB));

      // Si una categoría no se encuentra en la lista, la mandamos al final
      const posA = indexA === -1 ? 999 : indexA;
      const posB = indexB === -1 ? 999 : indexB;

      return posA - posB;
    });
  }
  
  // 🌟 CASO 2: Si hay un filtro específico activo, aplicamos el filtrado ultra-tolerante
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
    image: product.descripcion 
  });
  triggerToast(product.nombre);
};
</script>