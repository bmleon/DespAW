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
      // FLUJO 1: INICIAR SESIÓN
      const response = await $fetch<AuthResponse>(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { 
          email: identificador.value, 
          username: identificador.value, 
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
      // FLUJO 2: REGISTRO
      await $fetch(`${API_URL}/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { 
          username: name.value, 
          email: identificador.value, 
          password: password.value 
        }
      });

      // Auto-login tras registro
      const loginResponse = await $fetch<AuthResponse>(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { username: identificador.value, password: password.value }
      });

      authStore.saveSession(loginResponse.user, loginResponse.access_token);
      successMessage.value = '¡Cuenta creada con éxito!';
      setTimeout(async () => { await navigateTo('/'); }, 1500);
    }
  } catch (error: any) {
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
        <h2 class="text-3xl font-black text-center mb-8 uppercase tracking-tighter">
          {{ isLogin ? 'Identifícate' : 'Registro' }}
        </h2>

        <form @submit.prevent="handleSubmit" class="space-y-5">
          <div v-if="!isLogin">
            <label class="block text-xs font-bold uppercase text-gray-400 mb-2">Usuario</label>
            <input v-model="name" type="text" required class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-transparent outline-none" />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase text-gray-400 mb-2">Email</label>
            <input v-model="identificador" type="text" required class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-transparent outline-none" />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase text-gray-400 mb-2">Contraseña</label>
            <input v-model="password" type="password" required class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-transparent outline-none" />
          </div>

          <div v-if="errorMessage" class="text-red-500 text-xs font-bold text-center p-2">{{ errorMessage }}</div>
          
          <button type="submit" :disabled="isLoading" class="w-full py-4 bg-ukiyo-gold rounded-xl font-black uppercase">
            {{ isLoading ? 'Cargando...' : (isLogin ? 'Entrar' : 'Crear Cuenta') }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>