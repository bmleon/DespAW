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

// Formulario que se autocompletará si el usuario está logueado y tiene datos guardados
const formCliente = ref({
  nombre: '',
  email: '',
  telefono: '',
  direccion: ''
});

onMounted(() => {
  // 1. Cargamos el nombre y email si el usuario inició sesión
  if (authStore.isAuthenticated && authStore.user) {
    formCliente.value.nombre = authStore.user.username || '';
    formCliente.value.email = authStore.user.email;
  }

  // 🌟 PERMANENCIA DE DATOS DE CLIENTE (Corregido para TS):
  // Usamos import.meta.client para que TypeScript no pida tipos de Node
  if (import.meta.client) {
    const telefonoGuardado = localStorage.getItem('ukiyo_cliente_telefono');
    const direccionGuardada = localStorage.getItem('ukiyo_cliente_direccion');
    
    if (telefonoGuardado) formCliente.value.telefono = telefonoGuardado;
    if (direccionGuardada) formCliente.value.direccion = direccionGuardada;
  }
});

const finalizarPedido = async () => {
  if (cartStore.items.length === 0) return;

  // Validaciones obligatorias
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

  try {
    // 🌟 PERSISTENCIA EN LOCALSTORAGE (Corregido para TS):
    if (import.meta.client) {
      localStorage.setItem('ukiyo_cliente_telefono', formCliente.value.telefono.trim());
      if (tipoEntrega.value === 'domicilio') {
        localStorage.setItem('ukiyo_cliente_direccion', formCliente.value.direccion.trim());
      }
    }

    // 🚀 BYPASS SIMULADO DE MICROSERVICIO (Resiliencia en Cliente):
    console.log('📦 Encolando orden en la pasarela interna de resiliencia...');
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Vaciamos el carrito de Pinia tras el éxito simulado
    cartStore.clear();
    
    // Viajamos directos a la vista de éxito integrada
    await navigateTo('/exito');

  } catch (error: any) {
    console.error('Error al enviar a cocina:', error);
    errorMessage.value = 'Hubo un error de conexión con la cocina. Por favor, inténtalo de nuevo.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>