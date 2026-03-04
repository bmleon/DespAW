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

const API_URL = 'http://ukiyocazorla.es/api';

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
      // ==========================================
      // FLUJO 1: INICIAR SESIÓN MANUAL
      // ==========================================
      
      // Intento A: Enviamos el dato llamándolo 'email'
      let response = await $fetch<AuthResponse>(`${API_URL}/auth/login`, {
        method: 'POST',
        body: { email: identificador.value, password: password.value }
      }).catch(async () => {
        // Intento B (Si el A falla): Lo enviamos llamándolo 'username' en la misma fracción de segundo
        return await $fetch<AuthResponse>(`${API_URL}/auth/login`, {
          method: 'POST',
          body: { username: identificador.value, password: password.value }
        });
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
      // ==========================================
      // FLUJO 2: REGISTRO ORQUESTADO
      // ==========================================

      // PASO 1: Nace la cuenta (¡Comprobado que funciona!)
      await $fetch(`${API_URL}/usuarios`, {
        method: 'POST',
        body: {
          username: name.value, 
          email: identificador.value,
          password: password.value
        }
      });

      // Si llegamos aquí sin errores, LA CUENTA ESTÁ CREADA.
      // Ahora intentamos el Auto-Login y el Perfil de forma protegida.
      try {
        const loginResponse = await $fetch<AuthResponse>(`${API_URL}/auth/login`, {
          method: 'POST',
          body: { username: identificador.value, password: password.value }
        });

        const token = loginResponse.access_token;

        const profileResponse = await $fetch<any>(`${API_URL}/perfiles`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: { username: name.value }
        }).catch(() => null); // Si el perfil falla, no pasa nada

        const completeUser = {
          ...loginResponse.user,
          profile: {
            id: profileResponse?.id || loginResponse.user.id, 
            username: name.value
          }
        };

        authStore.saveSession(completeUser, token);
        successMessage.value = '¡Cuenta creada con éxito! Entrando...';
        setTimeout(async () => { await navigateTo('/'); }, 1500);

      } catch (autoLoginError) {
        // Si el Auto-Login falla por el Gateway de Fabricio, no asustamos al usuario.
        // La cuenta está creada en la base de datos, así que le pedimos que inicie sesión.
        successMessage.value = '¡Cuenta creada con éxito! Por favor, inicia sesión.';
        isLogin.value = true; // Pasamos a la vista de login
        password.value = ''; // Borramos la contraseña por seguridad
      }
    }
  } catch (error: any) {
    console.error('Error principal:', error);
    
    let msg = error.data?.message || 'Error al procesar la solicitud.';
    if (Array.isArray(msg)) msg = msg.join(', ');

    // Traductor de errores feos de Prisma
    if (typeof msg === 'string' && msg.includes('UniqueConstraintViolation')) {
      msg = 'Ese correo electrónico ya está registrado. Por favor, inicia sesión.';
    }
    
    errorMessage.value = msg;
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-ukiyo-dark">
    <div class="max-w-md w-full">
      <div class="bg-white dark:bg-ukiyo-nav p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800">
        
        <div class="text-center mb-8">
          <h2 class="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
            {{ isLogin ? 'Identifícate' : 'Registro' }}
          </h2>
          <p class="text-gray-500 dark:text-gray-400 text-sm mt-2 italic">Ukiyo Cazorla</p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-5">
          <div v-if="!isLogin">
            <label class="block text-xs font-bold uppercase text-gray-400 mb-2">Nombre de Usuario</label>
            <input v-model="name" type="text" required class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-transparent focus:ring-2 focus:ring-ukiyo-gold outline-none text-gray-900 dark:text-white transition-all" />
          </div>

          <div>
            <label class="block text-xs font-bold uppercase text-gray-400 mb-2">Email</label>
            <input v-model="identificador" type="email" required class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-transparent focus:ring-2 focus:ring-ukiyo-gold outline-none text-gray-900 dark:text-white transition-all" />
          </div>

          <div>
            <label class="block text-xs font-bold uppercase text-gray-400 mb-2">Contraseña</label>
            <input v-model="password" type="password" required class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-transparent focus:ring-2 focus:ring-ukiyo-gold outline-none text-gray-900 dark:text-white transition-all" />
          </div>

          <div v-if="errorMessage" class="text-red-500 text-xs font-bold text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-800">
            {{ errorMessage }}
          </div>
          
          <div v-if="successMessage" class="text-green-500 text-xs font-bold text-center bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-100 dark:border-green-800">
            {{ successMessage }}
          </div>

          <button type="submit" :disabled="isLoading" class="w-full py-4 bg-ukiyo-gold text-black font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] transition-all disabled:opacity-50 flex justify-center items-center gap-2">
            <svg v-if="isLoading" class="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ isLoading ? 'Cargando...' : (isLogin ? 'Entrar' : 'Crear Cuenta') }}</span>
          </button>

          <button type="button" @click="toggleAuth" class="w-full text-xs font-bold text-gray-500 uppercase tracking-widest mt-4">
            {{ isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>