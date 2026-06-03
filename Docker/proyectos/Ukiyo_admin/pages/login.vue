<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ApiUserRepository } from '~/modules/users/infrastructure/api-user.repository'

definePageMeta({
  layout: 'auth'
})

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const showError = ref(false)
const router = useRouter()

// Instanciamos el repositorio del módulo de usuarios
const userRepository = new ApiUserRepository()

const handleLogin = async () => {
  if (!email.value || !password.value) return

  isLoading.value = true
  showError.value = false

  // 🚀 Llama al método real que acabamos de meter en vuestro módulo
  const sesionReal = await userRepository.login(email.value, password.value)

  isLoading.value = false

  if (sesionReal) {
    // Si los datos son válidos, guardamos la sesión en el LocalStorage
    localStorage.setItem('user_session', JSON.stringify(sesionReal))
    // Saltamos directos al Dashboard
    router.push('/')
  } else {
    // Activamos la alerta visual de credenciales erróneas
    showError.value = true
  }
}
</script>

<template>
  <div class="w-full max-w-md">
    
    <div class="text-center mb-8">
      <h1 class="text-3xl font-black tracking-widest text-gray-900 dark:text-white mb-2">
        UKIYO <span class="text-amber-500 text-base font-normal">ADMIN</span>
      </h1>
      <p class="text-gray-500 text-sm">Acceso exclusivo para personal autorizado</p>
    </div>

    <UCard class="shadow-xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-gray-800">
      <form @submit.prevent="handleLogin" class="space-y-6">
        
        <p v-if="showError" class="text-xs text-red-500 font-bold uppercase tracking-tight text-center bg-red-50 dark:bg-red-950/30 py-2.5 rounded border border-red-200 dark:border-red-900/50">
          ❌ Usuario o contraseña incorrectos en el sistema.
        </p>

        <UFormGroup label="Correo Electrónico" name="email" required>
          <UInput 
            v-model="email" 
            type="email" 
            placeholder="admin@ukiyo.rest" 
            icon="i-heroicons-envelope" 
            autofocus
            size="md"
            required
          />
        </UFormGroup>

        <UFormGroup label="Contraseña" name="password" required>
          <UInput 
            v-model="password" 
            type="password" 
            placeholder="••••••••" 
            icon="i-heroicons-lock-closed" 
            size="md"
            required
          />
        </UFormGroup>

        <div class="flex items-center justify-between text-sm">
          <UCheckbox label="Recordarme" />
          <a href="#" class="text-amber-500 hover:text-amber-600 font-medium transition-colors">¿Olvidaste la contraseña?</a>
        </div>

        <UButton 
          type="submit" 
          block 
          color="amber" 
          size="lg" 
          class="font-bold uppercase tracking-wider justify-center"
          :loading="isLoading"
        >
          Iniciar Sesión
        </UButton>

      </form>
    </UCard>

    <p class="text-center text-gray-400 text-xs mt-8">
      &copy; {{ new Date().getFullYear() }} Ukiyo System. Panel de Control v1.0
    </p>

  </div>
</template>