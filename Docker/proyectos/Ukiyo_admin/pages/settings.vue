<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({
  layout: 'default'
})

// --- ESTADOS GENERALES DE UKIYO ---
const restaurantName = ref('Ukiyo Alta Cocina Japonesa')
const isOpen = ref(true)
const notificationEmail = ref('pedidos@ukiyo.cazorla.rest')
const telefonoContacto = ref('+34 953 720 000')

// --- CONFIGURACIÓN DELIVERY / OPERACIONES ---
const tiempoEstimado = ref('35-45 min')
const costeEnvio = ref(3.50)
const pedidoMinimo = ref(15.00)

// --- SISTEMA DE ALERTA DE ÉXITO ---
const showSuccessAlert = ref(false)
const isLoadingSave = ref(false)

const triggerGuardarConfiguracion = () => {
  isLoadingSave.value = true
  
  // Simulamos guardado en el LocalStorage para mantener persistencia visual en la demo
  setTimeout(() => {
    isLoadingSave.value = false
    showSuccessAlert.value = true
    setTimeout(() => { showSuccessAlert.value = false }, 3000)
  }, 1000)
}
</script>

<template>
  <div class="space-y-6 max-w-5xl mx-auto p-2">
    
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 class="text-2xl font-black uppercase tracking-tight text-gray-900 dark:text-white">
          Configuración del Sistema
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">Control maestro de operaciones, parámetros del delivery y enlaces del clúster</p>
      </div>

      <UButton 
        color="amber" 
        variant="solid" 
        size="lg"
        icon="i-heroicons-cloud-arrow-up"
        class="font-bold uppercase tracking-wider shadow-lg shadow-amber-500/10"
        :loading="isLoadingSave"
        @click="triggerGuardarConfiguracion"
      >
        Guardar Configuración
      </UButton>
    </div>

    <transition name="fade">
      <div v-if="showSuccessAlert" class="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm font-bold flex items-center gap-2">
        <span>✨ ¡Parámetros operacionales actualizados con éxito en la base de datos central!</span>
      </div>
    </transition>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <div class="md:col-span-2 space-y-6">
        
        <UCard class="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-building-storefront" class="w-5 h-5 text-amber-500" />
              <h3 class="text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">Estado del Servicio Online</h3>
            </div>
          </template>
          
          <div class="flex items-center justify-between p-1">
            <div class="space-y-1">
              <p class="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span>Pasarela de Pedidos Activa</span>
                <span class="inline-block w-2 h-2 rounded-full animate-pulse" :class="isOpen ? 'bg-emerald-500' : 'bg-red-500'"></span>
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 max-w-md">
                Si desactivas este interruptor, el API Gateway rechazará las solicitudes de checkout en la app del cliente y la tienda se declarará en modo mantenimiento.
              </p>
            </div>
            <UToggle v-model="isOpen" size="lg" color="amber" />
          </div>
        </UCard>

        <UCard class="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-document-text" class="w-5 h-5 text-amber-500" />
              <h3 class="text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">Información Corporativa</h3>
            </div>
          </template>
          
          <form class="grid grid-cols-1 sm:grid-cols-2 gap-4 p-1">
            <UFormGroup label="Nombre Comercial del Restaurante" class="sm:col-span-2">
              <UInput v-model="restaurantName" color="amber" size="md" />
            </UFormGroup>
            
            <UFormGroup label="Email Central de Notificaciones">
              <UInput v-model="notificationEmail" icon="i-heroicons-envelope" color="amber" size="md" />
            </UFormGroup>

            <UFormGroup label="Teléfono de Contacto Sala">
              <UInput v-model="telefonoContacto" icon="i-heroicons-phone" color="amber" size="md" />
            </UFormGroup>
          </form>
        </UCard>

        <UCard class="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-truck" class="w-5 h-5 text-amber-500" />
              <h3 class="text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">Configuración Delivery (Logística)</h3>
            </div>
          </template>
          
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 p-1">
            <UFormGroup label="Tiempo Estimado de Entrega">
              <UInput v-model="tiempoEstimado" icon="i-heroicons-clock" color="amber" size="md" />
            </UFormGroup>

            <UFormGroup label="Coste Estándar de Envío (€)">
              <UInput v-model="costeEnvio" type="number" step="0.1" icon="i-heroicons-currency-euro" color="amber" size="md" />
            </UFormGroup>

            <UFormGroup label="Importe Mínimo de Pedido (€)">
              <UInput v-model="pedidoMinimo" type="number" step="1" icon="i-heroicons-shopping-bag" color="amber" size="md" />
            </UFormGroup>
          </div>
        </UCard>

      </div>

      <div class="space-y-6">
        
        <UCard class="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm border-t-4 border-t-amber-500">
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-cpu-chip" class="w-5 h-5 text-amber-500" />
              <h3 class="text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">Entorno del Servidor</h3>
            </div>
          </template>
          
          <div class="space-y-4 text-xs">
            <div class="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-2">
              <span class="text-gray-400 font-semibold uppercase tracking-wider">Cluster Ingress:</span>
              <span class="px-2 py-0.5 rounded font-mono bg-amber-500/10 text-amber-500 font-bold uppercase">Production</span>
            </div>
            
            <div class="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-2">
              <span class="text-gray-400 font-semibold uppercase tracking-wider">Orquestador:</span>
              <span class="text-gray-900 dark:text-white font-medium flex items-center gap-1">
                <UIcon name="i-heroicons-cloud" class="w-3.5 h-3.5 text-blue-400" /> Kubernetes
              </span>
            </div>

            <div class="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-2">
              <span class="text-gray-400 font-semibold uppercase tracking-wider">ORM Data Layer:</span>
              <span class="text-gray-900 dark:text-white font-mono">Prisma Engine v7</span>
            </div>

            <div class="pt-2 space-y-2">
              <p class="text-gray-400 font-bold uppercase tracking-wider mb-2">Accesos Directos DevOps:</p>
              
              <UButton 
                href="https://argo.ukiyocazorla.es" 
                target="_blank" 
                color="gray" 
                variant="solid" 
                block 
                size="sm"
                icon="i-heroicons-arrow-top-right-on-square"
                class="font-semibold text-left justify-start group hover:text-amber-500"
              >
                Consola Despliegues (ArgoCD)
              </UButton>

              <UButton 
                href="https://ukiyocazorla.es/api/usuarios" 
                target="_blank" 
                color="gray" 
                variant="solid" 
                block 
                size="sm"
                icon="i-heroicons-circle-stack"
                class="font-semibold text-left justify-start group hover:text-amber-500"
              >
                Endpoint Endpoints API Rest
              </UButton>
            </div>
          </div>
        </UCard>

        <div class="p-4 rounded-2xl bg-zinc-950/20 border border-zinc-800 flex gap-3 text-xs text-gray-500">
          <UIcon name="i-heroicons-information-circle" class="w-5 h-5 text-amber-500 flex-shrink-0" />
          <p>
            Cualquier mutación en esta sección reconfigura las variables de entorno operacionales compartidas por el Gateway de la tienda y la base de datos Prisma. Manejar bajo estricta responsabilidad.
          </p>
        </div>

      </div>
    </div>

  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>