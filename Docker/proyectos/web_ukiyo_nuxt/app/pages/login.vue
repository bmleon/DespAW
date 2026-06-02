<!-- app/pages/login.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth';

interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    username: string;
    email: string;
    profile?: {
      id: string | number;
      username: string;
      avatarUrl?: string;
    };
  };
}

const authStore = useAuthStore();
const isLogin = ref(true);
const identificador = ref(''); 
const password = ref('');
const name = ref('');
const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const API_URL = 'https://ukiyocazorla.es/api';

const toggleAuth = () => {
  isLogin.value = !isLogin.value;
  errorMessage.value = '';
  successMessage.value = '';
};

const handleSubmit = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    if (isLogin.value) {
      // 🌟 FLUJO 1: INICIAR SESIÓN (Corregido: Mandamos solo email o lo que use vuestro DTO)
      const response = await $fetch<AuthResponse>(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { 
          email: identificador.value, 
          password: password.value 
        }
      });

      if (response?.access_token) {
        const userData = response.user;
        if (!userData.profile) {
          userData.profile = { id: userData.id, username: userData.username };
        }
        authStore.saveSession(userData, response.access_token);
        await navigateTo('/');
      }
    } else {
      // 🌟 FLUJO 2: REGISTRO
      await $fetch(`${API_URL}/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { 
          username: name.value, 
          email: identificador.value, 
          password: password.value 
        }
      });

      // 🌟 Auto-login tras registro (Corregido: Usamos la misma estructura de arriba)
      const loginResponse = await $fetch<AuthResponse>(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { 
          email: identificador.value, 
          password: password.value 
        }
      });

      authStore.saveSession(loginResponse.user, loginResponse.access_token);
      successMessage.value = '¡Cuenta creada con éxito!';
      setTimeout(async () => { await navigateTo('/'); }, 1500);
    }
  } catch (error: any) {
    console.error("Error Auth:", error);
    errorMessage.value = error.data?.message || 'Error al procesar la solicitud.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-ukiyo-dark">
    <div class="max-w-md w-full">
      <div class="bg-white dark:bg-ukiyo-nav p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800">
        <h2 class="text-3xl font-black text-center mb-8 uppercase tracking-tighter text-gray-900 dark:text-white">
          {{ isLogin ? 'Identifícate' : 'Registro' }}
        </h2>

        <form @submit.prevent="handleSubmit" class="space-y-5">
          <div v-if="!isLogin">
            <label class="block text-xs font-bold uppercase text-gray-400 mb-2">Usuario</label>
            <input v-model="name" type="text" required class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-transparent outline-none dark:text-white" />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase text-gray-400 mb-2">Email</label>
            <input v-model="identificador" type="email" required class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-transparent outline-none dark:text-white" />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase text-gray-400 mb-2">Contraseña</label>
            <input v-model="password" type="password" required class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-transparent outline-none dark:text-white" />
          </div>

          <div v-if="errorMessage" class="text-red-500 text-xs font-bold text-center p-2 bg-red-50 dark:bg-red-900/20 rounded-xl">{{ errorMessage }}</div>
          <div v-if="successMessage" class="text-green-500 text-xs font-bold text-center p-2 bg-green-50 dark:bg-green-900/20 rounded-xl">{{ successMessage }}</div>
          
          <button type="submit" :disabled="isLoading" class="w-full py-4 bg-ukiyo-gold rounded-xl font-black uppercase text-black hover:opacity-90 transition-all active:scale-95 disabled:opacity-50">
            {{ isLoading ? 'Cargando...' : (isLogin ? 'Entrar' : 'Crear Cuenta') }}
          </button>
        </form>

        <!-- 🌟 NUEVO: Enlace interactivo para alternar entre Login y Registro sin cambiar de página -->
        <div class="mt-6 text-center text-sm">
          <span class="text-gray-500 dark:text-gray-400">
            {{ isLogin ? '¿Aún no tienes cuenta?' : '¿Ya tienes una cuenta registrada?' }}
          </span>
          <button 
            type="button"
            @click="toggleAuth" 
            class="ml-1 text-ukiyo-gold font-bold hover:underline bg-transparent border-none cursor-pointer outline-none"
          >
            {{ isLogin ? 'Regístrate aquí' : 'Identifícate' }}
          </button>
        </div>

      </div>
    </div>
  </div>
</template>