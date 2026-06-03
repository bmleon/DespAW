<script setup lang="ts">
import { ref } from 'vue'
import { ApiUserRepository } from '~/modules/users/infrastructure/api-user.repository'

const userRepository = new ApiUserRepository()

// Datos reactivos de prueba (Sustituye por tus variables reales del bucle v-for o el modal)
const usuarioSeleccionadoId = ref('983a98b2-a21b-4569-b570-f30e6d94571e') 

// 🌟 OPCIONES MAQUETADAS CON 'Cliente' EN VEZ DE 'USER'
const opcionesRoles = [
  { value: 'CLIENTE', label: 'Cliente' },
  { value: 'ADMIN', label: 'Administrador' },
  { value: 'CAMARERO', label: 'Personal: Camarero' },
  { value: 'COCINERO', label: 'Personal: Cocinero' },
  { value: 'REPARTIDOR', label: 'Personal: Repartidor' }
]

const rolSeleccionado = ref('CLIENTE')
const isProcessing = ref(false)

const ejecutarCambioDeRol = async () => {
  isProcessing.value = true
  
  // Enviamos el rol seleccionado (ADMIN, CLIENTE, COCINERO, etc.)
  await userRepository.updateRole(usuarioSeleccionadoId.value, rolSeleccionado.value as any)
  
  isProcessing.value = false
  
  // RECOMENDACIÓN: Descomenta la línea de abajo si tienes una función que recargue la tabla de usuarios
  // await cargarUsuariosBaseDatos()
}
</script>

<template>
  <div class="p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm max-w-xl">
    <h3 class="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">
      Gestión de Permisos de Empleados
    </h3>
    
    <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      <USelect 
        v-model="rolSeleccionado" 
        :options="opcionesRoles" 
        color="amber" 
        size="md" 
        class="flex-1"
      />
      
      <UButton 
        color="amber" 
        variant="solid" 
        size="md"
        icon="i-heroicons-arrow-path"
        class="font-bold uppercase tracking-wide justify-center"
        :loading="isProcessing"
        @click="ejecutarCambioDeRol"
      >
        Asignar Rol
      </UButton>
    </div>
  </div>
</template>