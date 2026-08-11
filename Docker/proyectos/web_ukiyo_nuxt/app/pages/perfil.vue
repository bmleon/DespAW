<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';

const config = useRuntimeConfig();
const authStore = useAuthStore();

const API_URL = config.public.apiBase;

// Campos del formulario
const username = ref(''); // se guarda en el campo "nombre" de la tabla usuarios
const email = ref('');
const password = ref('');

// Estados de la interfaz
const isLoading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

onMounted(() => {
  authStore.initAuth();
  if (!authStore.isAuthenticated) {
    navigateTo('/login');
  } else {
    username.value = authStore.user?.nombre || authStore.user?.profile?.username || authStore.user?.username || '';
    email.value = authStore.user?.email || '';
  }
});

const updateProfile = async () => {
  isLoading.value = true;
  successMessage.value = '';
  errorMessage.value = '';

  try {
    const headers = {
      'Authorization': `Bearer ${authStore.token}`,
      'Content-Type': 'application/json'
    };

    const userId = authStore.user?.id;
    if (!userId) throw new Error("No se pudo identificar al usuario.");

    // Todo (nombre + email + password) se actualiza en un único PATCH a /usuarios/:id,
    // ya que el "perfil" vive dentro de la propia tabla usuarios (no hay módulo /perfiles aparte)
    const bodyUsuario: any = {
      nombre: username.value,
      email: email.value
    };

    if (password.value.trim() !== '') {
      bodyUsuario.password = password.value;
    }

    const usuarioActualizado = await $fetch<any>(`${API_URL}/usuarios/${userId}`, {
      method: 'PATCH',
      headers,
      body: bodyUsuario
    });

    // Actualizar estado local con lo que devuelve el backend
    if (authStore.user) {
      authStore.user.email = usuarioActualizado.email;
      authStore.user.nombre = usuarioActualizado.nombre;
      if (authStore.user.profile) {
        authStore.user.profile.username = usuarioActualizado.nombre;
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_user', JSON.stringify(authStore.user));
      }
    }

    successMessage.value = '¡Tus datos se han actualizado con éxito!';
    password.value = '';
    setTimeout(() => { successMessage.value = ''; }, 4000);

  } catch (error: any) {
    console.error('Error al actualizar:', error);
    let msg = error.data?.message || 'Error al guardar los cambios.';
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
            <input v-model="username" type="text" required class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-transparent focus:ring-2 focus:ring-ukiyo-gold outline-none text-gray-900 dark:text-white transition-all" />
          </div>

          <div>
            <label class="block text-xs font-bold uppercase text-gray-400 mb-2">Correo Electrónico</label>
            <input v-model="email" type="email" required class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-transparent focus:ring-2 focus:ring-ukiyo-gold outline-none text-gray-900 dark:text-white transition-all" />
          </div>

          <div class="w-full border-t border-gray-100 dark:border-gray-800 my-6"></div>

          <div>
            <label class="block text-xs font-bold uppercase text-gray-400 mb-2">Nueva Contraseña</label>
            <input v-model="password" type="password" placeholder="••••••••" class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-transparent focus:ring-2 focus:ring-ukiyo-gold outline-none text-gray-900 dark:text-white transition-all" />
            <p class="text-[10px] text-gray-400 mt-2 italic">* Deja en blanco para no cambiarla.</p>
          </div>

          <div v-if="errorMessage" class="text-red-500 text-xs font-bold text-center bg-red-50 p-3 rounded-lg border border-red-100">
            {{ errorMessage }}
          </div>

          <div v-if="successMessage" class="text-green-500 text-xs font-bold text-center bg-green-50 p-3 rounded-lg border border-green-100">
            {{ successMessage }}
          </div>

          <div class="pt-6">
            <button type="submit" :disabled="isLoading" class="w-full md:w-auto px-10 py-4 bg-ukiyo-gold text-black font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] transition-all disabled:opacity-50 flex justify-center items-center gap-2">
              <span v-if="isLoading">Guardando...</span>
              <span v-else>Guardar Cambios</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>