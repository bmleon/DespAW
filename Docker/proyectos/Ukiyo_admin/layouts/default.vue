<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ColorModeButton from '~/components/ColorModeButton.vue'

const links = [
  { label: 'Dashboard', icon: 'i-heroicons-home', to: '/' },
  { label: 'Usuarios', icon: 'i-heroicons-users', to: '/users' },
  { label: 'Carta / Menú', icon: 'i-heroicons-cake', to: '/menu' },
  { label: 'Pedidos Delivery', icon: 'i-heroicons-shopping-bag', to: '/orders' },
  // NUEVOS ENLACES
  { label: 'Solicitudes Eventos', icon: 'i-heroicons-calendar-days', to: '/events' },
  { label: 'Inventario', icon: 'i-heroicons-archive-box', to: '/inventory' },
  
  { label: 'Configuración', icon: 'i-heroicons-cog-6-tooth', to: '/settings' }
]

const isOpen = ref(false)

// 🌟 ESTADOS REACTIVOS PARA EL ADMINISTRADOR DINÁMICO
const userName = ref('Cargando...')
const userRole = ref('Personal')
const avatarUrl = ref('https://ui-avatars.com/api/?name=U&background=C5A059&color=fff')

onMounted(() => {
  // Recuperamos los datos de sesión generados en el login de forma dinámica
  const sessionData = localStorage.getItem('user_session')
  
  if (sessionData) {
    const session = JSON.parse(sessionData)
    userName.value = session.profile.username
    userRole.value = session.profile.role
    
    // Generamos la URL del avatar de forma dinámica pasando el nombre del admin logueado
    const nombreCodificado = encodeURIComponent(userName.value)
    avatarUrl.value = `https://ui-avatars.com/api/?name=${nombreCodificado}&background=C5A059&color=fff`
  } else {
    // Si intentan saltarse el login de forma directa, el guardián los expulsa
    navigateTo('/login')
  }
})
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
    
    <aside class="hidden md:flex w-64 flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      
      <div class="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
        <span class="font-black text-xl tracking-widest text-gray-900 dark:text-white">
          UKIYO <span class="text-ukiyo-gold text-xs font-normal">ADMIN</span>
        </span>
      </div>

      <div class="flex-1 overflow-y-auto py-4 px-3">
        <ClientOnly>
          <UVerticalNavigation :links="links" :ui="{
            padding: 'py-2.5',
            font: 'font-medium',
            active: 'text-gray-950 dark:text-ukiyo-gold bg-gray-100 dark:bg-gray-800 before:bg-ukiyo-gold',
            inactive: 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50'
          }" />
          <template #fallback>
            <div class="space-y-2">
              <div v-for="i in 5" :key="i" class="h-9 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
            </div>
          </template>
        </ClientOnly>
      </div>

      <div class="p-4 border-t border-gray-200 dark:border-gray-800">
        <div class="flex items-center gap-3">
          <ClientOnly>
            <UAvatar :src="avatarUrl" :alt="userName" size="sm" />
            <template #fallback>
              <div class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
            </template>
          </ClientOnly>
          <div class="text-sm">
            <p class="font-medium text-gray-900 dark:text-white">{{ userName }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ userRole }}</p>
          </div>
        </div>
      </div>
    </aside>

    <div class="flex-1 flex flex-col min-w-0">
      
      <header class="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 backdrop-blur-sm sticky top-0 z-40">
        <UButton icon="i-heroicons-bars-3" color="gray" variant="ghost" class="md:hidden" @click="isOpen = true" />
        <div class="hidden md:block text-sm text-gray-500 dark:text-gray-400">Panel de Control</div>
        
        <div class="flex items-center gap-2">
          <ColorModeButton />
          
          <UButton icon="i-heroicons-bell" color="gray" variant="ghost" />
        </div>
      </header>

      <main class="flex-1 overflow-auto p-4 md:p-8 relative">
        <slot />
      </main>
    </div>

    <ClientOnly>
      <USlideover v-model="isOpen" side="left">
        <div class="p-4 flex-1 flex flex-col bg-white dark:bg-gray-900 h-full">
          <div class="h-16 flex items-center mb-4 border-b border-gray-100 dark:border-gray-800">
            <span class="font-black text-xl tracking-widest text-gray-900 dark:text-white">UKIYO ADMIN</span>
          </div>
          <UVerticalNavigation :links="links" @click="isOpen = false" :ui="{
            active: 'text-gray-950 dark:text-ukiyo-gold bg-gray-100 dark:bg-gray-800'
          }" />
        </div>
      </USlideover>
    </ClientOnly>

  </div>
</template>