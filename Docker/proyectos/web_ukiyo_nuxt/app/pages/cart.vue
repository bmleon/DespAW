<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCartStore } from '~/stores/cart';
import { useAuthStore } from '~/stores/auth';

// Inicializamos la configuración dinámica
const config = useRuntimeConfig();
const cartStore = useCartStore();
const authStore = useAuthStore();

// --- Lógica Visual y de Interfaz ---
const removeItem = (index: number) => {
  cartStore.remove(index);
};

const clearCart = () => {
  cartStore.clear();
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(price);
};

// --- Lógica del Pedido para la API ---
const isSubmitting = ref(false);
const errorMessage = ref('');
const tipoEntrega = ref<'domicilio' | 'recogida'>('domicilio');

// Formulario que se autocompletará si el usuario está logueado
const formCliente = ref({
  nombre: '',
  email: '',
  telefono: '',
  direccion: ''
});

onMounted(() => {
  if (authStore.isAuthenticated && authStore.user) {
    formCliente.value.nombre = authStore.user.nombre;
    formCliente.value.email = authStore.user.email;
  }
});

const finalizarPedido = async () => {
  if (cartStore.items.length === 0) return;

  // Validaciones
  if (!formCliente.value.nombre || !formCliente.value.telefono) {
    errorMessage.value = 'Por favor, necesitamos un nombre y teléfono para procesar el pedido.';
    return;
  }
  if (tipoEntrega.value === 'domicilio' && !formCliente.value.direccion) {
    errorMessage.value = 'Necesitamos tu dirección para entregarte el pedido en casa.';
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = '';

  const productosFormateados = cartStore.items.map(item => ({
    producto_id: item.id,
    nombre: item.name,
    cantidad: item.quantity,
    precio_unitario: item.price
  }));

  const payload = {
    tipo_pedido: tipoEntrega.value,
    total: cartStore.total,
    productos: productosFormateados,
    cliente: {
      usuario_id: authStore.user?.id || null,
      nombre: formCliente.value.nombre,
      email: formCliente.value.email,
      telefono: formCliente.value.telefono,
      direccion: tipoEntrega.value === 'domicilio' ? formCliente.value.direccion : null
    }
  };

  try {
    const headers: Record<string, string> = {};
    if (authStore.token) {
      headers['Authorization'] = `Bearer ${authStore.token}`;
    }

    // Usamos la variable de entorno dinámica para conectar con el Kubernetes de tu compañero
    await $fetch(`${config.public.apiBase}/api/pedidos`, {
      method: 'POST',
      headers,
      body: payload
    });

    cartStore.clear();
    await navigateTo('/exito');

  } catch (error: any) {
    console.error('Error al enviar a cocina:', error);
    // Manejo de errores amigable
    errorMessage.value = error.data?.message || 'Hubo un error de conexión con la cocina. Por favor, inténtalo de nuevo.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-12">
    <div class="mb-10 text-center">
      <h1 class="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-widest">
        Tu <span class="text-ukiyo-gold">Pedido</span>
      </h1>
      <p class="text-gray-500 dark:text-gray-400 mt-2">Revisa tus productos antes de finalizar la compra</p>
    </div>

    <div v-if="cartStore.count === 0" class="text-center py-20 bg-white dark:bg-ukiyo-nav rounded-3xl border border-dashed border-gray-300 dark:border-gray-700 shadow-sm">
      <div class="text-6xl mb-6 text-gray-300">🍱</div>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Tu cesta está vacía</h2>
      <p class="text-gray-500 mb-8">Parece que aún no has añadido ninguna delicia japonesa.</p>
      <NuxtLink 
        to="/delivery" 
        class="inline-block px-8 py-3 bg-ukiyo-gold text-black font-black uppercase tracking-widest rounded-full hover:scale-105 transition-all shadow-lg shadow-ukiyo-gold/20"
      >
        Explorar Menú
      </NuxtLink>
    </div>

    <div v-else class="space-y-6">
      
      <div class="bg-white dark:bg-ukiyo-nav rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800">
        <ul class="divide-y divide-gray-100 dark:divide-gray-800">
          <li 
            v-for="(item, index) in cartStore.items" 
            :key="index"
            class="p-6 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
          >
            <div class="h-20 w-20 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden">
              <img v-if="item.image" :src="item.image" :alt="item.name" class="h-full w-full object-cover" />
              <div v-else class="h-full w-full flex items-center justify-center text-2xl text-gray-400">🥢</div>
            </div>

            <div class="flex-grow">
              <h3 class="font-bold text-gray-900 dark:text-white text-lg">{{ item.name }}</h3>
              <p class="text-ukiyo-gold font-bold">{{ formatPrice(item.price) }}</p>
              <p class="text-sm text-gray-500">Cantidad: {{ item.quantity || 1 }}</p>
            </div>

            <button 
              @click="removeItem(index)"
              class="p-2 text-gray-400 hover:text-red-500 transition-colors"
              title="Eliminar producto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>
              </svg>
            </button>
          </li>
        </ul>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        
        <button 
          @click="clearCart"
          class="text-sm font-bold text-gray-400 hover:text-red-500 transition-colors flex items-center gap-2 px-4"
        >
          <span>Vaciar todo el pedido</span>
        </button>

        <div class="bg-white dark:bg-ukiyo-nav p-8 rounded-3xl shadow-2xl border-t-4 border-ukiyo-gold">
          
          <div class="mb-6">
            <label class="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">¿Cómo lo quieres?</label>
            <div class="flex gap-2">
              <button 
                @click="tipoEntrega = 'domicilio'"
                :class="tipoEntrega === 'domicilio' ? 'bg-ukiyo-gold text-black' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'"
                class="flex-1 py-2 rounded-xl font-bold transition-all text-sm"
              >
                🛵 Domicilio
              </button>
              <button 
                @click="tipoEntrega = 'recogida'"
                :class="tipoEntrega === 'recogida' ? 'bg-ukiyo-gold text-black' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'"
                class="flex-1 py-2 rounded-xl font-bold transition-all text-sm"
              >
                🛍️ Recogida
              </button>
            </div>
          </div>

          <div class="space-y-3 mb-6">
            <input 
              v-model="formCliente.nombre" 
              type="text" 
              placeholder="Tu nombre completo" 
              class="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-ukiyo-gold focus:border-transparent outline-none transition-all dark:text-white"
            />
            <input 
              v-model="formCliente.telefono" 
              type="tel" 
              placeholder="Teléfono de contacto" 
              class="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-ukiyo-gold focus:border-transparent outline-none transition-all dark:text-white"
            />
            <input 
              v-if="tipoEntrega === 'domicilio'"
              v-model="formCliente.direccion" 
              type="text" 
              placeholder="Dirección completa de entrega" 
              class="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-ukiyo-gold focus:border-transparent outline-none transition-all dark:text-white"
            />
          </div>

          <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 text-sm rounded-xl font-bold border border-red-100 dark:border-red-800/50">
            {{ errorMessage }}
          </div>

          <div class="flex justify-between items-center mb-6 pt-4 border-t border-gray-100 dark:border-gray-800">
            <span class="text-gray-500 uppercase font-bold tracking-widest text-sm">Total Estimado</span>
            <span class="text-3xl font-black text-gray-900 dark:text-white">{{ formatPrice(cartStore.total) }}</span>
          </div>
          
          <button 
            @click="finalizarPedido"
            :disabled="isSubmitting"
            :class="isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-1 shadow-lg'"
            class="w-full py-4 bg-ukiyo-gold text-black font-black uppercase tracking-widest rounded-2xl transition-all mb-4"
          >
            {{ isSubmitting ? 'Procesando...' : 'Finalizar Pedido' }}
          </button>
          
          <NuxtLink 
            to="/delivery" 
            class="block text-center text-sm font-bold text-gray-500 hover:text-ukiyo-gold transition-colors"
          >
            ← Continuar comprando
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>