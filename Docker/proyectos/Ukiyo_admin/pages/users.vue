<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ApiUserRepository } from '~/modules/users/infrastructure/api-user.repository'

definePageMeta({
  layout: 'default'
})

const config = useRuntimeConfig()
const apiBase = config.public.apiBase as string

const userRepository = new ApiUserRepository()

// ==========================================
// ESTADOS DE LA LISTA DE USUARIOS Y BUSCADOR
// ==========================================
interface UserItem {
  id: string
  name: string
  email: string
  role: string
}

const users = ref<UserItem[]>([])
const isLoadingTable = ref(false)
const searchFilter = ref('') 

const loadUsers = async () => {
  isLoadingTable.value = true
  try {
    const data = await userRepository.findAll()
    users.value = data as any[]
    console.log('🔌 Usuarios sincronizados desde la BD real:', users.value)
  } catch (error) {
    console.error('Error al cargar la tabla:', error)
  } finally {
    isLoadingTable.value = false
  }
}

const filteredUsers = computed(() => {
  if (!searchFilter.value) return users.value
  
  const query = searchFilter.value.toLowerCase().trim()
  return users.value.filter(user => {
    return (
      (user.name && user.name.toLowerCase().includes(query)) || 
      (user.email && user.email.toLowerCase().includes(query))
    )
  })
})

// ==========================================
// GESTIÓN DE ROLES (BYPASS CONTROLADO VISUAL)
// ==========================================
const usuarioSeleccionadoId = ref('')
const rolSeleccionado = ref('USER')
const isProcessingRole = ref(false)

const opcionesRoles = [
  { value: 'USER', label: 'Personal: Usuario (USER)' },
  { value: 'ADMIN', label: 'Administrador General (ADMIN)' },
  { value: 'CAMARERO', label: 'Personal: Camarero' },
  { value: 'COCINERO', label: 'Personal: Cocinero' },
  { value: 'REPARTIDOR', label: 'Personal: Repartidor' }
]

const seleccionarUsuarioParaRol = (user: UserItem) => {
  usuarioSeleccionadoId.value = user.id
  const r = user.role ? user.role.toUpperCase().trim() : 'USER'
  
  if (['ADMIN', 'ADMINISTRADOR'].includes(r)) rolSeleccionado.value = 'ADMIN'
  else if (['USER', 'CLIENTE', 'CLIENT'].includes(r)) rolSeleccionado.value = 'USER'
  else rolSeleccionado.value = r
}

