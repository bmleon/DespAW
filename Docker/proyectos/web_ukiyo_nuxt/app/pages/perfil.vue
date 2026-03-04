<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
const API_URL = 'http://ukiyocazorla.es/api';

// Campos del formulario
const username = ref('');
const email = ref(''); 
const password = ref(''); // Nuevo campo para la contraseña

// Estados de la interfaz
const isLoading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

// 🛡️ Proteger la ruta al entrar
onMounted(() => {
  authStore.initAuth();

  if (!authStore.isAuthenticated) {
    navigateTo('/login');
  } else {
    // Rellenamos con los datos actuales
    username.value = authStore.user?.profile?.username || authStore.user?.username || '';
    email.value = authStore.user?.email || '';
  }
});

const updateProfile = async () => {
  isLoading.value = true;
  successMessage.value = '';
  errorMessage.value = '';

  try {
    const headers = {
      'Authorization': `Bearer ${authStore.token}`
    };

    // 1. ACTUALIZAR SEGURIDAD (Email y/o Contraseña) en el modelo Usuario
    const userId = authStore.user?.id;
    const bodyUsuario: any = { email: email.value };
    
    // Solo mandamos la contraseña si el usuario ha escrito una nueva
    if (password.value.trim() !== '') {
      bodyUsuario.password = password.value;
    }

    // Suponemos que la ruta para editar al usuario es PATCH /usuarios/:id
    await $fetch(`${API_URL}/usuarios/${userId}`, {
      method: 'PATCH',
      headers,
      body: bodyUsuario
    });

    // 2. ACTUALIZAR IDENTIDAD (Nombre de usuario) en el modelo Perfil
    await $fetch(`${API_URL}/perfiles`, {
      method: 'PATCH',
      headers,
      body: {
        username: username.value
      }
    });

    // Si todo va bien, actualizamos la "memoria" de la web (Pinia y LocalStorage)
    if (authStore.user) {
      authStore.user.email = email.value;
      if (authStore.user.profile) {
        authStore.user.profile.username = username.value;
      } else {
        authStore.user.username = username.value;
      }
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_user', JSON.stringify(authStore.user));
      }
    }

    successMessage.value = '¡Tus datos se han actualizado con éxito!';
    password.value = ''; // Vaciamos la contraseña por seguridad visual
    
    setTimeout(() => { successMessage.value = ''; }, 4000);

  } catch (error: any) {
    console.error('Error al actualizar:', error);
    let msg = error.data?.message || 'Error al guardar los cambios. Revisa la conexión.';
    if (Array.isArray(msg)) msg = msg.join(', ');
    errorMessage.value = msg;
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen pt-12 pb-12 px-4 bg-gray-50 dark:bg-ukiyo-dark">
    <div class="max-w-2xl mx-auto">
      
      <div class="bg-white dark:bg-ukiyo-nav p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800">
        
        <div class="flex items-center gap-6 mb-10 border-b border-gray-100 dark:border-gray-800 pb-8">
          <div class="w-20 h-20 bg-ukiyo-gold rounded-full flex items-center justify-center text-3xl font-black text-black shadow-lg">
            {{ (username || 'U').charAt(0).toUpperCase() }}
          </div>
          <div>
            <h1 class="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Mi Perfil</h1>
            <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Gestiona tu cuenta y seguridad</p>
          </div>
        </div>

        <form @submit.prevent="updateProfile" class="space-y-6">
          
          <div>
            <label class="block text-xs font-bold uppercase text-gray-400 mb-2">Nombre de Usuario</label>
            <input 
              v-model="username" 
              type="text" 
              required 
              class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-transparent focus:ring-2 focus:ring-ukiyo-gold outline-none text-gray-900 dark:text-white transition-all" 
            />
          </div>

          <div>
            <label class="block text-xs font-bold uppercase text-gray-400 mb-2">Correo Electrónico</label>
            <input 
              v-model="email" 
              type="email" 
              required 
              class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-transparent focus:ring-2 focus:ring-ukiyo-gold outline-none text-gray-900 dark:text-white transition-all" 
            />
          </div>

          <div class="w-full border-t border-gray-100 dark:border-gray-800 my-6"></div>

          <div>
            <label class="block text-xs font-bold uppercase text-gray-400 mb-2">Nueva Contraseña</label>
            <input 
              v-model="password" 
              type="password" 
              placeholder="••••••••"
              class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-transparent focus:ring-2 focus:ring-ukiyo-gold outline-none text-gray-900 dark:text-white transition-all" 
            />
            <p class="text-[10px] text-gray-400 mt-2 italic">* Deja este campo en blanco si no quieres cambiar tu contraseña actual.</p>
          </div>

          <div v-if="errorMessage" class="text-red-500 text-xs font-bold text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-800">
            {{ errorMessage }}
          </div>
          
          <div v-if="successMessage" class="text-green-500 text-xs font-bold text-center bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-100 dark:border-green-800">
            {{ successMessage }}
          </div>

          <div class="pt-6">
            <button 
              type="submit" 
              :disabled="isLoading" 
              class="w-full md:w-auto px-10 py-4 bg-ukiyo-gold text-black font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] transition-all disabled:opacity-50 flex justify-center items-center gap-2"
            >
              <svg v-if="isLoading" class="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ isLoading ? 'Guardando...' : 'Guardar Cambios' }}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  </div>
</template>