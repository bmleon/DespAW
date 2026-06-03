<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ApiUserRepository } from '~/modules/users/infrastructure/api-user.repository'

definePageMeta({
  layout: 'auth'
})

const username = ref('') // ◄ Cambiado a username para aclararnos
const password = ref('')
const isLoading = ref(false)
const showError = ref(false)
const router = useRouter()

const userRepository = new ApiUserRepository()

const handleLogin = async () => {
  if (!username.value || !password.value) return

  isLoading.value = true
  showError.value = false

  // Enviamos los datos directamente al repositorio modificado
  const sesionReal = await userRepository.login(username.value, password.value)

  isLoading.value = false

  if (sesionReal) {
    localStorage.setItem('user_session', JSON.stringify(sesionReal))
    router.push('/')
  } else {
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

        <UFormGroup label="Nombre de Usuario" name="username" required>
          <UInput 
            v-model="username" 
            type="text" 
            placeholder="Introduce tu usuario (ej: prueba)" 
            icon="i-heroicons-user" 
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