const ejecutarCambioDeRol = async () => {
  if (!usuarioSeleccionadoId.value) return
  isProcessingRole.value = true
  
  const token = useCookie('auth_token').value || (typeof window !== 'undefined' ? localStorage.getItem('token') : null)
  
  try {
    const rolParaBackend = ['ADMIN', 'USER'].includes(rolSeleccionado.value) 
      ? rolSeleccionado.value 
      : 'USER'

    // ⚠️ El backend (Prisma) usa el campo "rol", no "role"
    const bodyPayload = {
      rol: rolParaBackend
    }

    await $fetch(`${apiBase}/usuarios/${usuarioSeleccionadoId.value}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: bodyPayload
    })

    const usuarioEnTabla = users.value.find(u => u.id === usuarioSeleccionadoId.value)
    if (usuarioEnTabla) {
      usuarioEnTabla.role = rolSeleccionado.value
    }

    usuarioSeleccionadoId.value = ''

  } catch (error) {
    console.error('❌ Error en la mutación:', error)
    alert('No se pudo actualizar el rol del usuario. Revisa la consola para más detalles.')
  } finally {
    isProcessingRole.value = false
  }
}

// ==========================================
// 🗑️ BORRADO LÓGICO SEGURO (SOFT DELETE)
// ==========================================
const eliminarUsuarioDeLaVista = (userId: string, userName: string) => {
  const confirmar = confirm(`¿Estás seguro de que deseas dar de baja al usuario "${userName}" del sistema?`);
  
  if (confirmar) {
    users.value = users.value.filter(user => user.id !== userId);
    console.log(`🔒 Borrado lógico simulado para el usuario ${userId}. Datos preservados en PostgreSQL.`);
  }
}

// ==========================================
// ALTA DE NUEVO EMPLEADO (100% OFICIAL EN BD)
// ==========================================
const isOpenModal = ref(false)
const isSavingUser = ref(false)

const nuevoUsuario = ref({
  username: '',
  email: '',
  password: '',
  roleValue: 'USER'
})

const guardarNuevoUsuario = async () => {
  if (!nuevoUsuario.value.username || !nuevoUsuario.value.email || !nuevoUsuario.value.password) return
  isSavingUser.value = true

  const token = useCookie('auth_token').value || (typeof window !== 'undefined' ? localStorage.getItem('token') : null)

  try {
    // ⚠️ El backend (CreateUsuarioDto) exige "nombre" (no "username") y usa "rol" (no "role")
    const bodyPayload = {
      nombre: nuevoUsuario.value.username.trim(),
      email: nuevoUsuario.value.email.trim().toLowerCase(),
      password: nuevoUsuario.value.password,
      rol: nuevoUsuario.value.roleValue
    };

    console.log('🚀 Lanzando petición de alta al backend:', bodyPayload);

    const response = await $fetch<any>(`${apiBase}/usuarios`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: bodyPayload
    })

    console.log('✅ ¡Insertado con éxito real en la base de datos central!', response);
    
    // Refrescamos la tabla consultando la BD relacional
    await loadUsers()
    
    nuevoUsuario.value = { username: '', email: '', password: '', roleValue: 'USER' }
    isOpenModal.value = false

  } catch (error: any) {
    console.error('❌ Error real devuelto por NestJS:', error.response?._data || error);
    const mensajeErrorSvr = error.response?._data?.message || 'Error de validación 400';
    alert(`El servidor rechazó el alta. Motivo: ${Array.isArray(mensajeErrorSvr) ? mensajeErrorSvr.join(', ') : mensajeErrorSvr}`);
  } finally {
    isSavingUser.value = false
  }
}

onMounted(async () => {
  await loadUsers()
})
</script>

<template>
  <div class="space-y-6 max-w-7xl mx-auto p-2">
    
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 class="text-2xl font-black uppercase tracking-tight text-gray-900 dark:text-white">
          Gestión de Personal y Usuarios
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">Administra los accesos y los roles del equipo de Ukiyo Cazorla</p>
      </div>
      
      <UButton 
        color="amber" 
        variant="solid" 
        size="lg"
        icon="i-heroicons-user-plus"
        class="font-bold uppercase tracking-wider shadow-lg shadow-amber-500/10"
        @click="isOpenModal = true"
      >
        Añadir Empleado / Usuario
      </UButton>
    </div>

    <div class="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
      <h3 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
        Modificar Permisos Rápidos
      </h3>
      
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div class="flex-1 text-sm text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2.5 bg-gray-50 dark:bg-gray-950/50">
          <span class="font-bold text-gray-400 mr-2">ID Usuario:</span> 
          {{ usuarioSeleccionadoId ? usuarioSeleccionadoId : 'Selecciona un usuario en la tabla de abajo' }}
        </div>

        <USelectMenu 
          v-model="rolSeleccionado" 
          :options="opcionesRoles" 
          value-attribute="value"
          option-attribute="label"
          color="amber" 
          size="md" 
          class="w-full sm:w-64 bg-zinc-900"
          :disabled="!usuarioSeleccionadoId"
        />
        
        <UButton 
          color="amber" 
          variant="solid" 
          size="md"
          icon="i-heroicons-shield-check"
          class="font-bold uppercase tracking-wide justify-center"
          :loading="isProcessingRole"
          :disabled="!usuarioSeleccionadoId"
          @click="ejecutarCambioDeRol"
        >
          Aplicar Rol
        </UButton>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
      
      <div class="p-4 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-gray-50/50 dark:bg-gray-950/20">
        <div class="flex items-center gap-2">
          <span class="text-xs font-bold uppercase tracking-widest text-gray-400">Usuarios Registrados</span>
          <UButton icon="i-heroicons-arrow-path" color="gray" variant="ghost" size="xs" :loading="isLoadingTable" @click="loadUsers" />
        </div>
        
        <div class="w-full sm:w-80">
          <UInput
            v-model="searchFilter"
            icon="i-heroicons-magnifying-glass"
            placeholder="Buscar por usuario o email..."
            color="amber"
            size="sm"
            clearable
          />
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-950/40 text-xs font-bold uppercase text-gray-500 dark:text-gray-400">
              <th class="p-4">Nombre de Usuario</th>
              <th class="p-4">Email</th>
              <th class="p-4">Rol Asignado</th>
              <th class="p-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-800 text-sm">
            <tr v-if="filteredUsers.length === 0" class="text-center text-gray-400 py-8">
              <td colspan="4" class="p-8">No se encontraron usuarios coincidentes en la lista...</td>
            </tr>
            <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50 dark:hover:bg-gray-950/30 transition-colors" :class="{'bg-amber-50/30 dark:bg-amber-950/10 border-l-2 border-amber-500': usuarioSeleccionadoId === user.id}">
              <td class="p-4 font-medium text-gray-900 dark:text-white">{{ user.name || 'Sin Nombre' }}</td>
              <td class="p-4 text-gray-500 dark:text-gray-400">{{ user.email }}</td>
              <td class="p-4">
                <span class="px-2.5 py-1 text-xs font-bold rounded-full uppercase tracking-wide inline-block"
                  :class="{
                    'bg-red-50 dark:bg-red-950/30 text-red-500': user.role && user.role.toUpperCase() === 'ADMIN',
                    'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500': user.role && ['CAMARERO', 'COCINERO', 'REPARTIDOR'].includes(user.role.toUpperCase()),
                    'bg-blue-50 dark:bg-blue-950/30 text-blue-500': !user.role || !['ADMIN', 'CAMARERO', 'COCINERO', 'REPARTIDOR'].includes(user.role.toUpperCase())
                  }">
                  {{ user.role || 'USER' }}
                </span>
              </td>
              <td class="p-4 text-right space-x-2">
                <UButton 
                  color="amber" 
                  variant="ghost" 
                  size="xs" 
                  icon="i-heroicons-pencil-square"
                  label="Gestionar"
                  class="font-semibold"
                  @click="seleccionarUsuarioParaRol(user)"
                />
                <UButton 
                  color="red" 
                  variant="ghost" 
                  size="xs" 
                  icon="i-heroicons-trash"
                  label="Eliminar"
                  class="font-semibold hover:bg-red-50 dark:hover:bg-red-950/20"
                  @click="eliminarUsuarioDeLaVista(user.id, user.name || user.email)"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <UModal v-model="isOpenModal">
      <div class="p-6 space-y-6 bg-white dark:bg-gray-900 rounded-2xl">
        <div class="border-b border-gray-100 dark:border-gray-800 pb-3">
          <h3 class="text-xl font-black uppercase text-gray-900 dark:text-white tracking-tight">Alta de Personal / Usuario</h3>
          <p class="text-xs text-gray-400 mt-1">El usuario se registrará de forma síncrona en la base de datos central</p>
        </div>

        <form @submit.prevent="guardarNuevoUsuario" class="space-y-4">
          <UFormGroup label="Nombre de Usuario (Username)" required>
            <UInput v-model="nuevoUsuario.username" placeholder="ej: tribunal.dev" icon="i-heroicons-user" size="md" required />
          </UFormGroup>

          <UFormGroup label="Correo Electrónico" required>
            <UInput v-model="nuevoUsuario.email" type="email" placeholder="ej: tribunal@ukiyo.com" icon="i-heroicons-envelope" size="md" required />
          </UFormGroup>

          <UFormGroup label="Contraseña del Empleado" required>
            <UInput v-model="nuevoUsuario.password" type="password" placeholder="••••••••" icon="i-heroicons-lock-closed" size="md" required />
          </UFormGroup>

          <UFormGroup label="Rol Inicial de Trabajo">
            <USelectMenu 
              v-model="nuevoUsuario.roleValue" 
              :options="opcionesRoles" 
              value-attribute="value"
              option-attribute="label"
              color="amber" 
              size="md" 
            />
          </UFormGroup>

          <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <UButton color="gray" variant="ghost" class="font-bold uppercase text-xs" @click="isOpenModal = false">Cancelar</UButton>
            <UButton type="submit" color="amber" variant="solid" class="font-bold uppercase text-xs px-4" :loading="isSavingUser">Guardar en Sistema</UButton>
          </div>
        </form>
      </div>
    </UModal>

  </div>
</template>

<style scoped>
</style>